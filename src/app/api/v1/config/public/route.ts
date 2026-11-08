import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    appName: 'StockLink',
    version: '1.0.0',
  })
}
