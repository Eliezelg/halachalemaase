import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs/promises';
import { books as initialBooks } from '@/data/books';
import { Book } from '@/types/books';

const BOOKS_FILE = path.join(process.cwd(), 'data/books.ts');
const IMAGES_DIR = path.join(process.cwd(), 'public/Sfarim');

// Fonction utilitaire pour lire les livres
async function readBooks(): Promise<Book[]> {
  return initialBooks;
}

// Fonction utilitaire pour écrire les livres
async function writeBooks(books: Book[]) {
  const content = `import { Book } from '../types/books';\n\nexport const books: Book[] = ${JSON.stringify(books, null, 2)};`;
  await fs.writeFile(BOOKS_FILE, content, 'utf-8');
}

export async function GET() {
  try {
    const books = await readBooks();
    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading books' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const image = formData.get('image') as File;
    const nedarimPlusLink = formData.get('nedarimPlusLink') as string;
    const isNew = formData.get('isNew') === 'true';

    if (!title || !description || !price || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Créer le répertoire des images s'il n'existe pas
    await fs.mkdir(IMAGES_DIR, { recursive: true });

    // Générer un nom de fichier unique
    const imageExt = image.name.split('.').pop();
    const imageName = `${Date.now()}.${imageExt}`;
    const imagePath = path.join(IMAGES_DIR, imageName);

    // Sauvegarder l'image
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(imagePath, buffer);

    // Lire les livres existants
    const books = await readBooks();

    // Ajouter le nouveau livre
    const newBook: Book = {
      id: (books.length + 1).toString(),
      title,
      description,
      price: `₪${price} כולל משלוח`,
      image: `/Sfarim/${imageName}`,
      nedarimPlusLink,
      isNew
    };

    books.push(newBook);
    await writeBooks(books);

    return NextResponse.json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Error creating book' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const image = formData.get('image') as File;
    const nedarimPlusLink = formData.get('nedarimPlusLink') as string;
    const isNew = formData.get('isNew') === 'true';

    if (!id || !title || !description || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Lire les livres existants
    const books = await readBooks();
    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Mettre à jour le livre
    const updatedBook: Book = {
      ...books[bookIndex],
      title,
      description,
      price: `₪${price} כולל משלוח`,
      nedarimPlusLink,
      isNew
    };

    // Si une nouvelle image est fournie
    if (image) {
      // Supprimer l'ancienne image si elle existe
      const oldImagePath = path.join(process.cwd(), 'public', books[bookIndex].image);
      try {
        await fs.unlink(oldImagePath);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }

      // Sauvegarder la nouvelle image
      const imageExt = image.name.split('.').pop();
      const imageName = `${Date.now()}.${imageExt}`;
      const imagePath = path.join(IMAGES_DIR, imageName);

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(imagePath, buffer);

      updatedBook.image = `/Sfarim/${imageName}`;
    }

    books[bookIndex] = updatedBook;
    await writeBooks(books);

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Error updating book' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing book ID' },
        { status: 400 }
      );
    }

    // Lire les livres existants
    const books = await readBooks();
    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Supprimer l'image
    const imagePath = path.join(process.cwd(), 'public', books[bookIndex].image);
    try {
      await fs.unlink(imagePath);
    } catch (error) {
      console.error('Error deleting image:', error);
    }

    // Supprimer le livre
    books.splice(bookIndex, 1);
    await writeBooks(books);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Error deleting book' },
      { status: 500 }
    );
  }
}
