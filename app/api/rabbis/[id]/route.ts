import { NextResponse } from 'next/server';
import * as rabbiService from '@/services/rabbis';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = 'then' in context.params ? await context.params : context.params;
  
  try {
    const { rabbi } = await rabbiService.getRabbiById(params.id);
    if (!rabbi) {
      return NextResponse.json(
        { error: 'Rabbi not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(rabbi);
  } catch (error) {
    console.error('API Error - GET /api/rabbis/[id]:', error);
    return NextResponse.json(
      { 
        error: 'Error reading rabbi',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
