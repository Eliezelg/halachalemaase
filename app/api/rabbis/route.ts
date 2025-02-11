import { NextResponse } from 'next/server';
import { getRabbis, createRabbi, updateRabbi, deleteRabbi } from '@/services/rabbis';
import { convertPrismaRabbi } from '@/types/prisma';

export async function GET() {
  try {
    const { rabbis } = await getRabbis();
    return NextResponse.json(rabbis.map(convertPrismaRabbi));
  } catch (error) {
    console.error('Error in GET /api/rabbis:', error);
    return NextResponse.json({ 
      error: 'Error fetching rabbis',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { rabbi } = await createRabbi(data);
    if (!rabbi) {
      return NextResponse.json({ error: 'Failed to create rabbi' }, { status: 400 });
    }
    return NextResponse.json(convertPrismaRabbi(rabbi));
  } catch (error) {
    console.error('Error in POST /api/rabbis:', error);
    return NextResponse.json({ 
      error: 'Error creating rabbi',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const { rabbi } = await updateRabbi(id, data);
    if (!rabbi) {
      return NextResponse.json({ error: 'Rabbi not found' }, { status: 404 });
    }
    return NextResponse.json(convertPrismaRabbi(rabbi));
  } catch (error) {
    console.error('Error in PUT /api/rabbis:', error);
    return NextResponse.json({ 
      error: 'Error updating rabbi',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { rabbi } = await deleteRabbi(id);
    if (!rabbi) {
      return NextResponse.json({ error: 'Rabbi not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/rabbis:', error);
    return NextResponse.json({ 
      error: 'Error deleting rabbi',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
