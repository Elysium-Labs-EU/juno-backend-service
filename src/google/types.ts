export interface IAuthClient {
  access_token: string
  refresh_token: string
  scope: string
  token_type: 'Bearer'
  id_token: string
  expiry_date: number
}

export interface IAuthorize {
  session: IAuthClient | null
  idToken?: string
}
