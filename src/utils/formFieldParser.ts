import formidable from 'formidable'

export default async function formFieldParser(req) {
  const form = formidable({ multiples: true })

  const formFields = await new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err)
        return
      }
      resolve({ files, ...fields })
    })
  })
  return formFields
}
