const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function readJsonFile(filePath: string): Promise<any> {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

interface Rabbi {
  id: string;
  firstName: string;
  lastName: string;
  topics: string[];
  address?: string;
  city?: string;
  description?: string;
  languages?: string[];
  photo?: string;
}

interface Book {
  id: string;
  title: string;
  description?: string;
  price?: string;
  imageUrl?: string;
  nedarimPlusLink?: string;
  isNew?: boolean;
}

interface QA {
  topic: string;
  question: string;
  answer: string;
  authorId?: string;
}

interface Distributor {
  name: string;
  city?: string;
  address?: string;
  phone?: string;
}

async function migrateRabbis(): Promise<void> {
  console.log('\n🚀 Migrating rabbis...');
  const rabbisData = await readJsonFile(path.join(__dirname, '../../data/rabbis.json')) as Rabbi[];

  for (const rabbi of rabbisData) {
    try {
      await prisma.rabbi.create({
        data: {
          id: rabbi.id,
          firstName: rabbi.firstName,
          lastName: rabbi.lastName,
          topics: rabbi.topics,
          address: rabbi.address,
          city: rabbi.city,
          description: rabbi.description,
          languages: rabbi.languages || [],
          imageUrl: rabbi.photo
        }
      });
      console.log(`✅ Successfully migrated rabbi ${rabbi.firstName} ${rabbi.lastName}`);
    } catch (error) {
      console.log(`❌ Error migrating rabbi ${rabbi.firstName} ${rabbi.lastName}:`, error);
    }
  }
  console.log('✅ Rabbis migration completed');
}

async function migrateBooks(): Promise<void> {
  console.log('\n🚀 Migrating books...');
  const booksData = await readJsonFile(path.join(__dirname, '../../data/books.json')) as Book[];

  for (const book of booksData) {
    try {
      await prisma.book.create({
        data: {
          id: parseInt(book.id),
          title: book.title,
          description: book.description,
          price: book.price,
          imageUrl: book.imageUrl,
          nedarimPlusLink: book.nedarimPlusLink,
          isNew: book.isNew
        }
      });
      console.log(`✅ Successfully migrated book ${book.title}`);
    } catch (error) {
      console.log(`❌ Error migrating book ${book.title}:`, error);
    }
  }
  console.log('✅ Books migration completed');
}

async function migrateQA(): Promise<void> {
  console.log('\n🚀 Migrating QA...');
  const qaData = await readJsonFile(path.join(__dirname, '../../data/qa.json')) as QA[];
  const rabbiId = "f83df09e-7f11-4e82-8b07-ffb2c9a352f5"; // ID du Rabbi Ophir Itzhak Malka

  for (const qa of qaData) {
    try {
      await prisma.qA.create({
        data: {
          topic: qa.topic,
          question: qa.question,
          answer: qa.answer,
          authorId: rabbiId // Utiliser l'ID du Rabbi Ophir Itzhak Malka pour tous les QAs
        }
      });
      console.log(`✅ Successfully migrated QA: ${qa.question.substring(0, 50)}...`);
    } catch (error) {
      console.log(`❌ Error migrating QA:`, error);
    }
  }
  console.log('✅ QA migration completed');
}

async function migrateDistributors(): Promise<void> {
  console.log('\n🚀 Migrating distributors...');
  const distributorsData = await readJsonFile(path.join(__dirname, '../../data/distributors.json')) as Distributor[];

  for (const distributor of distributorsData) {
    try {
      await prisma.distributor.create({
        data: {
          name: distributor.name,
          city: distributor.city,
          address: distributor.address,
          phone: distributor.phone
        }
      });
      console.log(`✅ Successfully migrated distributor ${distributor.name}`);
    } catch (error) {
      console.log(`❌ Error migrating distributor ${distributor.name}:`, error);
    }
  }
  console.log('✅ Distributors migration completed');
}

async function cleanDatabase(): Promise<void> {
  console.log('🗑️ Cleaning existing data...');
  await prisma.qA.deleteMany();
  await prisma.book.deleteMany();
  await prisma.distributor.deleteMany();
  await prisma.rabbi.deleteMany();
  console.log('✅ Existing data cleaned');
}

async function main(): Promise<void> {
  try {
    await cleanDatabase();
    await migrateRabbis();
    await migrateBooks();
    await migrateQA();
    await migrateDistributors();
    console.log('\n✨ All migrations completed!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
