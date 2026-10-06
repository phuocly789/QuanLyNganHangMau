// Vai trò, menu và quyền thao tác trên giao diện.
// Quyền thật nằm ở GRANT/DENY trong DB (sql/PhanQuyenWeb.sql); file này chỉ quyết định
// cái gì được hiện ra, để thao tác bị cấm thì ẩn hẳn chứ không hiện nút bị vô hiệu hóa.

export type Role = 'nhanvien' | 'bacsi' | 'quanly';

export const ROLE_INFO: Record<Role, { sqlRole: string; ten: string; home: string }> = {
  nhanvien: { sqlRole: 'role_NhanVienNganHangMau', ten: 'Nhân viên ngân hàng máu', home: '/kho-mau' },
  bacsi: { sqlRole: 'role_BacSi', ten: 'Bác sĩ', home: '/yeu-cau' },
  quanly: { sqlRole: 'role_QuanLy', ten: 'Cán bộ quản lý', home: '/kho-mau' },
};

/** Tài khoản demo (SQL login) và tên hiển thị – DB chưa có bảng nhân viên */
export const DEMO_ACCOUNTS: { username: string; role: Role; hoTen: string; ghiChu: string }[] = [
  { username: 'nhanvien01', role: 'nhanvien', hoTen: 'Ngô Thanh Lan', ghiChu: 'Hiến máu, xét nghiệm, kho, phân bổ' },
  { username: 'bacsi01', role: 'bacsi', hoTen: 'BS. Lê Thu Hà', ghiChu: 'Bệnh nhân, yêu cầu cấp máu, truyền máu' },
  { username: 'quanly01', role: 'quanly', hoTen: 'Đặng Quốc Việt', ghiChu: 'Báo cáo, sao lưu, phục hồi, export' },
];

/** Khoa mặc định của bác sĩ demo (Khoa Huyết học – BV Chợ Rẫy) */
export const KHOA_BAC_SI_DEMO = 1;

export function hoTenCua(username: string): string {
  return DEMO_ACCOUNTS.find((a) => a.username === username)?.hoTen ?? username;
}

export const NAV: Record<Role, { href: string; label: string }[]> = {
  nhanvien: [
    { href: '/kho-mau', label: 'Kho máu' },
    { href: '/hien-mau', label: 'Hiến máu' },
    { href: '/xet-nghiem', label: 'Xét nghiệm' },
    { href: '/yeu-cau', label: 'Yêu cầu cấp máu' },
  ],
  bacsi: [
    { href: '/yeu-cau', label: 'Yêu cầu cấp máu' },
    { href: '/truyen-mau', label: 'Truyền máu' },
    { href: '/benh-nhan', label: 'Bệnh nhân' },
    { href: '/kho-mau', label: 'Kho máu' },
  ],
  quanly: [
    { href: '/kho-mau', label: 'Kho máu' },
    { href: '/hien-mau', label: 'Hiến máu' },
    { href: '/xet-nghiem', label: 'Xét nghiệm' },
    { href: '/yeu-cau', label: 'Yêu cầu cấp máu' },
    { href: '/truyen-mau', label: 'Truyền máu' },
    { href: '/benh-nhan', label: 'Bệnh nhân' },
    { href: '/bao-cao', label: 'Báo cáo' },
    { href: '/quan-tri', label: 'Quản trị' },
  ],
};

// Mỗi thao tác ghi ứng với đúng một procedure (hoặc quyền) trong script SQL gốc
const QUYEN = {
  nhapKho: ['nhanvien'], // sp_NhapKhoChePham
  capNhatHetHan: ['nhanvien'], // sp_CapNhatChePhamHetHan
  dongBoViTri: ['nhanvien'], // sp_CapNhatTrangThaiViTriLuuTru
  phanBo: ['nhanvien'], // sp_PhanBoMauChoYeuCau
  duyetYeuCau: ['nhanvien'], // UPDATE YeuCauCapMau.TrangThai (mục kiểm tra 2.2)
  tiepNhanHienMau: ['nhanvien'], // sp_TiepNhanLanHienMau
  importNguoiHien: ['nhanvien'], // sp_ImportNguoiHienMau
  nhapXetNghiem: ['nhanvien'], // sp_CapNhatKetQuaXetNghiem
  tachChePham: ['nhanvien'], // sp_TachChePham
  ghiNhanTruyenMau: ['bacsi'], // sp_GhiNhanTruyenMau
  quanTri: ['quanly'], // sp_BackupDuLieu (phục hồi, export: script chạy trong SSMS)
  baoCao: ['quanly'], // sp_BaoCaoChePhamSapHetHan, sp_BaoCaoKetQuaDotHienMau
  // Chỉ xem
  xemViTri: ['nhanvien', 'quanly'],
  xemLichSuKho: ['nhanvien', 'quanly'],
  xemBenhNhan: ['bacsi', 'quanly'],
  xemTruyenMau: ['bacsi', 'quanly'],
} satisfies Record<string, Role[]>;

export type Quyen = keyof typeof QUYEN;

export function can(role: Role, quyen: Quyen): boolean {
  return (QUYEN[quyen] as Role[]).includes(role);
}

/** Vai trò được vào từng màn hình */
export const ROUTE_ROLES: Record<string, Role[]> = {
  '/kho-mau': ['nhanvien', 'bacsi', 'quanly'],
  '/yeu-cau': ['nhanvien', 'bacsi', 'quanly'],
  '/hien-mau': ['nhanvien', 'quanly'],
  '/xet-nghiem': ['nhanvien', 'quanly'],
  '/truyen-mau': ['bacsi', 'quanly'],
  '/benh-nhan': ['bacsi', 'quanly'],
  '/bao-cao': ['quanly'],
  '/quan-tri': ['quanly'],
};
