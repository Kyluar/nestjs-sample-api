import { PrismaClient } from '@prisma/client'

export async function clean(prisma: PrismaClient): Promise<void> {
  const tables = ['users', 'posts'] // Adicione todas as suas tabelas aqui, usando os nomes de mapeamento (@@map)

  // Desabilita as verificações de chave estrangeira (FK)
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;')

  const requests = tables.map((tableName) =>
    prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${tableName}\`;`)
  )

  // Executa o TRUNCATE em todas as tabelas
  await prisma.$transaction(requests)

  // Reabilita as verificações de chave estrangeira (FK)
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;')
}
