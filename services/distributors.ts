import { PrismaClient } from '@prisma/client';
import { Distributor } from '@/types';
import { convertPrismaDistributor } from '@/types/prisma';

const prisma = new PrismaClient();

export const distributorService = {
  async getAllDistributors(): Promise<Distributor[]> {
    const distributors = await prisma.distributor.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return distributors.map(convertPrismaDistributor);
  },

  async getDistributor(id: string): Promise<Distributor | null> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;
    
    const distributor = await prisma.distributor.findUnique({
      where: { id: numericId }
    });
    return distributor ? convertPrismaDistributor(distributor) : null;
  },

  async createDistributor(data: Omit<Distributor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Distributor> {
    const distributor = await prisma.distributor.create({
      data
    });
    return convertPrismaDistributor(distributor);
  },

  async updateDistributor(id: string, data: Partial<Omit<Distributor, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Distributor | null> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
      const distributor = await prisma.distributor.update({
        where: { id: numericId },
        data
      });
      return convertPrismaDistributor(distributor);
    } catch {
      return null;
    }
  },

  async deleteDistributor(id: string): Promise<boolean> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return false;

    try {
      await prisma.distributor.delete({
        where: { id: numericId }
      });
      return true;
    } catch {
      return false;
    }
  }
};
