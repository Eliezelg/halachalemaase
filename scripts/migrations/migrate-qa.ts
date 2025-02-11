const { prisma, sanitizeString, readJsonFile, disconnectPrisma } = require('./utils');

async function migrateQA() {
  try {
    const qaData = readJsonFile('qa.json');
    
    for (const qa of qaData) {
      try {
        await prisma.qA.create({
          data: {
            topic: sanitizeString(qa.topic),
            question: sanitizeString(qa.question),
            answer: sanitizeString(qa.answer),
          },
        });
        console.log(`✅ QA migrated successfully: ${qa.topic}`);
      } catch (error) {
        console.error(`❌ Error migrating QA ${qa.topic}:`, error);
      }
    }
    console.log('✅ QA migration completed');
  } catch (error) {
    console.error('Error during QA migration:', error);
    process.exit(1);
  } finally {
    await disconnectPrisma();
  }
}

migrateQA();
