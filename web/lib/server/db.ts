// Kết nối SQL Server theo từng người dùng: đăng nhập web = đăng nhập SQL login,
// nên GRANT/DENY trong DB được áp dụng thật cho mọi câu lệnh.
// Phiên lưu trong cookie mã hóa (AES-256-GCM), pool kết nối tạo lại khi cần.
// Driver: có DB_DRIVER (chạy local) → ODBC qua msnodesqlv8; không có (Vercel) → tedious qua TCP.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import sql from 'mssql';
import { ROLE_INFO, type Role } from '@/lib/roles';

export interface Session {
  username: string;
  role: Role;
  pool: sql.ConnectionPool;
}

const COOKIE = 'qlnhm_sid';
const ROLES: Role[] = ['nhanvien', 'bacsi', 'quanly'];

// ---------------------------------------------------------------------
// Cookie phiên: { u, p, r } mã hóa bằng khóa suy ra từ SESSION_SECRET.
// Không khai báo SESSION_SECRET (chạy local) thì dùng khóa ngẫu nhiên, khởi động lại server là đăng nhập lại.
const g = globalThis as unknown as { __qlnhmKey?: Buffer; __qlnhmPools?: Map<string, Promise<sql.ConnectionPool>> };

function khoa() {
  const secret = process.env.SESSION_SECRET;
  if (secret) return createHash('sha256').update(secret).digest();
  return (g.__qlnhmKey ??= randomBytes(32));
}

function maHoa(data: object) {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', khoa(), iv);
  const body = Buffer.concat([c.update(JSON.stringify(data), 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString('base64url');
}

function giaiMa(token: string): { u: string; p: string; r: Role } | null {
  try {
    const buf = Buffer.from(token, 'base64url');
    const d = createDecipheriv('aes-256-gcm', khoa(), buf.subarray(0, 12));
    d.setAuthTag(buf.subarray(12, 28));
    const v = JSON.parse(Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8'));
    return typeof v?.u === 'string' && typeof v?.p === 'string' && ROLES.includes(v?.r) ? v : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------
// Pool kết nối theo từng SQL login, dùng lại trong cùng một instance
const pools = (g.__qlnhmPools ??= new Map());

const odbcValue = (v: string) => `{${v.replace(/}/g, '}}')}}`;

/** ODBC (msnodesqlv8): giữ nguyên cách kết nối local, ví dụ localhost qua shared memory */
function chuoiOdbc(driver: string, username: string, password: string) {
  const server = process.env.DB_SERVER ?? 'localhost';
  const database = process.env.DB_NAME ?? 'QuanLyNganHangMau';
  // Tùy chọn ODBC bổ sung, ví dụ khi kết nối VPS: "Encrypt=yes;TrustServerCertificate=yes;"
  const extra = (process.env.DB_ODBC_OPTIONS ?? '').trim();
  return `Driver={${driver}};Server=${server};Database=${database};UID=${odbcValue(username)};PWD=${odbcValue(password)};${extra}${extra && !extra.endsWith(';') ? ';' : ''}`;
}

/** tedious: kết nối TCP thuần JS, chạy được trên Vercel */
function cauHinhTedious(username: string, password: string): sql.config {
  // DB_SERVER dạng "host,port" (giống SSMS) hoặc "host"
  const [server, port] = (process.env.DB_SERVER ?? 'localhost').split(',').map((x) => x.trim());
  return {
    server,
    port: port ? Number(port) : 1433,
    database: process.env.DB_NAME ?? 'QuanLyNganHangMau',
    user: username,
    password,
    options: {
      encrypt: process.env.DB_ENCRYPT !== 'false',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
    },
    pool: { max: 3, min: 0, idleTimeoutMillis: 30_000 },
    connectionTimeout: 15_000,
    requestTimeout: 30_000,
  };
}

function layPool(username: string, password: string) {
  const key = createHash('sha256').update(`${username}\0${password}`).digest('hex');
  let p = pools.get(key);
  if (!p) {
    const driver = process.env.DB_DRIVER;
    p = driver
      ? import('mssql/msnodesqlv8').then((m) =>
          // connectionString là tùy chọn riêng của msnodesqlv8, @types/mssql chưa khai báo
          new m.default.ConnectionPool({ connectionString: chuoiOdbc(driver, username, password) } as unknown as sql.config).connect(),
        )
      : new sql.ConnectionPool(cauHinhTedious(username, password)).connect();
    p.catch(() => pools.delete(key));
    pools.set(key, p);
  }
  return p;
}

export class LoiNghiepVu extends Error {}

/** Đăng nhập bằng SQL login, xác định vai trò qua IS_ROLEMEMBER */
export async function dangNhap(username: string, password: string): Promise<Session> {
  let pool: sql.ConnectionPool;
  try {
    pool = await layPool(username, password);
  } catch (e) {
    if (/login failed/i.test((e as Error).message ?? '')) throw new LoiNghiepVu('Sai tên đăng nhập hoặc mật khẩu.');
    throw new LoiNghiepVu('Không kết nối được SQL Server. Kiểm tra dịch vụ SQL Server và biến môi trường DB_*.');
  }

  const r = await pool.request().query<Record<Role, number>>(
    `SELECT IS_ROLEMEMBER('${ROLE_INFO.nhanvien.sqlRole}') AS nhanvien,
            IS_ROLEMEMBER('${ROLE_INFO.bacsi.sqlRole}') AS bacsi,
            IS_ROLEMEMBER('${ROLE_INFO.quanly.sqlRole}') AS quanly`,
  );
  const row = r.recordset[0];
  const role = ROLES.find((k) => row[k] === 1);
  if (!role) throw new LoiNghiepVu('Tài khoản này không thuộc nhóm người dùng nào của hệ thống.');

  (await cookies()).set(COOKIE, maHoa({ u: username, p: password, r: role }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return { username, role, pool };
}

export async function dangXuat() {
  (await cookies()).delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  const v = token ? giaiMa(token) : null;
  if (!v) return null;
  try {
    return { username: v.u, role: v.r, pool: await layPool(v.u, v.p) };
  } catch {
    return null; // mật khẩu đã đổi hoặc mất kết nối → đăng nhập lại
  }
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
