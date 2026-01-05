import { NextResponse } from 'next/server';
import openapi from '@/../public/openapi.json';

export async function GET() {
  return NextResponse.json(openapi);
}
