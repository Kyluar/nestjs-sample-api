import * as bcrypt from 'bcrypt'
import { Prisma, PrismaClient } from '@prisma/client'

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '10', 10)

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
]

async function getSeedUsers(): Promise<Prisma.UserCreateInput[]> {
  return Promise.all(
    seedUsers.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, SALT_ROUNDS),
    }))
  )
}

export async function seed(prisma: PrismaClient): Promise<void> {
  const seedUsers = await getSeedUsers()

  const requests = seedUsers.map((u) =>
    prisma.user.upsert({ where: { email: u.email }, update: {}, create: u })
  )

  const users = await prisma.$transaction(requests)

  console.log('Database seeded successfully!')
  console.log(users)
}
