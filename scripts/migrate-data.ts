const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function sanitizeString(str: string | null): string {
  if (!str) return '';
  return str.trim()
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function migrateData() {
  try {
    // Créer un rabbin par défaut pour les QAs sans auteur
    console.log('Creating default rabbi...');
    const defaultRabbi = await prisma.rabbi.create({
      data: {
        firstName: 'Admin',
        lastName: 'System',
        topics: [],
        address: '',
        city: '',
        description: 'System account for legacy QAs',
        languages: [],
      },
    });
    console.log('✅ Created default rabbi for QAs without author');

    // Migrate Rabbis
    console.log('Migrating rabbis...');
    const rabbisData = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data', 'rabbis.json'), 'utf-8')
    );

    const processedRabbis = new Set();
    const rabbiIds = new Map(); // Pour stocker les IDs des rabbins

    for (const rabbi of rabbisData) {
      try {
        const firstName = sanitizeString(rabbi.firstName);
        const lastName = sanitizeString(rabbi.lastName);
        const key = `${firstName}_${lastName}`.toLowerCase();

        if (processedRabbis.has(key)) {
          console.log(`⚠️ Skipping duplicate rabbi: ${firstName} ${lastName}`);
          continue;
        }

        if (!firstName || !lastName) {
          console.log(`⚠️ Skipping rabbi with missing name: ${JSON.stringify(rabbi)}`);
          continue;
        }

        const createdRabbi = await prisma.rabbi.create({
          data: {
            firstName,
            lastName,
            topics: Array.isArray(rabbi.topics) ? rabbi.topics.map(sanitizeString) : [],
            address: sanitizeString(rabbi.address),
            city: sanitizeString(rabbi.city),
            description: sanitizeString(rabbi.description),
            languages: Array.isArray(rabbi.languages) ? rabbi.languages.map(sanitizeString) : [],
            imageUrl: rabbi.imageUrl || '/rabbis/rav.png'
          },
        });
        rabbiIds.set(createdRabbi.id, createdRabbi); // Stocker l'ID et les données du rabbin
        processedRabbis.add(key);
        console.log(`✅ Rabbi migrated successfully: ${firstName} ${lastName}`);
      } catch (error) {
        console.error(`❌ Error migrating rabbi:`, error);
      }
    }

    // Migrate QAs
    console.log('Migrating QAs...');
    const qaData = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data', 'qa.json'), 'utf-8')
    );

    for (const qa of qaData) {
      try {
        const question = sanitizeString(qa.question);
        const answer = sanitizeString(qa.answer);
        
        if (!question || !answer) {
          console.log(`⚠️ Skipping QA with missing question or answer`);
          continue;
        }

        // Vérifier si l'authorId existe, sinon utiliser le rabbin par défaut
        let authorId = defaultRabbi.id;
        if (qa.authorId) {
          // Si l'ID existe dans notre Map de rabbins, l'utiliser
          if (rabbiIds.has(qa.authorId)) {
            authorId = qa.authorId;
          } else {
            console.log(`⚠️ Author ID ${qa.authorId} not found, using default rabbi`);
          }
        }

        await prisma.qA.create({
          data: {
            topic: sanitizeString(qa.topic),
            question,
            answer,
            authorId,
          },
        });
        console.log(`✅ QA migrated successfully: ${question.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Error migrating QA:`, error);
      }
    }
    console.log('✅ QAs migration completed');

    // Migrate Books
    console.log('Migrating books...');
    const booksData = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data', 'books.json'), 'utf-8')
    );
    
    for (const book of booksData) {
      try {
        const title = sanitizeString(book.title);
        if (!title) {
          console.log(`⚠️ Skipping book without title`);
          continue;
        }

        await prisma.book.create({
          data: {
            title,
            description: sanitizeString(book.description),
            price: sanitizeString(book.price),
            imageUrl: sanitizeString(book.image),
            nedarimPlusLink: sanitizeString(book.nedarimPlusLink),
            isNew: book.isNew || false,
          },
        });
        console.log(`✅ Book migrated successfully: ${title}`);
      } catch (error) {
        console.error(`❌ Error migrating book:`, error);
      }
    }
    console.log('✅ Books migration completed');

    // Migrate Distributors
    console.log('Migrating distributors...');
    const distributorsData = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data', 'distributors.json'), 'utf-8')
    );
    for (const distributor of distributorsData) {
      try {
        const name = sanitizeString(distributor.name);
        if (!name) {
          console.warn(`⚠️ Skipping distributor without name`);
          continue;
        }

        await prisma.distributor.create({
          data: {
            name,
            city: sanitizeString(distributor.city),
            address: sanitizeString(distributor.address),
            phone: sanitizeString(distributor.phone),
          },
        });
        console.log(`✅ Distributor migrated successfully: ${name}`);
      } catch (error) {
        console.error(`❌ Error migrating distributor:`, error);
      }
    }
    console.log('✅ Distributors migration completed');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
