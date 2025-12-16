import { PrismaClient } from '@prisma/client'
import { userAuthenticate, omitUserPassword } from './user.extensions'

export const extendedPrismaClient = new PrismaClient()
  .$extends(omitUserPassword)
  .$extends(userAuthenticate)

export type ExtendedPrismaClient = typeof extendedPrismaClient
