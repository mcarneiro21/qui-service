import { useEffect, useState } from 'react'
import { Customer } from '../../types'
import { useCustomerStore } from '../../store/customerStore'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

interface FormState {
  name: string
  address: string
  phone: string
}

const EMPTY: FormState = {
  name: '',
  address: '',
  phone: '',
}

interface CustomerFormProps {
  editingCustomer?: Customer | null
  onCancel?: () => void
  onSuccess?: () => void
}

export function CustomerForm({ editingCustomer, onCancel, onSuccess }: CustomerFormProps) {
  const addCustomer = useCustomerStore((s) => s.addCustomer)
  const updateCustomer = useCustomerStore((s) => s.updateCustomer)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [success, setSuccess] = useState(false)

  const isEditing = !!editingCustomer

  useEffect(() => {
    if (editingCustomer) {
      setForm({
        name: editingCustomer.name,
        address: editingCustomer.address,
        phone: editingCustomer.phone,
      })
      setErrors({})
    } else {
      setForm(EMPTY)
    }
  }, [editingCustomer])

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!form.address.trim()) e.address = 'Endereço é obrigatório'
    if (!form.phone.trim()) e.phone = 'Celular é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const data = {
      name: form.name.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
    }

    if (isEditing && editingCustomer) {
      await updateCustomer(editingCustomer.id, data)
      onSuccess?.()
    } else {
      await addCustomer(data)
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
          {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        </h2>
        {isEditing && (
          <span className="text-xs text-on_surface_variant font-body bg-surface_container_low px-2 py-1 rounded-lg">
            Editando: {editingCustomer?.name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome"
          placeholder="Ex: João Silva"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="Celular"
          placeholder="(11) 90000-0000"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors.phone}
        />
      </div>

      <Input
        label="Endereço"
        placeholder="Rua, número, bairro..."
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        error={errors.address}
      />

      <div className="flex items-center gap-3">
        <Button type="submit" size="md">
          {isEditing ? 'Salvar Alterações' : 'Adicionar Cliente'}
        </Button>
        {isEditing && (
          <Button type="button" variant="ghost" size="md" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        {success && (
          <span className="text-sm text-green-700 font-body">Cliente adicionado!</span>
        )}
      </div>
    </form>
  )
}
