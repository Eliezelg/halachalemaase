const { prisma, sanitizeString, readJsonFile, disconnectPrisma } = require('./utils');

async function migrateDistributors() {
  try {
    const distributorsData = readJsonFile('distributors.json');
    
    for (const distributor of distributorsData) {
      try {
        await prisma.distributor.create({
          data: {
            name: sanitizeString(distributor.name),
            city: sanitizeString(distributor.city),
            address: sanitizeString(distributor.address),
            phone: distributor.phone,
          },
        });
        console.log(`✅ Distributor migrated successfully: ${distributor.name}`);
      } catch (error) {
        console.error(`❌ Error migrating distributor ${distributor.name}:`, error);
      }
    }
    console.log('✅ Distributors migration completed');
  } catch (error) {
    console.error('Error during distributors migration:', error);
    process.exit(1);
  } finally {
    await disconnectPrisma();
  }
}

migrateDistributors();
