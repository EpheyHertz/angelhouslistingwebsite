import { NextRequest, NextResponse } from 'next/server';
import {api} from '@/app/lib/api/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await api.post('/admins/send-bulk-email', body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error sending bulk email:', error);
    return NextResponse.json({ error: 'Failed to send bulk email' }, { status: 500 });
  }
}

