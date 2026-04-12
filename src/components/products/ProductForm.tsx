import { useState } from 'react'
import { ProductCategory, CATEGORY_LABELS } from '../../types'
import { useProductStore } from '../../store/productStore'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

interface FormState {
  name: string
  description: string
  price: string
  category: ProductCategory
}

const EMPTY: FormState = {
  name: '',
  description: '',
  price: '',
  category: 'pizza',
}

interface ProductFormProps {
  onSuccess?: () => void
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const addProduct = useProductStore((s) => s.addProduct)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [success, setSuccess] = useState(false)

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!form.description.trim()) e.description = 'Descrição é obrigatória'
    const priceNum = parseFloat(form.price.replace(',', '.'))
    if (!form.price || isNaN(priceNum) || priceNum <= 0) {
      e.price = 'Insira um preço válido'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    addProduct({
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price.replace(',', '.')),
      category: form.category,
    })
    setForm(EMPTY)
    setErrors({})
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
    onSuccess?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface_container_lowest rounded-2xl p-6 flex flex-col gap-4"
    >
      <h2 className="text-lg font-bold font-display text-on_surface">Novo Produto</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome"
          placeholder="Ex: Diavola Grande"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Preço (R$)"
            placeholder="0,00"
            value={form.price}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9,\.]/g, '')
              setForm({ ...form, price: val })
            }}
            error={errors.price}
          />
          <Select
            label="Categoria"
            options={categoryOptions}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
          />
        </div>
      </div>

      <Textarea
        label="Descrição"
        placeholder="Ingredientes, tamanho, observações..."
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        error={errors.description}
      />

      <div className="flex items-center gap-4">
        <Button type="submit" size="md">
          Adicionar Produto
        </Button>
        {success && (
          <span className="text-sm text-green-700 font-body">Produto adicionado!</span>
        )}
      </div>
    </form>
  )
}
