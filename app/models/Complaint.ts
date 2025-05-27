export interface AdminResponse {
  id: string;
  message: string;
  dibuat_pada: string;
}

export interface ComplaintModel {
  id: string;
  nama: string;
  message: string;
  no_wa: string;
  is_visible: boolean;
  dibuat_pada: string;
  responAdmin: AdminResponse[];
}
