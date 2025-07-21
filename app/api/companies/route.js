import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const mode = searchParams.get('mode');
  const exp = searchParams.get('exp');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const filter = {};

  if (role) {
    filter.hiringRoles = { $elemMatch: { $regex: role, $options: 'i' } };
  }
  if (mode) {
    filter.jobMode = { $regex: mode, $options: 'i' };
  }
  if (exp) {
    if (exp.includes('-')) {
      const [min, max] = exp.split('-').map(Number);
      filter.experience = { $regex: `^${min}-${max}$`, $options: 'i' };
    } else {
      filter.experience = { $regex: exp, $options: 'i' };
    }
  }
  if (status) {
    filter.status = status;
  }

  try {
    const total = await Company.countDocuments(filter);
    const companies = await Company.find(filter)
      .sort({ lastUpdated: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return NextResponse.json({ success: true, data: companies, total });
  } catch (error) {
    console.error('Companies GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}