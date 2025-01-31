import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/app/lib/api/server';

export async function GET(req: NextRequest, { params }) {
  const { id } = await params; // Extract id from params, assume it could be any

  if (!id) {
    return NextResponse.json(
      { error: 'House ID is required' },
      { status: 400 }
    );
  }

  try {
    const { data } = await api.get(`/houses/house/${id}`); // Destructure response to get data directly
    return NextResponse.json(data); // Return the data as a JSON response
  } catch (error) {
   
    return NextResponse.json(
      { error: 'Failed to fetch house' },
      { status: 500 }
    );
  }
}

