import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { productsRouter } from './routes/products'
import { ordersRouter } from './routes/orders'
import { customersRouter } from './routes/customers'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001

app.use(cors())
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/customers', customersRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server] erro não tratado:', err.message)
  res.status(500).json({ error: 'Erro interno do servidor.' })
})

app.listen(PORT, () => {
  console.log(`[server] rodando em http://localhost:${PORT}`)
})
