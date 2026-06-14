import { Router, Request, Response, NextFunction } from 'express'
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

type OrderWithRelations = {
  id: string
  orderNumber: number
  status: string
  tableNumber: number | null
  total: object
  deliveryFee: object
  createdAt: Date
  customer: { id: string; name: string; address: string; phone: string; createdAt: Date } | null
  items: Parameters<typeof serializeItem>[0][]
}

function mapOrder(order: OrderWithRelations) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    tableNumber: order.tableNumber,
    total: Number(order.total),
    deliveryFee: Number(order.deliveryFee),
    createdAt: order.createdAt.toISOString(),
    customer: order.customer
      ? {
          id: order.customer.id,
          name: order.customer.name,
          address: order.customer.address,
          phone: order.customer.phone,
          createdAt: order.customer.createdAt.toISOString(),
        }
      : undefined,
    items: order.items.map(serializeItem),
  }
}

const ORDER_INCLUDE = {
  items: { include: { product: true } },
  customer: true,
} as const

// GET /api/orders
ordersRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    })
    res.json(orders.map((o) => mapOrder(o as unknown as OrderWithRelations)))
  } catch (err) {
    next(err)
  }
})

// POST /api/orders
ordersRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, tableNumber, total, customerId, deliveryFee } = req.body as {
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
      customerId?: string
      deliveryFee?: number
    }

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'Pedido precisa ter ao menos um item' })
      return
    }

    if (!customerId) {
      res.status(400).json({ error: 'Selecione um cliente para o pedido' })
      return
    }

    const fee = deliveryFee ?? 3
    if (fee < 3) {
      res.status(400).json({ error: 'A taxa de entrega mínima é R$ 3,00' })
      return
    }

    const order = await prisma.order.create({
      data: {
        tableNumber,
        total,
        deliveryFee: fee,
        customerId,
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
      include: ORDER_INCLUDE,
    })

    res.status(201).json(mapOrder(order as unknown as OrderWithRelations))
  } catch (err) {
    next(err)
  }
})

// PATCH /api/orders/:id/status
ordersRouter.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status } = req.body as { status: string }

    const validStatuses = ['pending', 'preparing', 'ready', 'delivered']
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Status inválido' })
      return
    }

    const order = await prisma.order.update({ where: { id }, data: { status } })
    res.json({ id: order.id, status: order.status })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/orders/:id
ordersRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await prisma.order.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})
