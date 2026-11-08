import { z } from 'zod'
import { NextRequest } from 'next/server'
import { errorResponse } from './api-error'

export async function validateBody<T>(
  req: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: ReturnType<typeof errorResponse> }> {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    return { data, error: null }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { data: null, error: errorResponse(e.errors[0].message, 422) }
    }
    return { data: null, error: errorResponse('Invalid request body', 400) }
  }
}
