import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'

export const omitUserPassword = Prisma.defineExtension({
  name: 'omitUserPassword',
  query: {
    user: {
      $allOperations({ args, query }) {
        const currentArgs = args ?? {}

        const argsWithOmit = currentArgs as typeof currentArgs & {
          omit?: Prisma.UserOmit
        }

        argsWithOmit.omit = {
          password: true,
          ...argsWithOmit.omit,
        }

        return query(argsWithOmit)
      },
    },
  },
})

type UserAuthenticateReturn = {
  userUuid: string
  isAuth: boolean
}

export const userAuthenticate = Prisma.defineExtension({
  name: 'userAuthenticate',
  model: {
    user: {
      async authenticate(
        email: string,
        password: string
      ): Promise<UserAuthenticateReturn> {
        const context = Prisma.getExtensionContext(
          this
        ) as Prisma.UserDelegate<any>

        const user = await context.findUnique({
          where: { email },
          omit: {
            password: false,
          },
        })

        if (!user)
          throw new Prisma.PrismaClientKnownRequestError(
            `User with email ${email} not found`,
            { code: 'P2025', clientVersion: Prisma.prismaVersion.client }
          )

        const isAuth = await bcrypt.compare(password as string, user.password)

        return { userUuid: user.uuid, isAuth }
      },
    },
  },
})
