import { NextRequest, NextResponse } from 'next/server';
import {api} from '@/app/lib/api/server'

export async function GET(req: NextRequest) {



  try {
   
    const response = await api.get('/houses/');
   
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching houses:', error);
    return NextResponse.json({ error: 'Failed to fetch houses' }, { status: 500 });
  }
}