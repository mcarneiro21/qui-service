import { Router, Request, Response } from 'express'
import { prisma } from '../db'

export const productsRouter = Router()

function serialize(p: { id: string; name: string; description: string; price: object; category: string; createdAt: Date }) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    createdAt: p.createdAt.toISOString(),
  }
}

// GET /api/products
productsRouter.get('/', async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } })
  res.json(products.map(serialize))
})

// POST /api/products
productsRouter.post('/', async (req: Request, res: Response) => {
  const { name, description, price, category } = req.body as {
    name: string
    description: string
    price: number
    category: string
  }

  if (!name || !description || price == null || !category) {
    res.status(400).json({ error: 'Campos obrigatórios: name, description, price, category' })
    return
  }

  const product = await prisma.product.create({
    data: { name, description, price, category },
  })
  res.status(201).json(serialize(product))
})

// DELETE /api/products/:id
productsRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  await prisma.product.delete({ where: { id } })
  res.status(204).send()
})
