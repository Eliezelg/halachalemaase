import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs/promises';
import { bookService } from '@/services/books';
import { convertPrismaBook } from '@/types/prisma';

const IMAGES_DIR = path.join(process.cwd(), 'public/Sfarim');

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  const id = params.id;
  
  try {
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const book = await bookService.getBookById(id);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(convertPrismaBook(book));
  } catch (error) {
    console.error('API Error - GET /api/books/[id]:', error);
    return NextResponse.json(
      { 
        error: 'Error reading book',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const image = formData.get('image') as File;
    const nedarimPlusLink = formData.get('nedarimPlusLink') as string;
    const isNew = formData.get('isNew') === 'true';

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let imageUrl = undefined;
    if (image) {
      // Créer le répertoire des images s'il n'existe pas
      await fs.mkdir(IMAGES_DIR, { recursive: true });

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const filename = `${timestamp}-${image.name}`;
      const imagePath = path.join(IMAGES_DIR, filename);

      // Écrire le fichier
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(imagePath, buffer);

      // Définir l'URL de l'image relative au dossier public
      imageUrl = `/Sfarim/${filename}`;
    }

    const updatedBook = await bookService.updateBook(params.id, {
      title,
      description,
      price,
      imageUrl,
      nedarimPlusLink,
      isNew,
    });

    if (!updatedBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(convertPrismaBook(updatedBook));
  } catch (error) {
    console.error('API Error - PUT /api/books/[id]:', error);
    return NextResponse.json(
      { 
        error: 'Error updating book',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  try {
    // Récupérer le livre avant de le supprimer pour avoir l'URL de l'image
    const book = await bookService.getBookById(params.id);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Supprimer le livre de la base de données
    const deletedBook = await bookService.deleteBook(params.id);

    // Si le livre a une image, la supprimer
    if (book.imageUrl) {
      const imagePath = path.join(process.cwd(), 'public', book.imageUrl);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting book image:', error);
      }
    }

    return NextResponse.json(convertPrismaBook(deletedBook));
  } catch (error) {
    console.error('API Error - DELETE /api/books/[id]:', error);
    return NextResponse.json(
      { 
        error: 'Error deleting book',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
