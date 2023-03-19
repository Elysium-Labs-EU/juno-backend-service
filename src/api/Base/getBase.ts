import type { Request, Response } from 'express'
import { z } from 'zod'

import { ARCHIVE_LABEL } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import { newLabel } from '../Labels/createLabel'
import { fetchLabels } from '../Labels/getLabels'
import { fetchProfile } from '../Users/getProfile'
import { fetchSendAs } from '../Users/getSendAs'

const createMissingLabel = async (label: string, req: Request) => {
  try {
    const body = {
      name: label,
      labelVisibility: 'labelShow',
      messageListVisibility: 'show',
    }
    // Reassign the request body to be used by the function.
    req.body = body
    const labelResponse = await authMiddleware(newLabel)(req)
    return labelResponse
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return undefined
  }
}

const stringArraySchema = z.array(z.string())

export async function getBase(req: Request, res: Response) {
  try {
    const { BASE_ARRAY } = req.body

    const validatedRequestBody = stringArraySchema.parse(BASE_ARRAY)

    const userResponse = await authMiddleware(fetchProfile)(req)

    const { data } = userResponse || {}

    if (!data || data instanceof Error) {
      throw new Error('Invalid user response data')
    }

    const { emailAddress } = data

    if (!emailAddress) {
      throw new Error('Invalid user email address')
    }

    // We are adding the result of the first API here to be used in the fetchSendAs api request.
    req.query = { emailId: emailAddress }

    const [sendAsResponse, labelResponse] = await Promise.allSettled([
      authMiddleware(fetchSendAs)(req),
      authMiddleware(fetchLabels)(req),
    ])

    if (labelResponse.status === 'rejected') {
      return res.status(500).json({
        error: `Network Error. ${
          labelResponse?.reason || JSON.stringify(labelResponse)
        }. Please try again later.`,
      })
    }
    if (sendAsResponse.status === 'rejected') {
      return res.status(500).json({
        error: `Network Error. ${
          sendAsResponse?.reason || JSON.stringify(sendAsResponse)
        }. Please try again later.`,
      })
    }

    const promisesHaveSettledWithValues =
      sendAsResponse.status === 'fulfilled' &&
      'data' in sendAsResponse.value &&
      labelResponse.status === 'fulfilled' &&
      'data' in labelResponse.value

    if (
      !promisesHaveSettledWithValues ||
      sendAsResponse.value.data instanceof Error ||
      labelResponse.value.data instanceof Error
    ) {
      throw new Error('Invalid sendAs or label response data')
    }

    const possibleLabels = labelResponse.value.data?.labels || []

    const nameMapLabels = new Set(possibleLabels.map((label) => label.name))

    const missingLabels = validatedRequestBody.filter(
      (item) => !nameMapLabels.has(item)
    )

    const batchCreateLabels = await Promise.all(
      missingLabels.map((item) => createMissingLabel(item, req))
    )

    if (
      batchCreateLabels.some((createdLabel) => createdLabel instanceof Error)
    ) {
      throw new Error('Invalid response on creation of labels')
    }

    //TODO: Fix up the types here
    const newlyCreatedLabels = batchCreateLabels
      .map((createdLabel) => {
        const checkValue = createdLabel?.data
        if (checkValue && !(checkValue instanceof Error)) {
          return checkValue
        }
        return undefined
      })
      .filter((item): item is NonNullable<typeof item> => item !== undefined)

    const labels = [...new Set([...newlyCreatedLabels, ...possibleLabels])]

    const prefetchedBoxes = validatedRequestBody
      .map((baseLabel) => labels.find((item) => item.name === baseLabel))
      .filter((item): item is NonNullable<typeof item> => item !== undefined)

    // Add an empty label to have the option to show ALL emails.
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
      signature: sendAsResponse?.value?.data?.signature ?? '',
      ...userResponse.data,
    }

    const returnObject = {
      profile,
      labels,
      prefetchedBoxes: extendedPrefetchedBoxesWithArchiveLabel,
    }
    return res.status(200).json(returnObject)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}
