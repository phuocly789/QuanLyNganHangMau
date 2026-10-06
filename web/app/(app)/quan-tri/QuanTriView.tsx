'use client';

import { useState, useTransition, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { C } from '@/lib/theme';
import { formatDate, formatDateTime, ma, ml } from '@/lib/format';
import type { KetQua } from '@/lib/types';
import type { ExportRow, LichSuBackupRow, LichSuRestoreRow } from '@/lib/server/queries-baocao';
import { BloodGroup, Code, Field, Notice, numSx, PageHeader, Status, tableWrapSx } from '@/components/ui';
import { backupAction } from '@/app/actions/quanTri';
import ExportSSMS from './ExportSSMS';
import PhucHoiSSMS from './PhucHoiSSMS';

interface Props {
  backup: LichSuBackupRow[];
  restore: LichSuRestoreRow[];
  exportRows: ExportRow[];
  tenFileBackup: string;
  tenFileExport: string;
  /** SERVERPROPERTY('InstanceDefaultBackupPath') */
  thuMucMacDinh: string | null;
  nguoiThucHien: string;
}

function Section({ id, title, desc, children }: { id: string; title: string; desc: ReactNode; children: ReactNode }) {
  return (
    <Box component="section" aria-labelledby={id} sx={{ borderTop: `1px solid ${C.line}`, pt: 2.5, pb: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0, 1fr)' }, gap: { xs: 1.5, lg: 5 } }}>
        <Box>
          <Typography id={id} variant="h2" sx={{ mb: 0.5 }}>{title}</Typography>
          <Typography variant="caption" component="p">{desc}</Typography>
        </Box>
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}

function BangLichSu({ rows, label }: { rows: { id: number; thoiGian: string; nguoi: string; file: string; trangThai: string; ghiChu: string | null }[]; label: string }) {
  if (rows.length === 0) return <Typography variant="body2" sx={{ color: C.muted, mt: 2 }}>Chưa có lần {label} nào.</Typography>;
  return (
    <Box sx={{ ...tableWrapSx, mt: 2.5, maxHeight: 300 }}>
      <Table stickyHeader size="small" aria-label={`Lịch sử ${label}`}>
        <TableHead>
          <TableRow>
            <TableCell>Thời gian</TableCell>
            <TableCell>Người thực hiện</TableCell>
            <TableCell>File</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ghi chú</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateTime(r.thoiGian)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.nguoi}</TableCell>
              <TableCell><Code>{r.file}</Code></TableCell>
              <TableCell><Status value={r.trangThai} /></TableCell>
              <TableCell sx={{ color: C.muted, minWidth: 220 }}>{r.ghiChu ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default function QuanTriView({ backup, restore, exportRows, tenFileBackup, tenFileExport, thuMucMacDinh, nguoiThucHien }: Props) {
  // Bản sao lưu thành công – nguồn để tạo script phục hồi
  const banSaoLuu = backup.filter((b) => b.TrangThai === 'Thành công');
  const [ketQua, setKetQua] = useState<KetQua | null>(null);
  const [pending, startTransition] = useTransition();

  const [backupPath, setBackupPath] = useState(tenFileBackup);
  const [backupNote, setBackupNote] = useState('');

  const run = (fn: () => Promise<KetQua>, after?: () => void) =>
    startTransition(async () => {
      const r = await fn();
      setKetQua(r);
      after?.();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

  const loiTruong = (f: string) => (ketQua && !ketQua.ok && ketQua.field === f ? ketQua.message : null);

  return (
    <Box>
      <PageHeader title="Quản trị" caption="Sao lưu, phục hồi và export dữ liệu – chỉ cán bộ quản lý" />
      <Notice result={ketQua} sx={{ mb: ketQua ? 2.5 : 0 }} />

      <Section id="bk-title" title="Sao lưu dữ liệu" desc="sp_BackupDuLieu – sao lưu toàn bộ CSDL QuanLyNganHangMau. Đường dẫn là thư mục trên máy chủ SQL Server.">
        <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); run(() => backupAction(backupPath, backupNote)); }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5 }}>
            <Field
              id="backupPath"
              label="File sao lưu (.bak)"
              error={loiTruong('backupPath')}
              hint={thuMucMacDinh ? 'Mặc định lưu vào thư mục sao lưu của SQL Server (đã có sẵn quyền ghi).' : null}
            >
              <TextField id="backupPath" value={backupPath} onChange={(e) => setBackupPath(e.target.value)} />
            </Field>
            <Field id="backupNote" label="Ghi chú">
              <TextField id="backupNote" value={backupNote} placeholder="Sao lưu định kỳ" onChange={(e) => setBackupNote(e.target.value)} />
            </Field>
          </Box>
          <Button type="submit" variant="contained" disabled={pending} sx={{ mt: 2 }}>Sao lưu</Button>
        </Box>
        <BangLichSu
          label="sao lưu"
          rows={backup.map((b) => ({ id: b.MaBackup, thoiGian: b.ThoiGianBackup, nguoi: b.NguoiThucHien, file: b.DuongDanFile, trangThai: b.TrangThai, ghiChu: b.GhiChu }))}
        />
      </Section>

      <Section
        id="rs-title"
        title="Phục hồi dữ liệu"
        desc="Phục hồi ghi đè toàn bộ CSDL nên thực hiện trong SQL Server Management Studio bằng tài khoản quản trị (sysadmin). Trang này tạo sẵn script để sao chép."
      >
        <PhucHoiSSMS banSaoLuu={banSaoLuu} nguoiThucHien={nguoiThucHien} />
        <BangLichSu
          label="phục hồi"
          rows={restore.map((r) => ({ id: r.MaRestore, thoiGian: r.ThoiGianRestore, nguoi: r.NguoiThucHien, file: r.DuongDanFileNguon, trangThai: r.TrangThai, ghiChu: r.GhiChu }))}
        />
      </Section>

      <Section id="ex-title" title="Export tồn kho chế phẩm" desc="sp_ExportTonKhoChePhamCSV – xuất view v_ExportTonKhoChePham ra file CSV bằng bcp qua xp_cmdshell. xp_cmdshell chỉ dành cho tài khoản quản trị nên chạy trong SSMS; trang này tạo sẵn script.">
        <ExportSSMS tenFileMacDinh={tenFileExport} />
        <Typography variant="caption" component="p" sx={{ mt: 2.5, mb: 1 }}>Xem trước dữ liệu sẽ xuất ({exportRows.length} dòng)</Typography>
        <Box sx={{ ...tableWrapSx, maxHeight: 320 }}>
          <Table stickyHeader size="small" aria-label="Xem trước v_ExportTonKhoChePham">
            <TableHead>
              <TableRow>
                <TableCell>Chế phẩm</TableCell>
                <TableCell>Đơn vị máu</TableCell>
                <TableCell>Nhóm</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell sx={numSx}>Thể tích</TableCell>
                <TableCell>Ngày tách</TableCell>
                <TableCell>Hạn dùng</TableCell>
                <TableCell>Vị trí</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exportRows.map((r) => (
                <TableRow key={r.MaChePham} hover>
                  <TableCell><Code>{ma.chePham(r.MaChePham)}</Code></TableCell>
                  <TableCell><Code>{ma.donViMau(r.MaDonViMau)}</Code></TableCell>
                  <TableCell><BloodGroup value={r.TenNhomMau} /></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.LoaiChePham}</TableCell>
                  <TableCell sx={numSx}>{ml(r.TheTich)}</TableCell>
                  <TableCell>{formatDate(r.NgayTachChePham)}</TableCell>
                  <TableCell>{formatDate(r.HanSuDung)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.TenViTri}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Section>
    </Box>
  );
}
