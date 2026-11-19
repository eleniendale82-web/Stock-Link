// Ambient declarations so plain tsc resolves next/* sub-paths without the Next.js plugin
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'next' {
  export const metadata: any
  export type Metadata = any
}

declare module 'next/server' {
  export const NextResponse: any
  export class NextRequest {
    constructor(...args: any[])
    [key: string]: any
  }
  export type NextFetchEvent = any
}

declare module 'next/link' {
  import type { FC } from 'react'
  const Link: FC<any>
  export default Link
}

declare module 'next/image' {
  import type { FC } from 'react'
  const Image: FC<any>
  export default Image
}

declare module 'next/navigation' {
  export const useRouter: any
  export const usePathname: any
  export const useSearchParams: any
  export const redirect: any
  export const notFound: any
}

declare module 'next/headers' {
  export const headers: any
  export const cookies: any
}

declare module 'next/cache' {
  export const revalidatePath: any
  export const revalidateTag: any
  export const unstable_cache: any
}
