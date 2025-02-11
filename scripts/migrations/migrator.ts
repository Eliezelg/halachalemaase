const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('fs');
const path = require('path');

// Types
interface Rabbi {
  firstName: string;
  lastName: string;
  description?: string;
  photo?: string;
}

interface Book {
  title: string;
  description: string;
  coverImage?: string;
  pdfUrl?: string;
  price?: number;
}

interface QA {
  topic: string;
  question: string;
  answer: string;
}

interface Distributor {
  name?: string;
  city?: string;
  address?: string;
  phone?: string;
}

class Migrator {
  private prisma: any;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private sanitizeString(str: string | null | undefined): string {
    if (!str) return '';
    return str.trim().replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
  }

  private readJsonFile<T>(filename: string): T[] {
    const filePath = path.join(process.cwd(), 'data', filename);
    return JSON.parse(readFileSync(filePath, { encoding: 'utf8' }));
  }

  private readBooksFromTS(): Book[] {
    const filePath = path.join(process.cwd(), 'data', 'books.ts');
    const content = readFileSync(filePath, { encoding: 'utf8' });
    const match = content.match(/export const books[^=]*=\s*(\[[\s\S]*?\]);/);
    if (!match) {
      throw new Error('Could not find books array in books.ts');
    }
    return JSON.parse(match[1].replace(/\n/g, ' ').replace(/\r/g, ''));
  }

  async cleanDatabase() {
    console.log('🗑️ Cleaning existing data...');
    await this.prisma.rabbi.deleteMany();
    await this.prisma.book.deleteMany();
    await this.prisma.qA.deleteMany();
    await this.prisma.distributor.deleteMany();
    console.log('✅ Existing data cleaned');
  }

  async migrateRabbis() {
    try {
      console.log('\n🚀 Migrating Rabbis...');
      const rabbis = this.readJsonFile<Rabbi>('rabbis.json');
      
      for (const rabbi of rabbis) {
        try {
          await this.prisma.rabbi.create({
            data: {
              name: `${this.sanitizeString(rabbi.firstName)} ${this.sanitizeString(rabbi.lastName)}`,
              title: null,
              description: this.sanitizeString(rabbi.description),
              imageUrl: rabbi.photo || null,
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
    }
  }

  async migrateBooks() {
    try {
      console.log('\n🚀 Migrating Books...');
      const books = this.readBooksFromTS();
      
      for (const book of books) {
        try {
          await this.prisma.book.create({
            data: {
              title: this.sanitizeString(book.title),
              description: this.sanitizeString(book.description),
              price: book.price ? book.price.toString() : null,
              imageUrl: book.coverImage || null,
              nedarimPlusLink: book.pdfUrl || null,
              isNew: false,
            },
          });
          console.log(`✅ Book created successfully: ${book.title}`);
        } catch (error) {
          console.error(`❌ Error creating book ${book.title}:`, error);
        }
      }
      console.log('✅ Books migration completed');
    } catch (error) {
      console.error('Error during books migration:', error);
    }
  }

  async migrateQA() {
    try {
      console.log('\n🚀 Migrating Q&A...');
      const qaItems = this.readJsonFile<QA>('qa.json');
      
      for (const qa of qaItems) {
        try {
          await this.prisma.qA.create({
            data: {
              topic: this.sanitizeString(qa.topic),
              question: this.sanitizeString(qa.question),
              answer: this.sanitizeString(qa.answer),
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
    }
  }

  async migrateDistributors() {
    try {
      console.log('\n🚀 Migrating Distributors...');
      const distributors = this.readJsonFile<Distributor>('distributors.json');
      
      for (const distributor of distributors) {
        try {
          const name = this.sanitizeString(distributor.name);
          if (!name) continue; // Skip distributors without a name

          await this.prisma.distributor.create({
            data: {
              name: name,
              city: this.sanitizeString(distributor.city) || null,
              address: this.sanitizeString(distributor.address) || null,
              phone: distributor.phone || null,
            },
          });
          console.log(`✅ Distributor migrated successfully: ${name}`);
        } catch (error) {
          console.error(`❌ Error migrating distributor ${distributor.name}:`, error);
        }
      }
      console.log('✅ Distributors migration completed');
    } catch (error) {
      console.error('Error during distributors migration:', error);
    }
  }

  async migrateAll() {
    try {
      await this.cleanDatabase();
      await this.migrateRabbis();
      await this.migrateBooks();
      await this.migrateQA();
      await this.migrateDistributors();
      console.log('\n✨ All migrations completed!');
    } catch (error) {
      console.error('Error during migration:', error);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Exécuter la migration
const migrator = new Migrator();
migrator.migrateAll();
