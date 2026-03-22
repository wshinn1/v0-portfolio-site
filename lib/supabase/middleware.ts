// Placeholder - middleware disabled
// This file exists to prevent import errors but is not used

import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(_request: NextRequest) {
  return NextResponse.next()
}
