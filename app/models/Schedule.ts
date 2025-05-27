import type { Poli } from "./Poli";

export interface Hari {
  hari: string;
  sesi: string;
  jam_mulai: string;
  jam_selesai: string;
}

export interface LayananSchedule {
  id_pelayanan: string;
  nama_pelayanan: string;
  jadwal: Hari[];
}

export interface DokterSchedule {
  id_dokter: string;
  nama_dokter: string;
  gambar_dokter: string;
  poli: Poli;
  layananList: LayananSchedule[];
}
