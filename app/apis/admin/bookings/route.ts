import { NextRequest, NextResponse } from 'next/server';
import {api} from '@/app/lib/api/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');

  try {
    const response = await api.get('/admins/bookings', { params: { search } });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();
    const response = await api.post(`/admins/bookings/${bookingId}/approve`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error approving booking:', error);
    return NextResponse.json({ error: 'Failed to approve booking' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get('booking_id');
  const userEmail = searchParams.get('user_email');
  const userUsername = searchParams.get('user_username');
  const ownerEmail = searchParams.get('owner_email');

  try {
    const response = await api.delete('/admins/bookings/search-delete', {
      params: { booking_id: bookingId, user_email: userEmail, user_username: userUsername, owner_email: ownerEmail }
    });
    return NextResponse.json(response.data, { status: 204 });
  } catch (error) {
    console.error('Error deleting bookings:', error);
    return NextResponse.json({ error: 'Failed to delete bookings' }, { status: 500 });
  }
}

