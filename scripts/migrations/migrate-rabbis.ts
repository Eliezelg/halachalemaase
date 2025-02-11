const { prisma, sanitizeString, readJsonFile, disconnectPrisma } = require('./utils');

async function migrateRabbis() {
  try {
    const rabbisData = readJsonFile('rabbis.json');
    
    for (const rabbi of rabbisData) {
      try {
        await prisma.rabbi.create({
          data: {
            id: rabbi.id,
            firstName: sanitizeString(rabbi.firstName),
            lastName: sanitizeString(rabbi.lastName),
            topics: rabbi.topics || [],
            address: sanitizeString(rabbi.address),
            city: sanitizeString(rabbi.city),
            description: sanitizeString(rabbi.description),
            languages: rabbi.languages || [],
            phone: sanitizeString(rabbi.phone),
            photo: rabbi.photo,
          },
        });
        console.log(`✅ Rabbi migrated successfully: ${rabbi.firstName} ${rabbi.lastName}`);
      } catch (error) {
        console.error(`❌ Error migrating rabbi ${rabbi.firstName} ${rabbi.lastName}:`, error);
      }
    }
    console.log('✅ Rabbis migration completed');
  } catch (error) {
    console.error('Error during rabbis migration:', error);
    process.exit(1);
  } finally {
    await disconnectPrisma();
  }
}

migrateRabbis();
