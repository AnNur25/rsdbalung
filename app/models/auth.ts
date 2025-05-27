// di file types/auth.ts (buat baru)
export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    aksesToken: string;
    refreshToken: string;
    user: {
      id_user: string;
      nama: string;
      email: string;
      no_wa: string;
      role: "USER" | "ADMIN"; 
    };
  };
}
