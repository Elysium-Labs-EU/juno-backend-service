import { describe, expect, it } from 'vitest'

import changeSignatureColor from '../changeSignatureColor'

const regexTest =
  /<div class="signature" style="color: var\(--color-neutral-400\) !important">/

describe('changeSignatureColor', () => {
  it('Changes the color of signature divs', () => {
    const input = {
      emailHTML: `
          <html>
            <head></head>
            <body>
              <div class="signature">
                <p>This is a signature</p>
              </div>
              <div>
                <p>This is not a signature</p>
              </div>
            </body>
          </html>
        `,
      emailFileHTML: [],
    }

    const output = {
      emailHTML: `
          <html>
            <head></head>
            <body>
              <div class="signature" style="color: var(--color-neutral-400) !important;">
                <p>This is a signature</p>
              </div>
              <div>
                <p>This is not a signature</p>
              </div>
            </body>
          </html>
        `,
      emailFileHTML: [],
    }

    const result = changeSignatureColor(input)
    expect(result).toEqual({
      ...output,
      emailHTML: expect.stringMatching(regexTest),
    })
  })
  it('Does not change color of non-signature divs', () => {
    const input = {
      emailHTML: `
          <html>
            <head></head>
            <body>
              <div class="other">
                <p>This is not a signature</p>
              </div>
            </body>
          </html>
        `,
      emailFileHTML: [],
    }

    const output = {
      emailHTML: `
          <html>
            <head></head>
            <body>
              <div class="other">
                <p>This is not a signature</p>
              </div>
            </body>
          </html>
        `,
      emailFileHTML: [],
    }

    const result = changeSignatureColor(input)
    expect(result).toEqual({
      ...output,
      emailHTML: expect.not.stringMatching(regexTest),
    })
  })
})
