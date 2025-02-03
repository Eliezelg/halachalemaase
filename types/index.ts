export interface Rabbi {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  topics: Topic[];
  photo: string;
  address: string;
  description?: string;
  city: string;
}

export type Topic =
  | 'נדה'
  | 'שבת'
  | 'בשר בחלב'
  | 'טבילת כלים'
  | 'ברכות'
  | 'תפילה'
  | 'חגים'
  | 'חושן משפט';

export interface QA {
  id: string;
  topic: Topic;
  question: string;
  answer: string;
  authorId: string;
  createdAt: string;
}

export interface Brochure {
  id: string;
  name: string;
  coverImage: string;
  pdfUrl: string;
  type: 'weekly1' | 'weekly2';
  uploadedAt: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl?: string;
  price?: number;
}

export interface Distributor {
  id?: string;
  city?: string;
  name?: string;
  phone?: string;
  address?: string;
  note?: string;
}

export interface Shiur {
  id: string;
  title: string;
  rabbi: string;
  date: string;
  topic: Topic;
  audioUrl?: string;
  pdfUrl?: string;
  description?: string;
  duration?: string;
}
