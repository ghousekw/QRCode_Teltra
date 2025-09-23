import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function safeFetchJson(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init)
  const contentType = res.headers.get('content-type') || ''
  if (!res.ok) {
    // try to parse json error body if present
    if (contentType.includes('application/json')) {
      const err = await res.json()
      throw new Error(`Request failed: ${res.status} ${JSON.stringify(err)}`)
    }
    const text = await res.text()
    throw new Error(`Request failed: ${res.status} - expected JSON but received: ${text.slice(0,200)}`)
  }
  if (!contentType.includes('application/json')) {
    const text = await res.text()
    throw new Error(`Expected JSON response but received content-type '${contentType}': ${text.slice(0,200)}`)
  }
  return res.json()
}
