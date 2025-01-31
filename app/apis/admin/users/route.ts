import { NextRequest, NextResponse } from 'next/server';
import {api} from '@/app/lib/api/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const email = searchParams.get('email');

  try {
    const response = await api.get('/admins/users/', { params: { username, email } });
    console.log(response.data)
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await api.post('/admins/users/', body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await api.post('/admins/users/', body);
    return NextResponse.json(response.data, { status: 204 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

