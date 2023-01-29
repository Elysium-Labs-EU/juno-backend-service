import { z } from 'zod'

import { gmailV1SchemaProfileSchema } from './gmailTypes'
import { peopleV1SchemaNameSchema } from './peopleTypes'

export const getAuthUrlResponseSchema = z.string()

export type TGetAuthUrlResponseSchema = z.infer<typeof getAuthUrlResponseSchema>

export const getAuthenticateClient = z.union

// Generated by ts-to-zod
export const credentialsSchema = z.object({
  refresh_token: z.string().optional().nullable(),
  expiry_date: z.number().optional().nullable(),
  access_token: z.string().optional().nullable(),
  token_type: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  scope: z.string().optional(),
})

export type TCredentialsSchema = z.infer<typeof credentialsSchema>

export const credentialRequestSchema = z.object({
  refresh_token: z.string().optional(),
  access_token: z.string().optional(),
  token_type: z.string().optional(),
  expires_in: z.number().optional(),
  id_token: z.string().optional(),
  scope: z.string().optional(),
})

export const jWTInputSchema = z.object({
  type: z.string().optional(),
  client_email: z.string().optional(),
  private_key: z.string().optional(),
  private_key_id: z.string().optional(),
  project_id: z.string().optional(),
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
  refresh_token: z.string().optional(),
  quota_project_id: z.string().optional(),
})

export const credentialBodySchema = z.object({
  client_email: z.string().optional(),
  private_key: z.string().optional(),
})

export const extendedGmailV1SchemaProfileSchemaSchema =
  gmailV1SchemaProfileSchema.and(
    peopleV1SchemaNameSchema.pick({ displayName: true })
  )