import { NextRequest, NextResponse } from 'next/server';
import {api} from '@/app/lib/api/server';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams)
  console.log(req)
  const title = searchParams.get('title') ?? '';
  const location = searchParams.get('location') ?? '';
  const ownerEmail = searchParams.get('owner_email') ?? '';
  const minPrice = Number(searchParams.get('min_price')) ?? 0;
  const maxPrice = Number(searchParams.get('max_price')) ?? 0;

  try {
    const response = await api.get('/admins/houses/', { params: { title, location:location, owner_email: ownerEmail, min_price: minPrice, max_price: maxPrice }});
    // const response = await api.get('/admins/houses/');
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching houses:', error);
    return NextResponse.json({ error: 'Failed to fetch houses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await api.post('/admins/houses/', body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Error creating house:', error);
    return NextResponse.json({ error: 'Failed to create house' }, { status: 500 });
  }
}


// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   console.log(searchParams)
//   console.log(req)
//   const title = searchParams.get('title') ?? '';
//   const location = searchParams.get('location') ?? '';
//   const ownerEmail = searchParams.get('owner_email') ?? '';
//   const minPrice = Number(searchParams.get('min_price')) ?? 0;
//   const maxPrice = Number(searchParams.get('max_price')) ?? 0;
//   const house_id= Number(searchParams.get('house_id')) ?? 0;

//   try {
//     const response = await api.get(`/admins/houses/${house_id}`, { params: { title, location:location, owner_email: ownerEmail, min_price: minPrice, max_price: maxPrice }});
//     // const response = await api.get('/admins/houses/');
//     return NextResponse.json(response.data);
//   } catch (error) {
//     console.error('Error fetching houses:', error);
//     return NextResponse.json({ error: 'Failed to fetch houses' }, { status: 500 });
//   }
// }

