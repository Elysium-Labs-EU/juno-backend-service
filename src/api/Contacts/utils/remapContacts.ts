import type { TPeopleV1SchemaSearchResponseSchema } from '../../../types/peopleTypes'

/**
 * @function remapContact
 * @param {TPeopleV1SchemaSearchResponseSchema} - An object with the shape of TPeopleV1SchemaSearchResponseSchema.
 * @return {Array<Object>} - An array of remapped contact objects.
 *
 * @description This function takes an object in the shape of TPeopleV1SchemaSearchResponseSchema, maps over the results property of the object,
 * and returns an array of objects with the shape { name: string, emailAddress: string }. If the contact object has a 'names' property, the name is set to the displayName of the first item in that array,
 * otherwise, it is set to the value of the first item in the emailAddresses array. If the results property is not present or empty, an empty array is returned.
 */

export default function remapContacts({
  results,
}: TPeopleV1SchemaSearchResponseSchema) {
  return (
    results?.map((contact) => ({
      name: Object.prototype.hasOwnProperty.call(contact.person, 'names')
        ? contact?.person?.names?.[0]?.displayName
        : contact?.person?.emailAddresses?.[0]?.value,
      emailAddress: contact?.person?.emailAddresses?.[0]?.value,
    })) ?? []
  )
}
