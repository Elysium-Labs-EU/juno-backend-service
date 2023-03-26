import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { gmail_v1, google } from 'googleapis'

import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { responseMiddleware } from '../../middleware/responseMiddleware'
import { gmailV1SchemaLabelSchema } from '../../types/gmailTypes'
import { userSettingsSchemaNumericalSizes } from '../../types/otherTypes'
import errorHandeling from '../../utils/errorHandeling'
import { buildLabelString } from '../../utils/settingsLabel/buildLabelString'

const handleRequestBody = ({ requestBody }: { requestBody: unknown }) => {
  if (typeof requestBody !== 'object' || requestBody === null) {
    return new Error('Invalid request body received from the frontend.')
  }
  if (
    'isSettings' in requestBody &&
    requestBody.isSettings &&
    'value' in requestBody &&
    'settingsLabel' in requestBody
  ) {
    const { value, settingsLabel } = requestBody

    const parsedRequestBodyValue = userSettingsSchemaNumericalSizes.parse(value)
    const labelAsString = buildLabelString(parsedRequestBodyValue)

    const validatedSettingsLabel = gmailV1SchemaLabelSchema.parse(settingsLabel)

    return { ...validatedSettingsLabel, name: labelAsString }
  }
  const typedRegularRequestBody: gmail_v1.Params$Resource$Users$Labels$Update =
    requestBody
  return typedRegularRequestBody
}

const refreshLabel = async (auth: OAuth2Client | undefined, req: Request) => {
  try {
    const gmail = google.gmail({ version: 'v1', auth })
    const { id, requestBody }: { id: string; requestBody: unknown } = req.body

    const toUseRequestBody = handleRequestBody({ requestBody })
    if (toUseRequestBody instanceof Error) {
      throw toUseRequestBody
    }
    if (!id) {
      throw new Error('Invalid id value received')
    }

    const response = await gmail.users.labels.patch({
      userId: USER,
      id,
      requestBody: toUseRequestBody,
    })
    if (response?.data) {
      const validatedResponse = gmailV1SchemaLabelSchema.parse(response.data)
      return validatedResponse
    }
    return new Error('No labels created...')
  } catch (err) {
    errorHandeling(err, 'updateLabels')
  }
}
export const updateLabel = async (req: Request, res: Response) => {
  const { data, statusCode } = await authMiddleware(refreshLabel)(req)
  responseMiddleware(res, statusCode, data)
}
