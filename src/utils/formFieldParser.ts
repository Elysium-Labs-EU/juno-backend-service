import { Request } from 'npm:express'
import formidable from 'npm:formidable'

export default async function formFieldParser(req: Request) {
  const form = formidable({ multiples: true })

  const formFields = await new Promise(function (resolve, reject) {
    form.parse(req, function (err: any, fields: any, files: any) {
      if (err) {
        reject(err)
        return
      }
      resolve({ files, ...fields })
    })
  })
  return formFields
}
