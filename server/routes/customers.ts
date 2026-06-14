import { Router, Request, Response, NextFunction } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../db'

export const customersRouter = Router()

function serialize(c: {
  id: string
  name: string
  address: string
  phone: string
  createdAt: Date
}) {
  return {
    id: c.id,
    name: c.name,
    address: c.address,
    phone: c.phone,
    createdAt: c.createdAt.toISOString(),
  }
}

// GET /api/customers
customersRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { name: 'asc' } })
    res.json(customers.map(serialize))
  } catch (err) {
    next(err)
  }
})

// POST /api/customers
customersRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, address, phone } = req.body as {
      name: string
      address: string
      phone: string
    }

    if (!name || !address || !phone) {
      res.status(400).json({ error: 'Campos obrigatórios: name, address, phone' })
      return
    }

    const customer = await prisma.customer.create({ data: { name, address, phone } })
    res.status(201).json(serialize(customer))
  } catch (err) {
    next(err)
  }
})

// PATCH /api/customers/:id
customersRouter.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, address, phone } = req.body as Partial<{
      name: string
      address: string
      phone: string
    }>

    const customer = await prisma.customer.update({
      where: { id },
      data: { name, address, phone },
    })
    res.json(serialize(customer))
  } catch (err) {
    next(err)
  }
})

// DELETE /api/customers/:id
customersRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await prisma.customer.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2003') {
      res.status(409).json({
        error: 'Este cliente possui pedidos e não pode ser excluído.',
      })
      return
    }
    next(err)
  }
})
