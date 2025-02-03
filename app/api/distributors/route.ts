import { NextResponse } from 'next/server';
import { distributorService } from '@/services/distributors';

export async function GET() {
  try {
    const distributors = await distributorService.getAllDistributors();
    return NextResponse.json(distributors);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching distributors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const distributor = await distributorService.createDistributor(data);
    return NextResponse.json(distributor);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating distributor' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const distributor = await distributorService.updateDistributor(id, data);
    if (!distributor) {
      return NextResponse.json({ error: 'Distributor not found' }, { status: 404 });
    }
    return NextResponse.json(distributor);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating distributor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const success = await distributorService.deleteDistributor(id);
    if (!success) {
      return NextResponse.json({ error: 'Distributor not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting distributor' }, { status: 500 });
  }
}
