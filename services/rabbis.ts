import { Rabbi } from '@/types';
import { LocalStorageService } from './localStorageService';
import { ServerStorageService } from './serverStorageService';

const isServer = typeof window === 'undefined';
const storage = isServer 
  ? new ServerStorageService('rabbis')
  : new LocalStorageService('rabbis');

export const rabbiService = {
  async getAllRabbis(): Promise<Rabbi[]> {
    return storage.getAll<Rabbi>();
  },

  async getRabbi(id: string): Promise<Rabbi | null> {
    return storage.getById<Rabbi>(id);
  },

  async createRabbi(rabbi: Omit<Rabbi, 'id'>): Promise<Rabbi> {
    return storage.create(rabbi);
  },

  async updateRabbi(id: string, rabbi: Partial<Rabbi>): Promise<Rabbi | null> {
    return storage.update<Rabbi>(id, rabbi);
  },

  async deleteRabbi(id: string): Promise<boolean> {
    return storage.delete(id);
  }
};
