import { config } from 'https://deno.land/x/dotenv/mod.ts'

import application from './routes/app.ts'

const env = config({ safe: true })
const PORT = Number(env.PORT) || 5001

application.listen(PORT)
