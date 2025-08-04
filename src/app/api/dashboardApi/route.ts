import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const searchTerm = searchParams.get('search') || ''; 
  const page = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('itemsPerPage') || '8');

  const users = await prisma.user.findMany();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (page - 1) * itemsPerPage; 
  const endIndex = startIndex + itemsPerPage; 
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex); 

 
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);


  return NextResponse.json({
    users: paginatedUsers,
    totalPages: totalPages,
    currentPage: page,
    totalUsers: filteredUsers.length,
  });
}

