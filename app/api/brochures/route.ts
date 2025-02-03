import { NextResponse } from 'next/server';
import { JsonStorageService } from '@/services/jsonStorageService';

const jsonStorageService = new JsonStorageService();

export async function GET() {
  try {
    const brochures = await jsonStorageService.readData('brochures');
    return NextResponse.json(brochures);
  } catch (error) {
    console.error('Error reading brochures:', error);
    return NextResponse.json({ error: 'Failed to load brochures' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const brochures = await jsonStorageService.readData('brochures') || [];
    
    // Ajouter la nouvelle brochure
    const newBrochure = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString()
    };

    // Filtrer les brochures par type
    const otherBrochures = brochures.filter((b: any) => b.type !== data.type);
    const sameBrochures = brochures.filter((b: any) => b.type === data.type);

    // Garder seulement les 4 dernières brochures du même type
    const updatedBrochures = [
      newBrochure,
      ...sameBrochures.slice(0, 4),
      ...otherBrochures
    ];

    await jsonStorageService.writeData('brochures', updatedBrochures);
    return NextResponse.json(newBrochure);
  } catch (error) {
    console.error('Error creating brochure:', error);
    return NextResponse.json({ error: 'Failed to create brochure' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const brochures = await jsonStorageService.readData('brochures') || [];
    const updatedBrochures = brochures.filter((b: any) => b.id !== id);
    await jsonStorageService.writeData('brochures', updatedBrochures);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting brochure:', error);
    return NextResponse.json({ error: 'Failed to delete brochure' }, { status: 500 });
  }
}
