export interface Doctor {
  id_dokter: string;
  nama: string;
  gambar: string;
  biodata_singkat: string;
  link_linkedin: string;
  link_instagram: string;
  link_facebook: string;
  poli: {
    id_poli: string;
    nama_poli: string;
  };
  slug: string;
}

