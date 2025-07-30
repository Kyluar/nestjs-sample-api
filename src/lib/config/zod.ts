import { z } from 'zod'
import { zodCustomErrors } from '@/lib/errors'

z.config({ customError: zodCustomErrors })

export { z }
