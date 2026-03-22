import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Stub middleware - no auth checks needed for public portfolio
export async function updateSession(request: NextRequest) {
  return NextResponse.next()
}
