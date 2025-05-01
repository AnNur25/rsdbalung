// interface JadwalDokterResponse {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: {
//     dokter: Dokter[];
//     pagination: Pagination;
//   };
// }

import type { Poli } from "./Poli";

export interface Hari {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
}

export interface LayananSchedule {
    id_pelayanan: string;
    nama_pelayanan: string;
    jadwal: Hari[];
}

export interface Dokter {
  id_dokter: string;
  nama_dokter: string;
  poli: Poli;
  layananList: LayananSchedule[];
}
