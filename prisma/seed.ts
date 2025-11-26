import { PrismaClient } from '@prisma/client'
import { getSeedUsers } from '../src/lib/config/seed/data'

const prisma = new PrismaClient()

async function main() {
  const seedUsers = await getSeedUsers()

  const requests = seedUsers.map((u) =>
    prisma.user.upsert({ where: { email: u.email }, update: {}, create: u })
  )

  const users = await prisma.$transaction(requests)

  console.log(users)
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
