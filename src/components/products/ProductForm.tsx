import { useEffect, useState } from 'react'
import { Product, ProductCategory, CATEGORY_LABELS } from '../../types'
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
  editingProduct?: Product | null
  onCancel?: () => void
  onSuccess?: () => void
}

export function ProductForm({ editingProduct, onCancel, onSuccess }: ProductFormProps) {
  const addProduct = useProductStore((s) => s.addProduct)
  const updateProduct = useProductStore((s) => s.updateProduct)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [success, setSuccess] = useState(false)

  const isEditing = !!editingProduct

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toFixed(2).replace('.', ','),
        category: editingProduct.category,
      })
      setErrors({})
    } else {
      setForm(EMPTY)
    }
  }, [editingProduct])

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price.replace(',', '.')),
      category: form.category,
    }

    if (isEditing && editingProduct) {
      await updateProduct(editingProduct.id, data)
      onSuccess?.()
    } else {
      await addProduct(data)
      setForm(EMPTY)
      setErrors({})
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      onSuccess?.()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface_container_lowest rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-display text-on_surface">
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </h2>
        {isEditing && (
          <span className="text-xs text-on_surface_variant font-body bg-surface_container_low px-2 py-1 rounded-lg">
            Editando: {editingProduct?.name}
          </span>
        )}
      </div>

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

      <div className="flex items-center gap-3">
        <Button type="submit" size="md">
          {isEditing ? 'Salvar Alterações' : 'Adicionar Produto'}
        </Button>
        {isEditing && (
          <Button type="button" variant="ghost" size="md" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        {success && (
          <span className="text-sm text-green-700 font-body">Produto adicionado!</span>
        )}
      </div>
    </form>
  )
}
