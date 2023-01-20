import { expect, test } from 'vitest'

import enhancePlainText from '../enhancePlainText'

test('enhancePlainText', () => {
  const plainText =
    'This is a plain text with a line break\nand some http://links.com'
  const expectedResult = `This is a plain text with a line break<br>and some <a href="http://links.com" target="_blank" rel="noopener noreferrer">links.com</a>`
  const enhancedText = enhancePlainText(plainText)

  expect(enhancedText).toEqual(expectedResult)
})
