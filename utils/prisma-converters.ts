import { QA } from '@/types';
import { QA as PrismaQA } from '@prisma/client';

export function convertPrismaQA(prismaQA: PrismaQA): QA {
  return {
    id: prismaQA.id,
    topic: prismaQA.topic as QA['topic'],
    question: prismaQA.question,
    answer: prismaQA.answer,
    authorId: prismaQA.authorId,
    createdAt: prismaQA.createdAt.toISOString(),
  };
}
