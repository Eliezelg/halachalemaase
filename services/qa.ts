import { QA } from '@/types';
import { LocalStorageService } from './localStorageService';
import { ServerStorageService } from './serverStorageService';

const isServer = typeof window === 'undefined';
const storage = isServer 
  ? new ServerStorageService('qa')
  : new LocalStorageService('qa');

class QAServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QAServiceError';
  }
}

export const qaService = {
  async getAllQAs(): Promise<QA[]> {
    try {
      return await storage.getAll<QA>();
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
      return await storage.getById<QA>(id);
    } catch (error) {
      console.error(`Error getting QA with id ${id}:`, error);
      throw new QAServiceError('Failed to fetch QA');
    }
  },

  async createQA(qa: Omit<QA, 'id'>): Promise<QA> {
    if (!qa.topic || !qa.question || !qa.answer || !qa.authorId) {
      throw new QAServiceError('Missing required fields');
    }
    try {
      return await storage.create(qa);
    } catch (error) {
      console.error('Error creating QA:', error);
      throw new QAServiceError('Failed to create QA');
    }
  },

  async updateQA(id: string, qa: Partial<QA>): Promise<QA | null> {
    if (!id) {
      throw new QAServiceError('ID is required');
    }
    try {
      const updated = await storage.update<QA>(id, qa);
      if (!updated) {
        throw new QAServiceError('QA not found');
      }
      return updated;
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
      const success = await storage.delete(id);
      if (!success) {
        throw new QAServiceError('QA not found');
      }
      return success;
    } catch (error) {
      console.error(`Error deleting QA with id ${id}:`, error);
      throw new QAServiceError('Failed to delete QA');
    }
  }
};
