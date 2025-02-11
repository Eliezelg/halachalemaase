import { PrismaClient, Rabbi } from '@prisma/client';

const prisma = new PrismaClient();

async function removeDuplicateRabbis() {
  try {
    // 1. Récupérer tous les rabbins
    const rabbis = await prisma.rabbi.findMany();
    
    // 2. Créer un Map pour stocker les rabbins uniques par nom
    const uniqueRabbis = new Map<string, Rabbi>();
    const duplicates: Rabbi[] = [];
    
    rabbis.forEach(rabbi => {
      const key = `${rabbi.firstName}_${rabbi.lastName}`.toLowerCase();
      if (!uniqueRabbis.has(key)) {
        uniqueRabbis.set(key, rabbi);
      } else {
        duplicates.push(rabbi);
      }
    });
    
    // 3. Supprimer les doublons
    console.log(`Found ${duplicates.length} duplicate rabbis`);
    for (const duplicate of duplicates) {
      await prisma.rabbi.delete({
        where: { id: duplicate.id }
      });
      console.log(`Deleted duplicate rabbi: ${duplicate.firstName} ${duplicate.lastName}`);
    }
    
    console.log('✅ Duplicate removal completed');
  } catch (error) {
    console.error('Error removing duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeDuplicateRabbis();
