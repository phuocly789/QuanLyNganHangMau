// Nội dung hướng dẫn sử dụng hiển thị trong khung "Hướng dẫn" trên web.
// Mỗi chức năng ghi rõ đối tượng SQL bị tác động và vị trí trong sql/QuanLyNganHangMau.sql.
import type { Role } from './roles';

export type LoaiDoiTuong = 'Procedure' | 'Trigger' | 'Function' | 'View' | 'Truy vấn' | 'Bảng' | 'Quyền';

export interface DoiTuongSQL {
  loai: LoaiDoiTuong;
  ten: string;
  /** Vị trí trong file SQL, ví dụ "Chương 4 · 1.1.5" */
  muc?: string;
  /** Tác dụng trong chức năng này */
  tacDung: string;
}

export interface ChucNang {
  ten: string;
  ai: Role[];
  buoc: string[];
  sql: DoiTuongSQL[];
  loi?: string[];
  luuY?: string;
}

export interface HuongDanManHinh {
  tieuDe: string;
  moTa: string;
  chucNang: ChucNang[];
}

const TAT_CA: Role[] = ['nhanvien', 'bacsi', 'quanly'];

// ---------------------------------------------------------------- Đối tượng SQL dùng nhiều lần
const O = {
  nhapKho: { loai: 'Procedure', ten: 'sp_NhapKhoChePham', muc: 'Chương 4 · 1.1.1' },
  phanBo: { loai: 'Procedure', ten: 'sp_PhanBoMauChoYeuCau', muc: 'Chương 4 · 1.1.2' },
  truyenMau: { loai: 'Procedure', ten: 'sp_GhiNhanTruyenMau', muc: 'Chương 4 · 1.1.3' },
  xetNghiem: { loai: 'Procedure', ten: 'sp_CapNhatKetQuaXetNghiem', muc: 'Chương 4 · 1.1.4' },
  tiepNhan: { loai: 'Procedure', ten: 'sp_TiepNhanLanHienMau', muc: 'Chương 4 · 1.1.5' },
  tach: { loai: 'Procedure', ten: 'sp_TachChePham', muc: 'Chương 4 · 1.1.6' },
  trgTuoi: { loai: 'Trigger', ten: 'trg_LanHienMau_KiemTraTuoi', muc: 'Chương 4 · 1.2.1' },
  trgTuongThich: { loai: 'Trigger', ten: 'trg_PhanBoMau_KiemTraTuongThich', muc: 'Chương 4 · 1.2.2' },
  trgCapNhatYC: { loai: 'Trigger', ten: 'trg_PhanBoMau_CapNhatYeuCau', muc: 'Chương 4 · 1.2.3' },
  trgTruyen: { loai: 'Trigger', ten: 'trg_TruyenMau_CapNhatChePham', muc: 'Chương 4 · 1.2.4' },
  trgSucChua: { loai: 'Trigger', ten: 'trg_ViTriLuuTru_KiemTraSucChua', muc: 'Chương 4 · 1.2.5' },
  fnTuoi: { loai: 'Function', ten: 'fn_TinhTuoi', muc: 'Chương 4 · 1.3.1' },
  fnTuongThich: { loai: 'Function', ten: 'fn_KiemTraTuongThich', muc: 'Chương 4 · 1.3.2' },
  fnTongTheTich: { loai: 'Function', ten: 'fn_TongTheTichDaPhanBo', muc: 'Chương 4 · 1.3.3' },
  hetHan: { loai: 'Procedure', ten: 'sp_CapNhatChePhamHetHan', muc: 'Chương 4 · 1.4.1 (cursor)' },
  dongBoViTri: { loai: 'Procedure', ten: 'sp_CapNhatTrangThaiViTriLuuTru', muc: 'Chương 4 · 1.4.2 (cursor)' },
  import: { loai: 'Procedure', ten: 'sp_ImportNguoiHienMau', muc: 'Chương 4 · 2.3' },
  export: { loai: 'Procedure', ten: 'sp_ExportTonKhoChePhamCSV', muc: 'Chương 4 · 2.4' },
  viewExport: { loai: 'View', ten: 'v_ExportTonKhoChePham', muc: 'Chương 4 · 2.4' },
  backup: { loai: 'Procedure', ten: 'sp_BackupDuLieu', muc: 'Chương 4 · 2.5' },
  restore: { loai: 'Procedure', ten: 'sp_RestoreDuLieu', muc: 'Chương 4 · 2.6' },
  bcTonKho: { loai: 'Truy vấn', ten: 'Báo cáo tồn kho theo nhóm máu', muc: 'Chương 4 · 3.1' },
  bcHetHan: { loai: 'Procedure', ten: 'sp_BaoCaoChePhamSapHetHan', muc: 'Chương 4 · 3.2' },
  bcDot: { loai: 'Procedure', ten: 'sp_BaoCaoKetQuaDotHienMau', muc: 'Chương 4 · 3.3' },
  bcDapUng: { loai: 'Truy vấn', ten: 'Báo cáo yêu cầu và tình trạng đáp ứng', muc: 'Chương 4 · 3.4' },
  bcTruyen: { loai: 'Truy vấn', ten: 'Báo cáo tình hình truyền máu', muc: 'Chương 4 · 3.5' },
} satisfies Record<string, Omit<DoiTuongSQL, 'tacDung'>>;

const d = (o: Omit<DoiTuongSQL, 'tacDung'>, tacDung: string): DoiTuongSQL => ({ ...o, tacDung });
const bang = (ten: string, tacDung: string): DoiTuongSQL => ({ loai: 'Bảng', ten, tacDung });
const quyen = (ten: string, tacDung: string, muc = 'Chương 4 · 2.2 + sql/PhanQuyenWeb.sql'): DoiTuongSQL => ({ loai: 'Quyền', ten, muc, tacDung });

// ---------------------------------------------------------------- Hướng dẫn theo màn hình
export const HUONG_DAN: Record<string, HuongDanManHinh> = {
  '/dang-nhap': {
    tieuDe: 'Đăng nhập và phân quyền',
    moTa: 'Mỗi tài khoản là một SQL login. Quyền xem và thao tác do GRANT/DENY trong SQL Server quyết định; web chỉ ẩn những nút mà vai trò không được dùng.',
    chucNang: [
      {
        ten: 'Đăng nhập',
        ai: TAT_CA,
        buoc: [
          'Nhập tên đăng nhập và mật khẩu, hoặc bấm một tài khoản demo bên phải để điền sẵn.',
          'Hệ thống kết nối SQL Server bằng chính tài khoản đó và xác định vai trò qua IS_ROLEMEMBER.',
          'Dải "Bản demo" trên cùng cho phép chuyển nhanh giữa 3 vai trò để thử phân quyền.',
        ],
        sql: [
          quyen('CREATE LOGIN / CREATE USER nhanvien01, bacsi01, quanly01', 'Tài khoản đăng nhập', 'Chương 4 · 2.1'),
          quyen('role_NhanVienNganHangMau, role_BacSi, role_QuanLy', 'Nhóm quyền; web đọc vai trò để hiện menu'),
        ],
        loi: ['Sai tên đăng nhập hoặc mật khẩu.', 'Tài khoản này không thuộc nhóm người dùng nào của hệ thống.'],
      },
    ],
  },

  '/kho-mau': {
    tieuDe: 'Kho máu',
    moTa: 'Theo dõi tồn kho chế phẩm theo nhóm máu và loại, nhập kho chế phẩm vừa tách, cập nhật chế phẩm hết hạn và quản lý vị trí lưu trữ.',
    chucNang: [
      {
        ten: 'Xem tồn kho',
        ai: TAT_CA,
        buoc: [
          'Ma trận 8 nhóm máu × 4 loại chế phẩm: ô xanh là còn hàng, ghi "số túi · tổng ml"; ô ghi 0 là hết hàng.',
          'Bấm vào một ô để lọc danh sách chế phẩm bên dưới.',
          'Danh sách sắp theo hạn dùng gần nhất trước (FIFO); lọc theo nhóm máu, loại, trạng thái, ngân hàng máu.',
        ],
        sql: [
          d(O.bcTonKho, 'Phần A – số túi và ml theo nhóm máu × loại (chỉ tính chế phẩm Đang lưu trữ còn hạn)'),
          bang('ChePhamMau, DonViMau, NhomMau, ViTriLuuTru, NganHangMau', 'Đọc danh sách chế phẩm'),
        ],
      },
      {
        ten: 'Nhập kho chế phẩm',
        ai: ['nhanvien'],
        buoc: [
          'Bấm "Nhập kho".',
          'Chọn chế phẩm chờ nhập (chế phẩm vừa tách ở màn hình Xét nghiệm, chưa có vị trí).',
          'Chọn vị trí lưu trữ (danh sách ghi đang chứa/sức chứa), bấm "Lưu nhập kho".',
        ],
        sql: [
          d(O.nhapKho, 'Kiểm tra sức chứa; gán vị trí; +1 tồn kho vị trí và ngân hàng máu; ghi LichSuKho "Nhập kho"'),
          d(O.trgSucChua, 'Chặn lượng hiện tại âm hoặc vượt sức chứa khi cập nhật ViTriLuuTru'),
          bang('ChePhamMau, ViTriLuuTru, NganHangMau, LichSuKho', 'Bị ghi bởi procedure'),
        ],
        loi: ['Vị trí lưu trữ đã đầy! – hiện ngay dưới ô Vị trí.'],
      },
      {
        ten: 'Cập nhật chế phẩm hết hạn',
        ai: ['nhanvien'],
        buoc: ['Bấm "Cập nhật chế phẩm hết hạn" ở góc trên.'],
        sql: [
          d(O.hetHan, 'Cursor duyệt chế phẩm quá hạn → trạng thái "Hết hạn", ghi LichSuKho "Kiểm kê"; trả về số chế phẩm đã cập nhật (-1 nếu không có)'),
        ],
      },
      {
        ten: 'Vị trí lưu trữ và đồng bộ trạng thái',
        ai: ['nhanvien', 'quanly'],
        buoc: [
          'Mở tab "Vị trí lưu trữ" để xem đang chứa/sức chứa, nhiệt độ, trạng thái.',
          'Nhân viên bấm "Đồng bộ trạng thái vị trí" để đếm lại số chế phẩm thực tế.',
        ],
        sql: [
          d(O.dongBoViTri, 'Cursor đếm chế phẩm Đang lưu trữ tại từng vị trí, cập nhật LuongHienTai và Đầy/Còn chỗ (bỏ qua vị trí Bảo trì, Không sử dụng)'),
          d(O.trgSucChua, 'Kiểm tra ràng buộc sức chứa khi cập nhật'),
        ],
        luuY: 'Sau khi đồng bộ, số "đang chứa" về đúng số chế phẩm thực có trong hệ thống.',
      },
      {
        ten: 'Lịch sử kho',
        ai: ['nhanvien', 'quanly'],
        buoc: ['Mở tab "Lịch sử kho" – chỉ đọc: nhập kho, xuất kho, kiểm kê, tiêu hủy…'],
        sql: [
          bang('LichSuKho', 'Chỉ được ghi bởi các procedure'),
          quyen('DENY INSERT, UPDATE ON LichSuKho TO role_NhanVienNganHangMau', 'Nhân viên không sửa được lịch sử kho'),
        ],
      },
    ],
  },

  '/hien-mau': {
    tieuDe: 'Hiến máu',
    moTa: 'Tiếp nhận lần hiến máu (đủ điều kiện thì tạo luôn túi máu chờ xét nghiệm), tra cứu người hiến, import danh sách người hiến và xem các đợt hiến máu.',
    chucNang: [
      {
        ten: 'Tiếp nhận lần hiến',
        ai: ['nhanvien'],
        buoc: [
          'Bấm "Tiếp nhận lần hiến".',
          'Chọn người hiến – dòng gợi ý dưới ô cho biết tuổi và lần hiến gần nhất.',
          'Chọn đợt, ngày/giờ, lượng máu (250/350/450 ml), loại hiến, kết quả khám; bấm "Tiếp nhận".',
          'Đủ điều kiện: bảng Lần hiến có dòng mới và cột "Đơn vị máu" là link sang màn hình Xét nghiệm.',
        ],
        sql: [
          d(O.tiepNhan, 'Kiểm tra đủ 18 tuổi và cách lần hiến trước ≥ 84 ngày; đủ điều kiện → LanHienMau "Đã hiến" + DonViMau "Chờ xét nghiệm" trong cùng transaction; không đủ → "Không đạt", không tạo túi máu'),
          d(O.trgTuoi, 'Kiểm tra lại tuổi khi INSERT LanHienMau'),
          bang('NguoiHienMau, LanHienMau, DonViMau', 'Đọc người hiến; ghi lần hiến và đơn vị máu'),
        ],
        loi: ['Người hiến máu chưa đủ 18 tuổi! – dưới ô Người hiến.', 'Khoảng cách từ lần hiến trước chưa đủ 84 ngày! – dưới ô Ngày hiến.'],
      },
      {
        ten: 'Tra cứu người hiến',
        ai: ['nhanvien', 'quanly'],
        buoc: ['Mở tab "Người hiến", tìm theo tên, CCCD hoặc số điện thoại.'],
        sql: [d(O.fnTuoi, 'Tính tuổi hiện tại của người hiến'), bang('NguoiHienMau, LanHienMau', 'Đọc thông tin và lần hiến gần nhất')],
        luuY: 'Bác sĩ không vào được màn hình này vì bị DENY SELECT trên NguoiHienMau.',
      },
      {
        ten: 'Import người hiến từ CSV',
        ai: ['nhanvien'],
        buoc: ['Ở tab "Người hiến", nhập đường dẫn file CSV trên máy SQL Server, bấm "Import".'],
        sql: [d(O.import, 'BULK INSERT file CSV vào bảng tạm rồi chèn người hiến chưa có (bỏ qua trùng mã hoặc CCCD)')],
        loi: ['You do not have permission to use the bulk load statement – tài khoản cần quyền ADMINISTER BULK OPERATIONS cấp máy chủ.'],
        luuY: 'Procedure chỉ PRINT khi lỗi (không RAISERROR) nên web đọc nội dung PRINT để báo lỗi.',
      },
      {
        ten: 'Đợt hiến máu',
        ai: ['nhanvien', 'quanly'],
        buoc: ['Mở tab "Đợt hiến máu" để xem trạng thái, số lượt và tổng ml thu được.'],
        sql: [bang('DotHienMau, LanHienMau', 'Đọc')],
      },
    ],
  },

  '/xet-nghiem': {
    tieuDe: 'Xét nghiệm và tách chế phẩm',
    moTa: 'Nhập kết quả xét nghiệm cho từng đơn vị máu; đơn vị đạt chuẩn thì tách thành chế phẩm để nhập kho. Kết quả không đạt về muộn sẽ tự thu hồi chế phẩm đã tách.',
    chucNang: [
      {
        ten: 'Nhập kết quả xét nghiệm',
        ai: ['nhanvien'],
        buoc: [
          'Chọn đơn vị máu ở danh sách bên trái (cột "Bắt buộc đạt" cho biết tiến độ, ví dụ 3/8).',
          'Ở form "Nhập kết quả", chọn loại xét nghiệm, thời gian, kết quả và kết luận, bấm "Lưu kết quả".',
          'Đủ 8 xét nghiệm bắt buộc đều Đạt → đơn vị chuyển "Đạt chuẩn" và form Tách chế phẩm hiện ra.',
        ],
        sql: [
          d(O.xetNghiem, 'Ghi KetQuaXetNghiem; đủ xét nghiệm bắt buộc đều Đạt → DonViMau "Đạt chuẩn"; có Dương tính/Không đạt → "Không đạt" và thu hồi chế phẩm đã tách (hủy phân bổ chưa truyền, trừ kho, ghi LichSuKho "Tiêu hủy")'),
          bang('LoaiXetNghiem', 'Xác định các xét nghiệm bắt buộc đang áp dụng'),
          bang('KetQuaXetNghiem, DonViMau, ChePhamMau, PhanBoMau, YeuCauCapMau, ViTriLuuTru, NganHangMau, LichSuKho', 'Có thể bị ghi khi đơn vị không đạt'),
        ],
        loi: ['Thời gian trả kết quả phải sau ngày xét nghiệm! – dưới ô Thời gian trả kết quả.'],
        luuY: 'Nếu chế phẩm của đơn vị đã truyền cho bệnh nhân, thông báo hiện CẢNH BÁO để báo cáo sự cố.',
      },
      {
        ten: 'Tách chế phẩm',
        ai: ['nhanvien'],
        buoc: [
          'Với đơn vị "Đạt chuẩn", form gợi ý loại chế phẩm theo loại hiến và thể tích còn lại của túi.',
          'Chọn loại, nhập thể tích thực tế, bấm "Tách chế phẩm". Lặp lại cho loại tiếp theo.',
          'Chế phẩm mới nằm ở bảng "Chế phẩm đã tách" với vị trí "Chờ nhập kho" – sang Kho máu để nhập kho.',
        ],
        sql: [
          d(O.tach, 'Chỉ tách từ đơn vị Đạt chuẩn; mỗi loại một lần; tổng thể tích không vượt túi; hạn dùng tính từ ngày thu thập (hồng cầu 35 ngày, huyết tương 1 năm, tiểu cầu 5 ngày, tủa lạnh 6 tháng)'),
          bang('DonViMau, ChePhamMau', 'Ghi chế phẩm mới; đơn vị chuyển "Đã tách chế phẩm"'),
        ],
        loi: [
          'Chỉ tách chế phẩm từ đơn vị máu đã đạt chuẩn xét nghiệm!',
          'Đơn vị máu này đã tách loại chế phẩm này!',
          'Tổng thể tích các chế phẩm vượt quá thể tích đơn vị máu!',
          'Đã quá thời hạn bảo quản của loại chế phẩm này, không thể tách!',
        ],
      },
    ],
  },

  '/yeu-cau': {
    tieuDe: 'Yêu cầu cấp máu',
    moTa: 'Danh sách yêu cầu cấp máu từ các khoa. Yêu cầu Cấp cứu xếp trước; các dòng cần xử lý được làm nổi, dòng đã đóng hiện mờ.',
    chucNang: [
      {
        ten: 'Xem danh sách yêu cầu',
        ai: TAT_CA,
        buoc: [
          'Lọc theo trạng thái hoặc khoa (bác sĩ mặc định lọc theo khoa của mình).',
          'Nhân viên: "Xét duyệt →" với yêu cầu Chờ xử lý, "Phân bổ →" với yêu cầu Đã duyệt.',
        ],
        sql: [
          d(O.fnTongTheTich, 'Tính cột "Đã phân bổ" (ml) và "thiếu … ml"'),
          bang('YeuCauCapMau, Khoa, BenhVien, NhomMau', 'Đọc'),
          quyen('DENY SELECT ON BenhNhan TO role_NhanVienNganHangMau', 'Nhân viên chỉ thấy mã bệnh nhân, không thấy tên'),
        ],
      },
    ],
  },

  '/yeu-cau/[id]': {
    tieuDe: 'Chi tiết yêu cầu cấp máu',
    moTa: 'Theo dõi tiến trình một yêu cầu (Chờ xử lý → Đã duyệt → Đã phân bổ → Hoàn tất), số ml đã phân bổ/còn thiếu, duyệt và tự động phân bổ chế phẩm.',
    chucNang: [
      {
        ten: 'Duyệt yêu cầu',
        ai: ['nhanvien'],
        buoc: ['Với yêu cầu "Chờ xử lý", bấm "Duyệt yêu cầu".'],
        sql: [
          quyen('GRANT UPDATE (TrangThai) ON YeuCauCapMau TO role_NhanVienNganHangMau', 'Thao tác duy nhất ghi trực tiếp không qua procedure (mục kiểm tra 2.2: nhân viên duyệt được yêu cầu)'),
          quyen('DENY UPDATE ON YeuCauCapMau TO role_BacSi', 'Bác sĩ không tự đổi trạng thái yêu cầu'),
        ],
      },
      {
        ten: 'Tự động phân bổ',
        ai: ['nhanvien'],
        buoc: [
          'Với yêu cầu "Đã duyệt", bấm "Tự động phân bổ".',
          'Thông báo cho biết chế phẩm được chọn và lý do (tương thích, còn hạn, hạn gần nhất – FIFO).',
          'Khối tóm tắt chuyển viền xanh khi đủ lượng yêu cầu.',
        ],
        sql: [
          d(O.phanBo, 'Chọn 1 chế phẩm tương thích (bảng QuyTacTuongThich), Đang lưu trữ, còn hạn, hạn gần nhất; tạo PhanBoMau, chế phẩm → "Đã cấp phát", yêu cầu → "Đã phân bổ"'),
          d(O.trgTuongThich, 'Chặn phân bổ nếu nhóm máu không tương thích'),
          d(O.trgCapNhatYC, 'Cập nhật trạng thái yêu cầu khi có phân bổ'),
          bang('QuyTacTuongThich, ChePhamMau, DonViMau, PhanBoMau, YeuCauCapMau', 'Đọc/ghi'),
        ],
        loi: ['Yêu cầu không tồn tại hoặc chưa được duyệt!', 'Không tìm thấy chế phẩm phù hợp/tương thích trong kho!'],
        luuY: 'Procedure mỗi lần chọn 1 túi rồi chuyển yêu cầu sang "Đã phân bổ"; yêu cầu cần nhiều túi sẽ hiện "Còn thiếu N ml".',
      },
      {
        ten: 'Thông tin yêu cầu và tương thích',
        ai: TAT_CA,
        buoc: ['Khung bên phải: bệnh nhân (bác sĩ, quản lý), khoa, bác sĩ chỉ định, mức ưu tiên và các nhóm máu cho phù hợp.'],
        sql: [
          d(O.fnTuongThich, 'Cột "Tương thích" của từng phân bổ và danh sách "Nhóm cho phù hợp" (Điều 44 TT 26/2013/TT-BYT)'),
          d(O.fnTuoi, 'Tuổi bệnh nhân'),
          d(O.fnTongTheTich, 'Số ml đã phân bổ / còn thiếu'),
        ],
      },
      {
        ten: 'Ghi nhận truyền máu từ yêu cầu',
        ai: ['bacsi'],
        buoc: ['Ở dòng chế phẩm đã phân bổ, bấm "Ghi nhận truyền máu" để sang màn hình Truyền máu với phân bổ đã chọn sẵn.'],
        sql: [d(O.truyenMau, 'Xem màn hình Truyền máu')],
      },
    ],
  },

  '/truyen-mau': {
    tieuDe: 'Truyền máu',
    moTa: 'Bác sĩ ghi nhận ca truyền cho các phân bổ chưa truyền. Khi ca truyền Hoàn thành, chế phẩm và yêu cầu tự cập nhật, kho được trừ.',
    chucNang: [
      {
        ten: 'Ghi nhận ca truyền',
        ai: ['bacsi'],
        buoc: [
          'Chọn phân bổ (hoặc bấm "Ghi nhận" ở bảng Phân bổ chờ truyền). Mã ca truyền do hệ thống tự cấp (chỉ đọc).',
          'Nhập giờ bắt đầu, giờ kết thúc (phải sau giờ bắt đầu), thể tích thực tế, người thực hiện, phản ứng phụ, trạng thái.',
          'Bấm "Lưu ca truyền".',
        ],
        sql: [
          d(O.truyenMau, 'Ghi TruyenMau; Hoàn thành → chế phẩm "Đã sử dụng", yêu cầu "Hoàn tất", trừ tồn kho vị trí và ngân hàng, ghi LichSuKho "Xuất kho"'),
          d(O.trgTruyen, 'Chuyển chế phẩm sang "Đã sử dụng" khi ca truyền Hoàn thành'),
          d(O.trgSucChua, 'Kiểm tra ràng buộc khi trừ tồn kho vị trí'),
          bang('TruyenMau', 'Mã ca kế tiếp = số lớn nhất của mã dạng TMxxx + 1'),
        ],
        loi: ['Thời gian kết thúc phải lớn hơn thời gian bắt đầu.', 'Mã vừa được dùng cho ca khác – hệ thống cấp mã mới, bấm lưu lại.'],
      },
      {
        ten: 'Xem các ca truyền',
        ai: ['bacsi', 'quanly'],
        buoc: ['Bảng "Các ca truyền máu" liệt kê toàn bộ ca, mới nhất trước.'],
        sql: [bang('TruyenMau, PhanBoMau, ChePhamMau, YeuCauCapMau, BenhNhan', 'Đọc'), quyen('DENY SELECT ON TruyenMau TO role_NhanVienNganHangMau', 'Nhân viên không xem hồ sơ truyền máu')],
      },
    ],
  },

  '/benh-nhan': {
    tieuDe: 'Bệnh nhân',
    moTa: 'Danh sách bệnh nhân (chỉ xem): nhóm máu, tuổi, khoa, chẩn đoán và số yêu cầu cấp máu.',
    chucNang: [
      {
        ten: 'Xem danh sách bệnh nhân',
        ai: ['bacsi', 'quanly'],
        buoc: ['Cuộn bảng để xem; cột Mã và Nhóm máu luôn cố định khi cuộn ngang.'],
        sql: [
          d(O.fnTuoi, 'Cột Tuổi'),
          bang('BenhNhan, NhomMau, Khoa, BenhVien, YeuCauCapMau', 'Đọc'),
          quyen('GRANT SELECT ON BenhNhan TO role_BacSi', 'Bác sĩ xem được; nhân viên bị DENY'),
        ],
      },
    ],
  },

  '/bao-cao': {
    tieuDe: 'Báo cáo',
    moTa: 'Năm báo cáo đúng theo mục 3 (Trình bày thông tin) của file SQL. Chọn báo cáo ở thanh tab; một số báo cáo có bộ lọc.',
    chucNang: [
      { ten: 'Tồn kho theo nhóm máu', ai: ['quanly'], buoc: ['Phần A: 32 dòng (8 nhóm × 4 loại), dòng còn hàng tô xanh. Phần B: chi tiết theo ngân hàng máu.'], sql: [d(O.bcTonKho, 'Hai truy vấn phần A và phần B')] },
      { ten: 'Chế phẩm sắp hết hạn', ai: ['quanly'], buoc: ['Nhập số ngày cảnh báo (mặc định 7), bấm "Xem".'], sql: [d(O.bcHetHan, 'Tham số @SoNgayCanhBao')] },
      { ten: 'Kết quả đợt hiến máu', ai: ['quanly'], buoc: ['Chọn một đợt hoặc "Tất cả các đợt", bấm "Xem".'], sql: [d(O.bcDot, 'Tham số @MaDot; số lượt và ml theo 8 nhóm máu')] },
      { ten: 'Yêu cầu và đáp ứng', ai: ['quanly'], buoc: ['Xem ml yêu cầu / đã phân bổ / còn thiếu của từng yêu cầu.'], sql: [d(O.bcDapUng, 'Truy vấn tổng hợp theo yêu cầu')] },
      { ten: 'Tình hình truyền máu', ai: ['quanly'], buoc: ['Mỗi dòng là một phân bổ; yêu cầu chưa truyền ghi "Chưa truyền".'], sql: [d(O.bcTruyen, 'Truy vấn nối yêu cầu – phân bổ – truyền máu')] },
    ],
  },

  '/quan-tri': {
    tieuDe: 'Quản trị',
    moTa: 'Sao lưu chạy trực tiếp trên web. Phục hồi và export cần quyền quản trị SQL Server nên trang tạo sẵn script để chạy trong SSMS.',
    chucNang: [
      {
        ten: 'Sao lưu dữ liệu',
        ai: ['quanly'],
        buoc: ['Giữ đường dẫn gợi ý (thư mục sao lưu mặc định của SQL Server), nhập ghi chú nếu cần, bấm "Sao lưu".'],
        sql: [
          d(O.backup, 'BACKUP DATABASE và ghi LichSuBackup (kể cả khi thất bại)'),
          quyen('GRANT BACKUP DATABASE TO role_QuanLy', 'Lệnh BACKUP trong procedure cần quyền riêng', 'sql/PhanQuyenWeb.sql'),
        ],
        loi: ['BACKUP DATABASE is terminating abnormally – thường do thư mục không tồn tại hoặc dịch vụ SQL Server không có quyền ghi.'],
      },
      {
        ten: 'Phục hồi dữ liệu (SSMS)',
        ai: ['quanly'],
        buoc: ['Chọn bản sao lưu thành công, bấm "Sao chép script".', 'Mở SSMS bằng tài khoản quản trị, dán và chạy. Script ghi thêm LichSuRestore.'],
        sql: [d(O.restore, 'Cùng các bước của procedure nhưng chạy từ master: RESTORE cần quyền cấp máy chủ và không chạy được từ bên trong chính CSDL cần phục hồi')],
      },
      {
        ten: 'Export tồn kho (SSMS)',
        ai: ['quanly'],
        buoc: ['Lần đầu: chạy script "Chuẩn bị" (bật xp_cmdshell, cấp quyền đọc view).', 'Chạy script "Export"; tắt xp_cmdshell sau khi xong.'],
        sql: [d(O.export, 'Gọi bcp qua xp_cmdshell để ghi file CSV'), d(O.viewExport, 'Dữ liệu được xuất; bảng xem trước trên web đọc từ view này')],
      },
    ],
  },
};

/** Tìm hướng dẫn theo đường dẫn hiện tại */
export function huongDanCho(pathname: string): HuongDanManHinh | null {
  if (/^\/yeu-cau\/[^/]+/.test(pathname)) return HUONG_DAN['/yeu-cau/[id]'];
  const key = Object.keys(HUONG_DAN).find((k) => !k.includes('[') && (pathname === k || pathname.startsWith(`${k}/`)));
  return key ? HUONG_DAN[key] : null;
}

// ---------------------------------------------------------------- Luồng nghiệp vụ (vòng đời túi máu)
export interface BuocLuong {
  ten: string;
  ai: Role;
  href: string;
  manHinh: string;
  sql: string;
  moTa: string;
}

export const LUONG: BuocLuong[] = [
  { ten: 'Tiếp nhận lần hiến', ai: 'nhanvien', href: '/hien-mau', manHinh: 'Hiến máu', sql: 'sp_TiepNhanLanHienMau', moTa: 'Đủ điều kiện → tạo lần hiến và đơn vị máu "Chờ xét nghiệm".' },
  { ten: 'Xét nghiệm 8 mục bắt buộc', ai: 'nhanvien', href: '/xet-nghiem', manHinh: 'Xét nghiệm', sql: 'sp_CapNhatKetQuaXetNghiem', moTa: 'Đủ 8 mục đều Đạt → đơn vị "Đạt chuẩn".' },
  { ten: 'Tách chế phẩm', ai: 'nhanvien', href: '/xet-nghiem', manHinh: 'Xét nghiệm', sql: 'sp_TachChePham', moTa: 'Ví dụ khối hồng cầu + huyết tương; chế phẩm chờ nhập kho.' },
  { ten: 'Nhập kho', ai: 'nhanvien', href: '/kho-mau', manHinh: 'Kho máu', sql: 'sp_NhapKhoChePham', moTa: 'Gán vị trí lưu trữ; ma trận tồn kho cập nhật.' },
  { ten: 'Duyệt yêu cầu', ai: 'nhanvien', href: '/yeu-cau', manHinh: 'Yêu cầu cấp máu', sql: 'UPDATE YeuCauCapMau.TrangThai', moTa: 'Yêu cầu do bác sĩ lập (dữ liệu có sẵn) chuyển "Đã duyệt".' },
  { ten: 'Tự động phân bổ', ai: 'nhanvien', href: '/yeu-cau', manHinh: 'Chi tiết yêu cầu', sql: 'sp_PhanBoMauChoYeuCau', moTa: 'Chọn chế phẩm tương thích, hạn gần nhất (FIFO).' },
  { ten: 'Ghi nhận truyền máu', ai: 'bacsi', href: '/truyen-mau', manHinh: 'Truyền máu', sql: 'sp_GhiNhanTruyenMau', moTa: 'Hoàn thành → chế phẩm Đã sử dụng, yêu cầu Hoàn tất.' },
  { ten: 'Báo cáo', ai: 'quanly', href: '/bao-cao', manHinh: 'Báo cáo', sql: 'Mục 3.1 – 3.5', moTa: 'Tồn kho, sắp hết hạn, kết quả đợt, đáp ứng, truyền máu.' },
  { ten: 'Sao lưu', ai: 'quanly', href: '/quan-tri', manHinh: 'Quản trị', sql: 'sp_BackupDuLieu', moTa: 'Lưu bản sao toàn bộ CSDL; phục hồi bằng script SSMS.' },
];

export const TINH_HUONG_THU_HOI =
  'Nếu kết quả NAT dương tính về muộn sau khi túi máu đã tách và nhập kho: nhập kết quả ở màn hình Xét nghiệm → hệ thống tự hủy các chế phẩm còn trong kho, hủy phân bổ chưa truyền, trừ kho và ghi lịch sử "Tiêu hủy" (sp_CapNhatKetQuaXetNghiem).';
