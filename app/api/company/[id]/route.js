import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/models/Company';

export async function PATCH(req, { params }) {
  await connectDB();
  try {
    const body = await req.json();
    const updated = await Company.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    await Company.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 