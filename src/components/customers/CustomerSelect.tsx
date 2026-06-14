import { useMemo, useState } from 'react'
import { Search, UserPlus, X, Check, User } from 'lucide-react'
import { Customer } from '../../types'
import { useCustomerStore } from '../../store/customerStore'
import { Input } from '../ui/Input'

interface CustomerSelectProps {
  selected: Customer | undefined
  onSelect: (customer: Customer | undefined) => void
}

export function CustomerSelect({ selected, onSelect }: CustomerSelectProps) {
  const customers = useCustomerStore((s) => s.customers)
  const addCustomer = useCustomerStore((s) => s.addCustomer)

  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', address: '', phone: '' })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers.slice(0, 6)
    return customers
      .filter((c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q))
      .slice(0, 6)
  }, [customers, query])

  async function handleCreate() {
    if (!newForm.name.trim() || !newForm.address.trim() || !newForm.phone.trim()) {
      setError('Preencha nome, endereço e celular')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const customer = await addCustomer({
        name: newForm.name.trim(),
        address: newForm.address.trim(),
        phone: newForm.phone.trim(),
      })
      onSelect(customer)
      setCreating(false)
      setNewForm({ name: '', address: '', phone: '' })
      setQuery('')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  // ── Cliente selecionado ──────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="rounded-2xl bg-primary/5 ring-2 ring-primary/20 px-4 py-3 flex items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-primary flex-shrink-0" />
            <span className="font-semibold font-display text-on_surface text-sm truncate">
              {selected.name}
            </span>
          </div>
          <p className="text-xs text-on_surface_variant font-body mt-0.5 truncate">
            {selected.phone} · {selected.address}
          </p>
        </div>
        <button
          onClick={() => onSelect(undefined)}
          className="text-xs font-medium font-body text-primary px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors flex-shrink-0"
        >
          Trocar
        </button>
      </div>
    )
  }

  // ── Cadastro rápido ──────────────────────────────────────────────────────────
  if (creating) {
    return (
      <div className="rounded-2xl bg-surface_container_low p-4 flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold font-display text-on_surface text-sm">Novo cliente</span>
          <button
            onClick={() => { setCreating(false); setError(null) }}
            className="p-1 rounded-lg hover:bg-surface_container_highest transition-colors"
          >
            <X size={16} className="text-on_surface_variant" />
          </button>
        </div>
        <Input
          placeholder="Nome"
          value={newForm.name}
          onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
        />
        <Input
          placeholder="Celular"
          value={newForm.phone}
          onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
        />
        <Input
          placeholder="Endereço"
          value={newForm.address}
          onChange={(e) => setNewForm({ ...newForm, address: e.target.value })}
        />
        {error && <span className="text-xs text-primary font-body">{error}</span>}
        <button
          onClick={handleCreate}
          disabled={saving}
          className="w-full rounded-xl py-3 bg-gradient-primary text-on_primary font-display font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          <Check size={16} />
          {saving ? 'Salvando...' : 'Salvar e selecionar'}
        </button>
      </div>
    )
  }

  // ── Busca ────────────────────────────────────────────────────────────────────
  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-on_surface_variant font-body flex items-center gap-1 mb-1.5">
        Cliente <span className="text-primary">*</span>
      </label>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on_surface_variant/60" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          className="w-full rounded-xl bg-surface_container_low pl-9 pr-4 py-3 text-on_surface font-body placeholder:text-on_surface_variant/50 outline-none transition-colors duration-150 focus:bg-surface_container_highest"
        />
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-col gap-1 mt-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="text-left rounded-xl px-3 py-2 hover:bg-surface_container_highest transition-colors"
            >
              <span className="font-medium font-body text-on_surface text-sm block truncate">{c.name}</span>
              <span className="text-xs text-on_surface_variant font-body truncate block">
                {c.phone} · {c.address}
              </span>
            </button>
          ))}
        </div>
      )}

      {query.trim() && filtered.length === 0 && (
        <p className="text-xs text-on_surface_variant font-body mt-2 px-1">
          Nenhum cliente encontrado.
        </p>
      )}

      <button
        onClick={() => { setCreating(true); setNewForm({ ...newForm, name: query.trim() }) }}
        className="mt-2 w-full rounded-xl py-2.5 bg-secondary_container text-on_secondary_container font-medium font-body text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <UserPlus size={15} />
        Novo cliente
      </button>
    </div>
  )
}
