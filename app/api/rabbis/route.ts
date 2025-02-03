import { NextResponse } from 'next/server';
import { rabbiService } from '@/services/rabbis';

export async function GET() {
  try {
    const rabbis = await rabbiService.getAllRabbis();
    return NextResponse.json(rabbis);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching rabbis' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const rabbi = await rabbiService.createRabbi(data);
    return NextResponse.json(rabbi);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating rabbi' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const rabbi = await rabbiService.updateRabbi(id, data);
    if (!rabbi) {
      return NextResponse.json({ error: 'Rabbi not found' }, { status: 404 });
    }
    return NextResponse.json(rabbi);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating rabbi' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const success = await rabbiService.deleteRabbi(id);
    if (!success) {
      return NextResponse.json({ error: 'Rabbi not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting rabbi' }, { status: 500 });
  }
}
