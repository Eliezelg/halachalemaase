import { PrismaClient, QA as PrismaQA } from '@prisma/client';
import { QA } from '@/types';

const prisma = new PrismaClient();

class QAServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QAServiceError';
  }
}

function convertPrismaQA(prismaQA: PrismaQA): QA {
  return {
    id: prismaQA.id.toString(),
    topic: prismaQA.topic as QA['topic'],
    question: prismaQA.question,
    answer: prismaQA.answer,
    authorId: prismaQA.authorId,
    createdAt: prismaQA.createdAt.toISOString(),
  };
}

export const qaService = {
  async getAllQAs(): Promise<QA[]> {
    try {
      const qas = await prisma.qA.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return qas.map(convertPrismaQA);
    } catch (error) {
      console.error('Error getting all QAs:', error);
      throw new QAServiceError('Failed to fetch QAs');
    }
  },

  async getQA(id: string): Promise<QA | null> {
    if (!id) {
      throw new QAServiceError('ID is required');
    }
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new QAServiceError('Invalid ID format');
      }
      const qa = await prisma.qA.findUnique({
        where: { id: numericId }
      });
      return qa ? convertPrismaQA(qa) : null;
    } catch (error) {
      console.error(`Error getting QA with id ${id}:`, error);
      throw new QAServiceError('Failed to fetch QA');
    }
  },

  async createQA(data: {
    topic: QA['topic'];
    question: string;
    answer: string;
    authorId: string;
  }): Promise<QA> {
    if (!data.topic || !data.question || !data.answer || !data.authorId) {
      throw new QAServiceError('Missing required fields');
    }
    try {
      const qa = await prisma.qA.create({
        data
      });
      return convertPrismaQA(qa);
    } catch (error) {
      console.error('Error creating QA:', error);
      throw new QAServiceError('Failed to create QA');
    }
  },

  async updateQA(id: string, data: {
    topic?: QA['topic'];
    question?: string;
    answer?: string;
  }): Promise<QA | null> {
    if (!id) {
      throw new QAServiceError('ID is required');
    }
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new QAServiceError('Invalid ID format');
      }
      const qa = await prisma.qA.update({
        where: { id: numericId },
        data
      });
      return convertPrismaQA(qa);
    } catch (error) {
      console.error(`Error updating QA with id ${id}:`, error);
      throw new QAServiceError('Failed to update QA');
    }
  },

  async deleteQA(id: string): Promise<boolean> {
    if (!id) {
      throw new QAServiceError('ID is required');
    }
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new QAServiceError('Invalid ID format');
      }
      await prisma.qA.delete({
        where: { id: numericId }
      });
      return true;
    } catch (error) {
      console.error(`Error deleting QA with id ${id}:`, error);
      throw new QAServiceError('Failed to delete QA');
    }
  }
};
