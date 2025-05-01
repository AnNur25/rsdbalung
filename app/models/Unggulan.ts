export interface Unggulan {
  id_layanan_unggulan: string;
  judul: string;
  deskripsi: string;
  gambarCaptions: ImageCaption[];
  existingImages?: ExistingImage[] | [];
}

export interface ExistingImage {
  id: string;
  caption: string;
}

export interface ImageCaption extends ExistingImage {
  gambar: string;
  nama_file: string;
}

export interface UnggulanRequest {
  id_layanan_unggulan: string;
  judul: string;
  deskripsi: string;
  file?: File[];
  gambarCaption?: { caption: string }[];
  existingImages: ImageCaption[] | [];
}
