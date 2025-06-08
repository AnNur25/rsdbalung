export interface Comment {
  id_komentar: string;
  nama: string;
  isi_komentar: string;
  isVisible: boolean;
  tanggal_komentar: string;
  replies: Comment[];
}