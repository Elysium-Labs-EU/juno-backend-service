import { Request } from 'express'
import { Test, Expect } from 'vitest'

import formFieldParser from './formFieldParser'

const request = {
  headers: {},
  body: {},
  query: {},
} as Request

export const formFieldParserTests: Test[] = [
  {
    name: 'parses form fields correctly',
    async fn() {
      const form = new FormData()
      form.append('name', 'John')
      form.append('email', 'john@example.com')
      const req = {
        ...request,
        headers: form.getHeaders(),
        method: 'POST',
        body: form.getBuffer(),
      } as Request
      const result = await formFieldParser(req)
      Expect(result.name).toBe('John')
      Expect(result.email).toBe('john@example.com')
    },
  },
  {
    name: 'returns an error for invalid form data',
    async fn() {
      const req = {
        ...request,
        headers: {
          'content-type': 'multipart/form-data',
        },
        method: 'POST',
        body: 'invalid form data',
      } as Request
      try {
        await formFieldParser(req)
        Expect(true).toBe(false) // should throw an error
      } catch (err) {
        Expect(err.message).toMatch(/Multipart: Boundary not found/)
      }
    },
  },
]
