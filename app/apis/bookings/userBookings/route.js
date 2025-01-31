import {  NextResponse } from 'next/server';
import {api} from '@/app/lib/api/server';

export async function GET() {


  try {
    const response = await api.get('/houses/user/bookings');
  
    return NextResponse.json(response.data,{status: 200});
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json([],{ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
