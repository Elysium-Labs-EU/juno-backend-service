import type { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { z } from 'zod'

import { ARCHIVE_LABEL } from '../../constants/globalConstants'
import type { TGmailV1SchemaLabelSchema } from '../../types/gmailTypes'
import { userSettingsSchemaNumericalSizes } from '../../types/otherTypes'
import errorHandeling from '../../utils/errorHandeling'
import createSettingsLabel from '../../utils/settingsLabel/createSettings'
import findSettings from '../../utils/settingsLabel/findSettings'
import parseSettings from '../../utils/settingsLabel/parseSettings'
import { newLabel } from '../Labels/createLabel'
import { fetchLabels } from '../Labels/getLabels'
import {
  authenticateUserLocal,
  authenticateUserSession,
} from '../Users/authenticateUser'
import { fetchSendAs } from '../Users/fetchSendAs'
import { fetchProfile } from '../Users/getProfile'

const createMissingLabel = async ({
  auth,
  label,
}: {
  auth: OAuth2Client
  label: string
}) => {
  try {
    const req = {
      body: {
        name: label,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    }
    const labelResponse = await newLabel(auth, req)
    return labelResponse
  } catch (err) {
    errorHandeling(err, 'createMissingLabel')
    return undefined
  }
}

const detectSettingsLabel = async ({
  auth,
  labels,
}: {
  auth: OAuth2Client
  labels: Array<TGmailV1SchemaLabelSchema>
}) => {
  const settingsLabel = findSettings(labels, auth)
  if (!settingsLabel || !settingsLabel.id) {
    const response = await createSettingsLabel(auth)
    if (!response) {
      throw Error('Cannot create settings label')
    }
    return response
  } else {
    return settingsLabel
  }
}

const stringArraySchema = z.array(z.string())

export async function getBase(req: Request, res: Response) {
  try {
    const { BASE_ARRAY } = req.body

    const validatedRequestBody = stringArraySchema.parse(BASE_ARRAY)

    if (!req.headers.authorization) {
      throw Error('No Authorization header found')
      // TODO: Handle auth error
    }
    // A boolean to determine if the local or session authorization route should be used.
    const useLocalRoute =
      typeof JSON.parse(req.headers.authorization) === 'object'
    const auth = useLocalRoute
      ? await authenticateUserLocal(req)
      : await authenticateUserSession(req)

    if (!auth) {
      throw new Error('Unable to auth the user')
    }
    const userResponse = await fetchProfile(auth)

    const userData = userResponse || {}

    if (!userData || userData instanceof Error) {
      throw new Error('Invalid user response data')
    }

    const { emailAddress } = userData

    if (!emailAddress) {
      throw new Error('Invalid user email address')
    }

    // We are adding the result of the first API here to be used in the fetchSendAs api request.
    req.query = { emailId: emailAddress }

    const [sendAsResponse, labelResponse] = await Promise.allSettled([
      fetchSendAs(auth, req),
      fetchLabels(auth),
    ])

    if (labelResponse.status === 'rejected') {
      return res.status(500).json({
        error: `Network Error. ${labelResponse?.reason || JSON.stringify(labelResponse)
          }. Please try again later.`,
      })
    }
    if (sendAsResponse.status === 'rejected') {
      return res.status(500).json({
        error: `Network Error. ${sendAsResponse?.reason || JSON.stringify(sendAsResponse)
          }. Please try again later.`,
      })
    }

    const promisesHaveSettledWithValues =
      sendAsResponse.status === 'fulfilled' &&
      labelResponse.status === 'fulfilled'

    if (
      !promisesHaveSettledWithValues ||
      sendAsResponse.value instanceof Error ||
      labelResponse.value instanceof Error
    ) {
      throw new Error('Invalid sendAs or label response data')
    }

    const possibleLabels = labelResponse.value?.labels || []

    const nameMapLabels = new Set(possibleLabels.map((label) => label.name))

    const missingLabels = validatedRequestBody.filter(
      (item) => !nameMapLabels.has(item)
    )

    const batchCreateLabels = await Promise.all(
      missingLabels.map((item) => {
        return createMissingLabel({ auth, label: item })
      })
    )

    if (
      batchCreateLabels.some((createdLabel) => createdLabel instanceof Error)
    ) {
      throw new Error('Invalid response on creation of labels')
    }

    const newlyCreatedLabels = batchCreateLabels
      .map((createdLabel) => {
        const checkValue = createdLabel
        if (checkValue && !(checkValue instanceof Error)) {
          return checkValue
        }
        return undefined
      })
      .filter((item): item is NonNullable<typeof item> => item !== undefined)

    const labels = [...new Set([...newlyCreatedLabels, ...possibleLabels])]

    const detectedSettingsLabel = await detectSettingsLabel({ auth, labels })
    const userSettingsLabel = detectedSettingsLabel
    const parsedSettings = userSettingsSchemaNumericalSizes.parse(
      parseSettings(detectedSettingsLabel)
    )

    const prefetchedBoxes = validatedRequestBody
      .map((baseLabel) => labels.find((item) => item.name === baseLabel))
      .filter((item): item is NonNullable<typeof item> => item !== undefined)

    // Add an empty label to have the option to show ARCHIVE emails.
    const extendedPrefetchedBoxesWithArchiveLabel = [
      {
        id: ARCHIVE_LABEL,
        name: ARCHIVE_LABEL,
        messageListVisibility: 'show',
        labelListVisibility: 'labelShow',
        type: 'junoCustom',
      },
      ...prefetchedBoxes,
    ]

    const profile = {
      signature: sendAsResponse?.value?.signature ?? '',
      ...userResponse,
    }

    const returnObject = {
      prefetchedBoxes: extendedPrefetchedBoxesWithArchiveLabel,
      profile,
      userSettings: parsedSettings,
      userSettingsLabel,
    }
    return res.status(200).json(returnObject)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}
