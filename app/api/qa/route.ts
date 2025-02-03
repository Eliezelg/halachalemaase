import { NextResponse } from 'next/server';
import { qaService } from '@/services/qa';
import { QA } from '@/types';

export async function GET() {
  try {
    const qas = await qaService.getAllQAs();
    return NextResponse.json(qas);
  } catch (error) {
    console.error('API Error - GET /api/qa:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching QAs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validation des champs requis
    if (!data.topic || !data.question || !data.answer) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, question, and answer are required' },
        { status: 400 }
      );
    }

    // Validation du type de topic
    const validTopics = ['נדה', 'שבת', 'בשר בחלב', 'טבילת כלים', 'ברכות', 'תפילה', 'חגים', 'חושן משפט'];
    if (!validTopics.includes(data.topic)) {
      return NextResponse.json(
        { error: 'Invalid topic' },
        { status: 400 }
      );
    }

    const qa = await qaService.createQA(data);
    return NextResponse.json(qa, { status: 201 });
  } catch (error) {
    console.error('API Error - POST /api/qa:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating QA' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const qa = await qaService.updateQA(id, data);
    if (!qa) {
      return NextResponse.json(
        { error: 'QA not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(qa);
  } catch (error) {
    console.error('API Error - PUT /api/qa:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error updating QA' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const success = await qaService.deleteQA(id);
    if (!success) {
      return NextResponse.json(
        { error: 'QA not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error - DELETE /api/qa:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error deleting QA' },
      { status: 500 }
    );
  }
}
