import { Router, Request, Response } from 'express'
import { prisma } from '../db'

export const ordersRouter = Router()

function serializeItem(item: {
  productId: string
  productName: string
  productPrice: object
  quantity: number
  isHalfHalf: boolean
  secondProductId: string | null
  secondProductName: string | null
  secondProductPrice: object | null
  product: { id: string; description: string; category: string; createdAt: Date }
}) {
  const base = {
    productId: item.productId,
    quantity: item.quantity,
    isHalfHalf: item.isHalfHalf,
    product: {
      id: item.product.id,
      name: item.productName,
      description: item.product.description,
      price: Number(item.productPrice),
      category: item.product.category,
      createdAt: item.product.createdAt.toISOString(),
    },
  }

  if (item.isHalfHalf && item.secondProductId) {
    return {
      ...base,
      secondProduct: {
        id: item.secondProductId,
        name: item.secondProductName ?? '',
        description: '',
        price: Number(item.secondProductPrice),
        category: 'pizza',
        createdAt: '',
      },
    }
  }

  return base
}

// GET /api/orders
ordersRouter.get('/', async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const mapped = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    tableNumber: order.tableNumber,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map(serializeItem),
  }))

  res.json(mapped)
})

// POST /api/orders
ordersRouter.post('/', async (req: Request, res: Response) => {
  const { items, tableNumber, total } = req.body as {
    items: Array<{
      productId: string
      quantity: number
      productName: string
      productPrice: number
      isHalfHalf?: boolean
      secondProductId?: string
      secondProductName?: string
      secondProductPrice?: number
    }>
    tableNumber?: number
    total: number
  }

  if (!items || items.length === 0) {
    res.status(400).json({ error: 'Pedido precisa ter ao menos um item' })
    return
  }

  const order = await prisma.order.create({
    data: {
      tableNumber,
      total,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productPrice: item.productPrice,
          quantity: item.quantity,
          isHalfHalf: item.isHalfHalf ?? false,
          secondProductId: item.secondProductId ?? null,
          secondProductName: item.secondProductName ?? null,
          secondProductPrice: item.secondProductPrice ?? null,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  })

  const mapped = {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    tableNumber: order.tableNumber,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map(serializeItem),
  }

  res.status(201).json(mapped)
})

// PATCH /api/orders/:id/status
ordersRouter.patch('/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body as { status: string }

  const validStatuses = ['pending', 'preparing', 'ready', 'delivered']
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Status inválido' })
    return
  }

  const order = await prisma.order.update({ where: { id }, data: { status } })
  res.json({ id: order.id, status: order.status })
})

// DELETE /api/orders/:id
ordersRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  await prisma.order.delete({ where: { id } })
  res.status(204).send()
})
