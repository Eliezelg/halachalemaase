import { Distributor } from '@/types';
import { JsonStorageService } from './jsonStorageService';

const distributorStorage = new JsonStorageService('distributors');

export const distributorService = {
  async getAllDistributors(): Promise<Distributor[]> {
    return distributorStorage.getAll<Distributor>();
  },

  async getDistributor(id: string): Promise<Distributor | null> {
    return distributorStorage.getById<Distributor>(id);
  },

  async createDistributor(distributor: Omit<Distributor, 'id'>): Promise<Distributor> {
    return distributorStorage.create(distributor);
  },

  async updateDistributor(id: string, distributor: Partial<Distributor>): Promise<Distributor | null> {
    return distributorStorage.update<Distributor>(id, distributor);
  },

  async deleteDistributor(id: string): Promise<boolean> {
    return distributorStorage.delete(id);
  }
};
