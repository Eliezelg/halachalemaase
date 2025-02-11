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

export const TOPICS = [
  'נדה',
  'שבת',
  'בשר בחלב',
  'טבילת כלים',
  'ברכות',
  'תפילה',
  'חגים',
  'חושן משפט',
] as const;

export type Topic = typeof TOPICS[number];

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
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
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
