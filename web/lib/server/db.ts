// Kết nối SQL Server theo từng người dùng: đăng nhập web = đăng nhập SQL login,
// nên GRANT/DENY trong DB được áp dụng thật cho mọi câu lệnh.
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import sql from 'mssql/msnodesqlv8';
import { ROLE_INFO, type Role } from '@/lib/roles';

export interface Session {
  id: string;
  username: string;
  role: Role;
  pool: sql.ConnectionPool;
}

const COOKIE = 'qlnhm_sid';

// Giữ phiên qua các lần hot-reload khi chạy dev
const g = globalThis as unknown as { __qlnhmSessions?: Map<string, Session> };
const sessions = (g.__qlnhmSessions ??= new Map());

const odbcValue = (v: string) => `{${v.replace(/}/g, '}}')}}`;

function connectionString(username: string, password: string) {
  const driver = process.env.DB_DRIVER ?? 'ODBC Driver 17 for SQL Server';
  const server = process.env.DB_SERVER ?? 'localhost';
  const database = process.env.DB_NAME ?? 'QuanLyNganHangMau';
  // Tùy chọn ODBC bổ sung, ví dụ khi kết nối VPS: "Encrypt=yes;TrustServerCertificate=yes;"
  const extra = (process.env.DB_ODBC_OPTIONS ?? '').trim();
  return `Driver={${driver}};Server=${server};Database=${database};UID=${odbcValue(username)};PWD=${odbcValue(password)};${extra}${extra && !extra.endsWith(';') ? ';' : ''}`;
}

export class LoiNghiepVu extends Error {}

/** Đăng nhập bằng SQL login, xác định vai trò qua IS_ROLEMEMBER */
export async function dangNhap(username: string, password: string): Promise<Session> {
  // connectionString là tùy chọn riêng của driver msnodesqlv8, @types/mssql chưa khai báo
  const pool = new sql.ConnectionPool({ connectionString: connectionString(username, password) } as unknown as sql.config);
  try {
    await pool.connect();
  } catch (e) {
    if (/login failed/i.test((e as Error).message ?? '')) throw new LoiNghiepVu('Sai tên đăng nhập hoặc mật khẩu.');
    throw new LoiNghiepVu('Không kết nối được SQL Server. Kiểm tra dịch vụ SQL Server và file .env.local.');
  }

  const r = await pool.request().query<Record<Role, number>>(
    `SELECT IS_ROLEMEMBER('${ROLE_INFO.nhanvien.sqlRole}') AS nhanvien,
            IS_ROLEMEMBER('${ROLE_INFO.bacsi.sqlRole}') AS bacsi,
            IS_ROLEMEMBER('${ROLE_INFO.quanly.sqlRole}') AS quanly`,
  );
  const row = r.recordset[0];
  const role = (['nhanvien', 'bacsi', 'quanly'] as Role[]).find((k) => row[k] === 1);
  if (!role) {
    await pool.close();
    throw new LoiNghiepVu('Tài khoản này không thuộc nhóm người dùng nào của hệ thống.');
  }

  const session: Session = { id: randomUUID(), username, role, pool };
  sessions.set(session.id, session);
  (await cookies()).set(COOKIE, session.id, { httpOnly: true, sameSite: 'lax', path: '/' });
  return session;
}

export async function dangXuat() {
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  const s = id ? sessions.get(id) : undefined;
  if (s) {
    sessions.delete(s.id);
    await s.pool.close().catch(() => {});
  }
  store.delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const id = (await cookies()).get(COOKIE)?.value;
  return (id && sessions.get(id)) || null;
}

/** Bắt buộc đăng nhập; nếu vai trò không được vào màn hình thì chuyển về trang chính của vai trò */
export async function requireSession(allowed?: Role[]): Promise<Session> {
  const s = await getSession();
  if (!s) redirect('/dang-nhap');
  if (allowed && !allowed.includes(s.role)) redirect(ROLE_INFO[s.role].home);
  return s;
}

type Params = Record<string, unknown>;

// Chuẩn hóa dữ liệu từ msnodesqlv8:
// - Ngày giờ là Date mang đúng giá trị trong DB ở dạng UTC → chuỗi 'YYYY-MM-DDTHH:mm:ss'
// - Cột BIGINT và cột IDENTITY (driver không trả kiểu) về dạng chuỗi → đổi lại thành số
function normalize<T>(recordset: sql.IRecordSet<Record<string, unknown>> | undefined): T[] {
  if (!recordset) return [];
  const soNguyen = Object.entries(recordset.columns ?? {})
    .filter(([, c]) => {
      const decl = (c.type as unknown as { declaration?: string } | undefined)?.declaration;
      return decl === undefined || decl === 'bigint';
    })
    .map(([name]) => name);
  for (const row of recordset) {
    for (const k in row) {
      const v = row[k];
      if (v instanceof Date) row[k] = v.toISOString().slice(0, 19);
    }
    for (const k of soNguyen) {
      const v = row[k];
      if (typeof v === 'string' && /^-?\d{1,15}$/.test(v)) row[k] = Number(v);
    }
  }
  return recordset as unknown as T[];
}

function bind(req: sql.Request, params: Params) {
  for (const [k, v] of Object.entries(params)) req.input(k, v);
  return req;
}

export async function query<T>(s: Session, text: string, params: Params = {}): Promise<T[]> {
  const r = await bind(s.pool.request(), params).query(text);
  return normalize<T>(r.recordset);
}

/** Gọi stored procedure; trả về bảng kết quả, giá trị RETURN và các thông báo PRINT */
export async function exec<T = Record<string, unknown>>(s: Session, proc: string, params: Params = {}) {
  const req = bind(s.pool.request(), params);
  const prints: string[] = [];
  req.on('info', (info: { message?: string }) => {
    if (info.message) prints.push(info.message.replace(/^(\[[^\]]+\])+/, '').trim());
  });
  const r = await req.execute(proc);
  return { rows: normalize<T>(r.recordset), returnValue: r.returnValue as number, prints };
}

/** Đổi lỗi SQL Server thành câu tiếng Việt hiển thị cho người dùng */
export function thongBaoLoi(e: unknown): string {
  if (e instanceof LoiNghiepVu) return e.message;
  const err = e as { number?: number; message?: string };
  const msg = (err.message ?? '').replace(/^(\[[^\]]+\])+/, '').trim();
  if (err.number === 229 || err.number === 230) {
    const obj = msg.match(/object '([^']+)'/)?.[1];
    return `Tài khoản của bạn không có quyền thực hiện thao tác này${obj ? ` trên bảng ${obj}` : ''}.`;
  }
  if (/permission was denied/i.test(msg)) return 'Tài khoản của bạn không có quyền thực hiện thao tác này.';
  return msg || 'Đã xảy ra lỗi không xác định.';
}
