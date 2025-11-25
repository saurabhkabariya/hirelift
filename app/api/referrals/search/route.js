import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import ReferralProfile from '@/models/ReferralProfile';

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT token and get user
async function verifyToken(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - Search candidates with advanced filters
export async function GET(request) {
  try {
    await connectDB();
    
    await verifyToken(request); // Ensure user is authenticated
    
    const { searchParams } = new URL(request.url);
    
    // Search parameters
    const query = searchParams.get('q') || '';
    const skills = searchParams.get('skills');
    const location = searchParams.get('location');
    const minExperience = parseInt(searchParams.get('minExperience')) || 0;
    const maxExperience = parseInt(searchParams.get('maxExperience')) || 50;
    const roles = searchParams.get('roles');
    const availability = searchParams.get('availability');
    const minSalary = parseInt(searchParams.get('minSalary'));
    const maxSalary = parseInt(searchParams.get('maxSalary'));
    const sortBy = searchParams.get('sortBy') || 'lastListedAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = Math.min(parseInt(searchParams.get('limit')) || 12, 50); // Max 50 results per page
    
    // Build search query
    let searchQuery = { isActive: true };
    
    // Text search across multiple fields
    if (query) {
      searchQuery.$or = [
        { fullName: { $regex: query, $options: 'i' } },
        { headline: { $regex: query, $options: 'i' } },
        { summary: { $regex: query, $options: 'i' } },
        { currentPosition: { $regex: query, $options: 'i' } },
        { currentCompany: { $regex: query, $options: 'i' } },
        { skills: { $in: [new RegExp(query, 'i')] } },
        { desiredRoles: { $in: [new RegExp(query, 'i')] } }
      ];
    }
    
    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      searchQuery.skills = { $in: skillsArray.map(skill => new RegExp(skill, 'i')) };
    }
    
    // Location filter
    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }
    
    // Experience range filter
    if (minExperience >= 0 || maxExperience < 50) {
      searchQuery.yearsOfExperience = {
        $gte: minExperience,
        $lte: maxExperience
      };
    }
    
    // Desired roles filter
    if (roles) {
      const rolesArray = roles.split(',').map(role => role.trim());
      searchQuery.desiredRoles = { $in: rolesArray.map(role => new RegExp(role, 'i')) };
    }
    
    // Availability filter
    if (availability) {
      searchQuery.availability = availability;
    }
    
    // Salary range filter
    if (minSalary || maxSalary) {
      const salaryFilter = {};
      if (minSalary) salaryFilter.$gte = minSalary;
      if (maxSalary) salaryFilter.$lte = maxSalary;
      
      searchQuery.$or = [
        { 'salaryExpectation.min': salaryFilter },
        { 'salaryExpectation.max': salaryFilter }
      ];
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    let sortObject = {};
    sortObject[sortBy] = sortOrder;
    
    // Execute search with aggregation to sort by referral points
    const profiles = await ReferralProfile.aggregate([
      { $match: searchQuery },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $addFields: {
          referralPoints: { $ifNull: ['$user.referralPoints', 0] },
          averageRating: { $ifNull: ['$user.referralStats.averageRating', 0] },
          totalReferrals: { $ifNull: ['$user.referralStats.successfulReferrals', 0] }
        }
      },
      // Sort by referral points first, then by the specified sort field
      { 
        $sort: (() => {
          const sortObj = { referralPoints: -1 };  // Always prioritize higher points
          if (sortBy !== 'referralPoints') {
            sortObj[sortBy] = sortOrder;
          }
          return sortObj;
        })()
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          fullName: 1,
          headline: 1,
          summary: 1,
          location: 1,
          skills: 1,
          yearsOfExperience: 1,
          currentPosition: 1,
          currentCompany: 1,
          desiredRoles: 1,
          availability: 1,
          views: 1,
          successfulReferrals: 1,
          lastListedAt: 1,
          referralPoints: 1,
          averageRating: 1,
          totalReferrals: 1
        }
      }
    ]);
    
    // Get total count for pagination
    const total = await ReferralProfile.countDocuments(searchQuery);
    
    // Get aggregated data for filters
    const [skillsAgg, locationsAgg, rolesAgg] = await Promise.all([
      ReferralProfile.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 }
      ]),
      ReferralProfile.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 30 }
      ]),
      ReferralProfile.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$desiredRoles' },
        { $group: { _id: '$desiredRoles', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 30 }
      ])
    ]);
    
    // Format results
    const formattedProfiles = profiles.map(profile => ({
      _id: profile._id,
      fullName: profile.fullName,
      headline: profile.headline,
      summary: profile.summary ? profile.summary.substring(0, 200) + '...' : '', // Truncate for preview
      location: profile.location,
      skills: profile.skills,
      yearsOfExperience: profile.yearsOfExperience,
      currentPosition: profile.currentPosition,
      currentCompany: profile.currentCompany,
      desiredRoles: profile.desiredRoles,
      availability: profile.availability,
      views: profile.views || 0,
      successfulReferrals: profile.successfulReferrals || 0,
      lastListedAt: profile.lastListedAt,
      referralPoints: profile.referralPoints || 0,
      averageRating: profile.averageRating || 0,
      totalReferrals: profile.totalReferrals || 0
    }));
    
    return NextResponse.json({
      success: true,
      profiles: formattedProfiles,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        skills: skillsAgg.map(item => ({ value: item._id, count: item.count })),
        locations: locationsAgg.map(item => ({ value: item._id, count: item.count })),
        roles: rolesAgg.map(item => ({ value: item._id, count: item.count }))
      },
      searchInfo: {
        query,
        totalResults: total,
        filters: {
          skills: skills?.split(',') || [],
          location,
          experience: { min: minExperience, max: maxExperience },
          roles: roles?.split(',') || [],
          availability,
          salary: { min: minSalary, max: maxSalary }
        }
      }
    });
    
  } catch (error) {
    console.error('Error searching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to search candidates' },
      { status: 500 }
    );
  }
}

// POST - Advanced search with complex filters (for heavy queries)
export async function POST(request) {
  try {
    await dbConnect();
    
    await verifyToken(request); // Ensure user is authenticated
    
    const searchFilters = await request.json();
    
    const {
      textSearch,
      skills = [],
      locations = [],
      experienceRange = { min: 0, max: 50 },
      roles = [],
      availability,
      salaryRange,
      education = [],
      languages = [],
      sortBy = 'lastListedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = searchFilters;
    
    // Build complex query
    let query = { isActive: true };
    
    // Text search
    if (textSearch) {
      query.$text = { $search: textSearch };
    }
    
    // Skills filter (AND logic - must have all specified skills)
    if (skills.length > 0) {
      query.skills = { $all: skills };
    }
    
    // Location filter (OR logic)
    if (locations.length > 0) {
      query.location = { $in: locations.map(loc => new RegExp(loc, 'i')) };
    }
    
    // Experience range
    query.yearsOfExperience = {
      $gte: experienceRange.min,
      $lte: experienceRange.max
    };
    
    // Desired roles
    if (roles.length > 0) {
      query.desiredRoles = { $in: roles };
    }
    
    // Availability
    if (availability) {
      query.availability = availability;
    }
    
    // Salary range
    if (salaryRange) {
      query.$or = [
        {
          'salaryExpectation.min': {
            $gte: salaryRange.min || 0,
            $lte: salaryRange.max || 10000000
          }
        },
        {
          'salaryExpectation.max': {
            $gte: salaryRange.min || 0,
            $lte: salaryRange.max || 10000000
          }
        }
      ];
    }
    
    // Education filter
    if (education.length > 0) {
      query['education.degree'] = { $in: education };
    }
    
    // Languages filter
    if (languages.length > 0) {
      query['languages.language'] = { $in: languages };
    }
    
    // Pagination
    const skip = (page - 1) * Math.min(limit, 50);
    
    // Execute search
    const profiles = await ReferralProfile.find(query)
      .populate('userId', 'firstName lastName referralStats')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Math.min(limit, 50));
    
    const total = await ReferralProfile.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      profiles,
      pagination: {
        current: page,
        pages: Math.ceil(total / Math.min(limit, 50)),
        total
      }
    });
    
  } catch (error) {
    console.error('Error in advanced search:', error);
    return NextResponse.json(
      { error: 'Failed to perform advanced search' },
      { status: 500 }
    );
  }
}