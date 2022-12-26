import { type Cookie } from 'https://deno.land/std@0.167.0/http/cookie.ts'
import {
  deleteCookie,
  getCookies,
  getSetCookies,
  setCookie,
} from 'https://deno.land/std@0.167.0/http/cookie.ts'

export default function customSession({ req }: { req: Request }) {
  //   const headers = new Headers()
  //   headers.set('Cookie', 'full=of; tasty=chocolate')

  // const cookies = getCookies(headers);
  // console.log(cookies); // { full: "of", tasty: "chocolate" }

  console.log(req)

  //   const hasCookies = getCookies(req)
  //   console.log('hasCookies', hasCookies)
  //   if (hasCookies) {
  //     console.log('here1')
  //   } else {
  //     console.log('here2')
  //   }
}
