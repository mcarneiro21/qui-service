import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PRODUCTS = [
  // ── Pizzas Salgadas — Broto ──────────────────────────────────────────────────
  { name: 'Mussarela (Broto)', description: 'Molho de tomate, mussarela, azeitona, tomate e orégano.', price: 27.0, category: 'broto' },
  { name: 'Calabresa (Broto)', description: 'Molho de tomate, calabresa, cebola.', price: 27.0, category: 'broto' },
  { name: 'Portuguesa (Broto)', description: 'Molho de tomate, presunto, milho, ervilha, cebola, ovos e mussarela.', price: 30.0, category: 'broto' },
  { name: 'Bacon (Broto)', description: 'Molho de tomate, mussarela e bacon.', price: 29.0, category: 'broto' },
  { name: 'Moda da Casa (Broto)', description: 'Molho de tomate, calabresa, cebola, catupiry e mussarela.', price: 32.0, category: 'broto' },
  { name: 'Frango com Catupiry (Broto)', description: 'Molho de tomate, frango desfiado e catupiry.', price: 30.0, category: 'broto' },
  { name: 'Bauru (Broto)', description: 'Molho de tomate, mussarela, presunto, tomate.', price: 28.0, category: 'broto' },
  { name: 'Toscana (Broto)', description: 'Molho de tomate, calabresa, mussarela e cebola.', price: 28.0, category: 'broto' },
  { name: 'Argentina (Broto)', description: 'Molho de tomate, calabresa, cebola, mussarela, bacon e alho.', price: 31.0, category: 'broto' },
  { name: '2 Queijos (Broto)', description: 'Molho de tomate, catupiry e mussarela.', price: 28.0, category: 'broto' },
  { name: '3 Queijos (Broto)', description: 'Molho de tomate, mussarela, parmesão e catupiry.', price: 29.0, category: 'broto' },
  { name: '4 Queijos (Broto)', description: 'Molho de tomate, catupiry, mussarela, provolone e parmesão.', price: 32.0, category: 'broto' },
  { name: 'Calabresa com Catupiry (Broto)', description: 'Molho de tomate, calabresa fatiada, cebola e catupiry.', price: 29.0, category: 'broto' },
  { name: 'Brócolis 1 (Broto)', description: 'Molho de tomate, mussarela e brócolis.', price: 28.0, category: 'broto' },
  { name: 'Brócolis 2 (Broto)', description: 'Molho de tomate, mussarela, brócolis e bacon.', price: 29.0, category: 'broto' },
  { name: 'Baiana (Broto)', description: 'Molho de tomate, calabresa ralada, ovos, cebola e molho de pimenta.', price: 28.0, category: 'broto' },
  { name: 'Milho (Broto)', description: 'Molho de tomate, mussarela e milho.', price: 28.0, category: 'broto' },
  { name: 'Atum com Mussarela (Broto)', description: 'Molho de tomate, cebola, atum e mussarela.', price: 32.0, category: 'broto' },
  { name: 'Frango com Mussarela (Broto)', description: 'Molho de tomate, frango desfiado e mussarela.', price: 28.0, category: 'broto' },
  { name: 'Caipira (Broto)', description: 'Molho de tomate, frango desfiado, milho, ervilha e mussarela.', price: 29.0, category: 'broto' },
  { name: 'Napolitana (Broto)', description: 'Molho de tomate, parmesão, mussarela e tomate em rodelas.', price: 28.0, category: 'broto' },
  { name: 'Atum (Broto)', description: 'Molho de tomate, cebola e atum.', price: 34.0, category: 'broto' },
  // Pizzas Doces — Broto
  { name: 'Brigadeiro (Broto)', description: 'Chocolate com granulado.', price: 29.0, category: 'broto' },
  { name: 'Confeito (Broto)', description: 'Chocolate com confeito.', price: 29.0, category: 'broto' },
  { name: 'Mesclado (Broto)', description: 'Chocolate branco com chocolate preto.', price: 29.0, category: 'broto' },

  // ── Pizzas Salgadas — Grande ─────────────────────────────────────────────────
  { name: 'Mussarela (Grande)', description: 'Molho de tomate, mussarela, azeitona, tomate e orégano.', price: 38.0, category: 'pizza' },
  { name: 'Calabresa (Grande)', description: 'Molho de tomate, calabresa, cebola.', price: 38.0, category: 'pizza' },
  { name: 'Portuguesa (Grande)', description: 'Molho de tomate, presunto, milho, ervilha, cebola, ovos e mussarela.', price: 43.0, category: 'pizza' },
  { name: 'Bacon (Grande)', description: 'Molho de tomate, mussarela e bacon.', price: 42.0, category: 'pizza' },
  { name: 'Moda da Casa (Grande)', description: 'Molho de tomate, calabresa, cebola, catupiry e mussarela.', price: 45.0, category: 'pizza' },
  { name: 'Frango com Catupiry (Grande)', description: 'Molho de tomate, frango desfiado e catupiry.', price: 43.0, category: 'pizza' },
  { name: 'Bauru (Grande)', description: 'Molho de tomate, mussarela, presunto, tomate.', price: 40.0, category: 'pizza' },
  { name: 'Toscana (Grande)', description: 'Molho de tomate, calabresa, mussarela e cebola.', price: 40.0, category: 'pizza' },
  { name: 'Argentina (Grande)', description: 'Molho de tomate, calabresa, cebola, mussarela, bacon e alho.', price: 44.0, category: 'pizza' },
  { name: '2 Queijos (Grande)', description: 'Molho de tomate, catupiry e mussarela.', price: 40.0, category: 'pizza' },
  { name: '3 Queijos (Grande)', description: 'Molho de tomate, mussarela, parmesão e catupiry.', price: 42.0, category: 'pizza' },
  { name: '4 Queijos (Grande)', description: 'Molho de tomate, catupiry, mussarela, provolone e parmesão.', price: 46.0, category: 'pizza' },
  { name: 'Calabresa com Catupiry (Grande)', description: 'Molho de tomate, calabresa fatiada, cebola e catupiry.', price: 42.0, category: 'pizza' },
  { name: 'Brócolis 1 (Grande)', description: 'Molho de tomate, mussarela e brócolis.', price: 40.0, category: 'pizza' },
  { name: 'Brócolis 2 (Grande)', description: 'Molho de tomate, mussarela, brócolis e bacon.', price: 42.0, category: 'pizza' },
  { name: 'Baiana (Grande)', description: 'Molho de tomate, calabresa ralada, ovos, cebola e molho de pimenta.', price: 40.0, category: 'pizza' },
  { name: 'Milho (Grande)', description: 'Molho de tomate, mussarela e milho.', price: 40.0, category: 'pizza' },
  { name: 'Atum com Mussarela (Grande)', description: 'Molho de tomate, cebola, atum e mussarela.', price: 46.0, category: 'pizza' },
  { name: 'Frango com Mussarela (Grande)', description: 'Molho de tomate, frango desfiado e mussarela.', price: 41.0, category: 'pizza' },
  { name: 'Caipira (Grande)', description: 'Molho de tomate, frango desfiado, milho, ervilha e mussarela.', price: 42.0, category: 'pizza' },
  { name: 'Napolitana (Grande)', description: 'Molho de tomate, parmesão, mussarela e tomate em rodelas.', price: 40.0, category: 'pizza' },
  { name: 'Atum (Grande)', description: 'Molho de tomate, cebola e atum.', price: 48.0, category: 'pizza' },
  // Pizzas Doces — Grande
  { name: 'Brigadeiro (Grande)', description: 'Chocolate com granulado.', price: 42.0, category: 'pizza' },
  { name: 'Confeito (Grande)', description: 'Chocolate com confeito.', price: 42.0, category: 'pizza' },
  { name: 'Mesclado (Grande)', description: 'Chocolate branco com chocolate preto.', price: 42.0, category: 'pizza' },

  // ── Bebidas ──────────────────────────────────────────────────────────────────
  { name: 'Coca Cola 2L', description: 'Refrigerante Coca-Cola 2 litros.', price: 15.0, category: 'refrigerante' },
  { name: 'Fanta Laranja 2L', description: 'Refrigerante Fanta Laranja 2 litros.', price: 13.0, category: 'refrigerante' },
  { name: 'Itubaina 2L', description: 'Refrigerante Itubaina 2 litros.', price: 10.0, category: 'refrigerante' },
  { name: 'Dolly 2L', description: 'Refrigerante Dolly 2 litros.', price: 10.0, category: 'refrigerante' },
  { name: 'Sukita 2L', description: 'Refrigerante Sukita 2 litros.', price: 10.0, category: 'refrigerante' },
  { name: 'Cerveja 289ml', description: 'Cerveja lata 289ml.', price: 5.0, category: 'refrigerante' },
  { name: 'Cerveja 350ml', description: 'Cerveja lata 350ml.', price: 7.0, category: 'refrigerante' },
]

const CUSTOMERS = [
  { name: 'João Silva', address: 'Rua das Flores, 123 - Centro', phone: '(11) 98765-4321' },
  { name: 'Maria Oliveira', address: 'Av. Brasil, 456 - Jardim América', phone: '(11) 91234-5678' },
  { name: 'Carlos Souza', address: 'Rua Antônio Del Buoni, 78 - Vila Nova', phone: '(11) 99988-7766' },
]

async function main() {
  // Cardápio: cria apenas os produtos que faltam. NUNCA sobrescreve um produto
  // existente — preços/descrições/categorias editados na aplicação são preservados.
  let created = 0
  for (const data of PRODUCTS) {
    const existing = await prisma.product.findFirst({ where: { name: data.name } })
    if (!existing) {
      await prisma.product.create({ data })
      created++
    }
  }
  console.log(`[seed] Cardápio — ${created} criados, ${PRODUCTS.length - created} já existiam.`)

  // Clientes de exemplo: somente fora de produção (conveniência de desenvolvimento).
  if (process.env.NODE_ENV === 'production') {
    console.log('[seed] Produção: clientes de exemplo não são criados.')
    return
  }

  let custCreated = 0
  for (const data of CUSTOMERS) {
    const existing = await prisma.customer.findFirst({ where: { phone: data.phone } })
    if (!existing) {
      await prisma.customer.create({ data })
      custCreated++
    }
  }
  console.log(`[seed] Clientes de exemplo — ${custCreated} criados.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
