const { prisma, sanitizeString, readJsonFile, disconnectPrisma } = require('./utils');

async function migrateBooks() {
  try {
    const booksData = await readJsonFile('books.json');
    
    for (const book of booksData) {
      try {
        console.log(`Processing book: ${book.title}`);
        
        await prisma.book.create({
          data: {
            id: book.id,
            title: sanitizeString(book.title),
            description: sanitizeString(book.description),
            price: sanitizeString(book.price),
            imageUrl: book.imageUrl,
            nedarimPlusLink: book.nedarimPlusLink,
            isNew: book.isNew || false,
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
    process.exit(1);
  } finally {
    await disconnectPrisma();
  }
}

migrateBooks();
