export interface Rabbi {
  id: string;
  firstName: string;
  lastName: string;
  topics: string[];
  address: string | null;
  city: string | null;
  description: string | null;
  languages: string[];
  imageUrl: string | null;
  qas?: QA[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Book {
  title: string;
  description: string | null;
  price: string | null;
  image: string | null;
  nedarimPlusLink: string | null;
  isNew: boolean;
}

export interface QA {
  topic: string;
  question: string;
  answer: string;
}

export interface Distributor {
  name: string;
  city: string | null;
  address: string | null;
  phone: string | null;
}
