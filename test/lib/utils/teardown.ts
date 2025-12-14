import { INestApplication } from '@nestjs/common'
import { clean } from '@/lib/config/prisma'
import { PrismaClient } from '@prisma/client'

export async function teardownTestEnvironment(
  app: INestApplication
): Promise<void> {
  const prisma = new PrismaClient()
  try {
    await clean(prisma)
    await app.close()
  } catch (err) {
    console.error(err)
    throw new Error('Failed to teardown test environment')
  } finally {
    prisma.$disconnect()
  }
}
