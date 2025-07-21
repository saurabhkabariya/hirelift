import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/models/Company';

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    
    // Handle both single company and bulk upload
    let companies = Array.isArray(body) ? body : [body];
    
    // Validate and process each company
    const processedCompanies = [];
    const errors = [];
    
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      
      // Validate required fields
      const requiredFields = ['companyName', 'industry', 'location', 'jobMode', 'experience'];
      const missingFields = requiredFields.filter(field => !company[field]);
      
      if (missingFields.length > 0) {
        errors.push(`Company ${i + 1}: Missing required fields: ${missingFields.join(', ')}`);
        continue;
      }
      
      // Process the company data
      const processedCompany = {
        ...company,
        status: company.status || 'pending',
        hiringRoles: Array.isArray(company.hiringRoles) 
          ? company.hiringRoles 
          : (typeof company.hiringRoles === 'string' 
              ? company.hiringRoles.split(',').map(r => r.trim()).filter(Boolean)
              : []),
        hrContacts: Array.isArray(company.hrContacts) 
          ? company.hrContacts.filter(hr => hr.name && hr.email && hr.position)
          : []
      };
      
      processedCompanies.push(processedCompany);
    }
    
    // If there are validation errors, return them
    if (errors.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation errors found', 
        details: errors,
        processed: processedCompanies.length,
        total: companies.length
      }, { status: 400 });
    }
    
    // Insert the companies
    const result = await Company.insertMany(processedCompanies);
    
    return NextResponse.json({ 
      success: true, 
      data: result,
      message: `Successfully added ${result.length} companies`
    });
  } catch (error) {
    console.error('Company POST error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.name === 'ValidationError' ? error.errors : undefined
    }, { status: 500 });
  }
}