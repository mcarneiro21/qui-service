import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count()
  if (count > 0) {
    console.log(`Seed ignorado — ${count} produto(s) já existem.`)
    return
  }

  console.log('Seeding produtos iniciais...')

  await prisma.product.createMany({
    data: [
      {
        name: 'Margherita Clássica',
        description: 'Molho de tomate, mozzarella fior di latte e manjericão fresco',
        price: 38.0,
        category: 'pizza',
      },
      {
        name: 'Esfirra de Carne',
        description: 'Massa artesanal com carne temperada e cebola caramelizada',
        price: 12.0,
        category: 'esfirra',
      },
      {
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Pepsi ou Guaraná Antarctica (350ml)',
        price: 6.0,
        category: 'refrigerante',
      },
    ],
  })

  console.log('Seed concluído.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
