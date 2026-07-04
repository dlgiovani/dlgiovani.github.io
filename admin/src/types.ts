// Mirrors the backend Pydantic schemas (backend/app/schemas.py).

export type AttachmentKind = 'voice' | 'board' | 'media';

export interface Attachment {
  id: number;
  kind: AttachmentKind | string;
  original_filename: string;
  content_type: string;
  size_bytes: number;
  download_path: string; // e.g. /api/consulting/{id}/attachments/{aid}
}

export type Category = 'consulting' | 'integration' | 'automation' | 'else';

export interface ConsultingRequest {
  id: number;
  category: Category | string;
  name: string;
  contact: string;
  company: string | null;
  message: string | null;
  extra_note: string | null;
  links: string[] | null;
  submitted_at: string; // ISO
  handled_at: string | null; // ISO or null
  attachments: Attachment[];
}
