import { Request } from 'express'
import formidable from 'formidable'

export default async function formFieldParser(req: Request) {
  const form = formidable({ multiples: true })

  const formFields = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve({ files, ...fields })
    })
  })
  return formFields
}
