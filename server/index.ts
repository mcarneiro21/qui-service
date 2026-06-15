import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'node:path'
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

// Em produção, serve o frontend (build do Vite) e faz fallback de SPA.
if (process.env.NODE_ENV === 'production') {
  const clientDir = path.join(process.cwd(), 'dist')
  app.use(express.static(clientDir))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(clientDir, 'index.html'))
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server] erro não tratado:', err.message)
  res.status(500).json({ error: 'Erro interno do servidor.' })
})

app.listen(PORT, () => {
  console.log(`[server] rodando em http://localhost:${PORT}`)
})
