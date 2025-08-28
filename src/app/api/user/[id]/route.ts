import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Retrieve user and their career profile by student ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: studentId } = await params;
  
  if (!studentId || studentId.trim() === '') {
    return NextResponse.json({ error: 'Invalid student id' }, { status: 400 });
  }

  try {
    // TODO
    const user = await prisma.user.findUnique({
      where: { id: "" }
    })
    
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const careerProfile = await prisma.careerProfile.findFirst({
      where: {  userId: user.id },
      include: {
        user: {
          include: { sessions: true }
        }
      }
    });
    
    if (!careerProfile) {
      return NextResponse.json({ error: 'Career profile not found' }, { status: 404 });
    }
    
    return NextResponse.json(careerProfile);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Create a new career profile for authenticated user
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: studentId } = await params;

  try {
    const body = await request.json();

    // Validation for required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' }, 
        { status: 400 }
      );
    }

    // TODO
    const user = await prisma.user.findUnique({
      where: { id: "122334489" }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if career profile already exists for this student ID
    const existingProfile = await prisma.careerProfile.findFirst({
      where: { 
        userId: user.id 
      }
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Career profile already exists. Use PUT to update.' }, 
        { status: 409 }
      );
    }

    // Update user basic info and create career profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
        email: body.email,
        careerProfile: {
          create: {
            college: body.college,
            graduation: body.graduation,
            studentId: studentId,
            skills: body.skills || [],
            projects: body.projects || [],
            website: body.website,
            profilePicturePath: body.profilepicturePath,
            resumePath: body.resumePath,
          }
        }
      },
      include: {
        careerProfile: true,
        sessions: true
      }
    });

    return NextResponse.json(updatedUser, { status: 201 });
    
  } catch (error) {
    console.error('Career profile creation error:', error);
    return NextResponse.json(
      { error: 'Career profile creation failed' }, 
      { status: 500 }
    );
  }
}

// PUT: Update existing career profile
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: studentId } = await params;

  try {
    const body = await request.json();

    // Validation for required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' }, 
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: "122334489" }
    })
    
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update user and career profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
        email: body.email,
        careerProfile: {
          upsert: {
            create: {
              college: body.college,
              graduation: body.graduation,
              studentId: studentId,
              skills: body.skills || [],
              projects: body.projects || [],
              website: body.website,
              profilePicturePath: body.profilepicturePath,
              resumePath: body.resumePath,
            },
            update: {
              college: body.college,
              graduation: body.graduation,
              studentId: studentId,
              skills: body.skills || [],
              projects: body.projects || [],
              website: body.website,
              profilePicturePath: body.profilepicturePath,
              resumePath: body.resumePath,
            }
          }
        }
      },
      include: {
        careerProfile: true,
        sessions: true
      }
    });

    return NextResponse.json(updatedUser);
    
  } catch (error) {
    console.error('Career profile update error:', error);
    return NextResponse.json(
      { error: 'Career profile update failed' }, 
      { status: 500 }
    );
  }
}