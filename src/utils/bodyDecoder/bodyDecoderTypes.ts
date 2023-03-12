import type { IAttachment } from '../../types/emailAttachmentTypes'

export interface IBodyProps {
  emailHTML: string
  emailFileHTML: Array<IAttachment>
  removedTrackers?: Array<string>
}
