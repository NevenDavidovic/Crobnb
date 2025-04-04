export interface DirectusFile {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string | null;
  uploaded_by: string | null;
  uploaded_on: string;
  modified_by: string | null;
  modified_on: string;
  charset: string | null;
  filesize: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  embed: string | null;
  description: string | null;
  location: string | null;
  tags: string[] | null;
  metadata: Record<string, any> | null;
}
