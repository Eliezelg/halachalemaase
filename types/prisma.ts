import { Rabbi as PrismaRabbi, Book as PrismaBook, QA as PrismaQA, Distributor as PrismaDistributor } from '@prisma/client';
import { Topic } from './index';

// Types pour le frontend qui correspondent aux types Prisma
export interface Rabbi extends Omit<PrismaRabbi, 'id' | 'createdAt' | 'updatedAt'> {
  id: string;
  topics: Topic[];
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface Book extends Omit<PrismaBook, 'id' | 'createdAt' | 'updatedAt'> {
  id: string;
}

export interface QA extends Omit<PrismaQA, 'id' | 'createdAt' | 'updatedAt'> {
  id: string;
  topic: Topic;
  authorId?: string;
}

export interface Distributor extends Omit<PrismaDistributor, 'id' | 'createdAt' | 'updatedAt'> {
  id: string;
}

// Fonctions de conversion
export const convertPrismaRabbi = (rabbi: PrismaRabbi): Rabbi => ({
  ...rabbi,
  id: rabbi.id.toString(),
  topics: rabbi.topics as Topic[],
  languages: rabbi.languages || [],
});

export const convertPrismaBook = (book: PrismaBook): Book => ({
  ...book,
  id: book.id.toString(),
});

export const convertPrismaQA = (qa: PrismaQA): QA => ({
  ...qa,
  id: qa.id.toString(),
  topic: qa.topic as Topic,
});

export const convertPrismaDistributor = (distributor: PrismaDistributor): Distributor => ({
  id: distributor.id.toString(),
  name: distributor.name,
  city: distributor.city || '',
  address: distributor.address || '',
  phone: distributor.phone || '',
  createdAt: distributor.createdAt.toISOString(),
  updatedAt: distributor.updatedAt.toISOString()
});
