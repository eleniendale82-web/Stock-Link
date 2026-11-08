import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message)
  }
}

export function errorResponse(message: string, status = 400, code?: string) {
  return NextResponse.json({ success: false, error: { message, code } }, { status })
}
