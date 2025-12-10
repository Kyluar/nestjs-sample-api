import * as bcrypt from 'bcrypt'
import { Prisma, PrismaClient } from '@prisma/client'
import { Environment } from '@/lib/types/common.types'
import { saltRoundsSchema } from '@/lib/dtos/config/vars.dto'

const seedUsers: Prisma.UserCreateInput[] = [
  {
    email: 'gabriel@prisma.io',
    name: 'Gabriel',
    password: 'gabrielpassword',
    posts: {
      create: {
        title: 'Seeding with Prisma',
        content:
          'https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding',
        published: true,
      },
    },
  },
  {
    email: 'alice@prisma.io',
    name: 'Alice',
    password: 'alicepassword',
    posts: {
      create: {
        title: 'Check out Prisma with Next.js',
        content: 'https://www.prisma.io/nextjs',
        published: true,
      },
    },
  },
  {
    email: 'bob@prisma.io',
    name: 'Bob',
    password: 'bobpassword',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://twitter.com/prisma',
          published: true,
        },
        {
          title: 'Follow Nexus on Twitter',
          content: 'https://twitter.com/nexusgql',
          published: true,
        },
      ],
    },
  },
  ...(process.env.NODE_ENV === Environment.Test &&
  process.env.TEST_USER_EMAIL &&
  process.env.TEST_USER_PASSWORD &&
  process.env.TEST_USER_NAME
    ? [
        {
          name: process.env.TEST_USER_NAME,
          email: process.env.TEST_USER_EMAIL,
          password: process.env.TEST_USER_PASSWORD,
          posts: {
            create: {
              title: 'Extensions',
              content:
                'https://www.prisma.io/docs/orm/prisma-client/client-extensions',
              published: false,
            },
          },
        },
      ]
    : []),
]

async function hashUsersPassword(
  users: Prisma.UserCreateInput[],
  saltOrRounds: string | number
): Promise<Prisma.UserCreateInput[]> {
  return Promise.all(
    users.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, saltOrRounds),
    }))
  )
}

export async function seed(
  prisma: PrismaClient,
  log: boolean = true
): Promise<void> {
  const saltRounds = saltRoundsSchema.parse(process.env.SALT_ROUNDS)

  const hashedSeedUsers = await hashUsersPassword(seedUsers, saltRounds)

  const requests = hashedSeedUsers.map((u) =>
    prisma.user.upsert({ where: { email: u.email }, update: {}, create: u })
  )

  const users = await prisma.$transaction(requests)

  if (log) {
    console.info(users)
    console.info('Database seeded successfully!')
  }
}
