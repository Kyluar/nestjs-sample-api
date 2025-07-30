import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const gabriel = await prisma.user.upsert({
    where: { email: 'gabriel@prisma.io' },
    update: {},
    create: {
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
  })
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
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
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
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
  })
  console.log({ alice, bob, gabriel })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
