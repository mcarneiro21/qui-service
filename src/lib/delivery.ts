export const MIN_DELIVERY_FEE = 3

/** Taxa usada quando o bairro do endereço não está na tabela. */
export const DEFAULT_DELIVERY_FEE = 6

/**
 * Tabela de taxa de entrega por bairro.
 *
 * ⚠️ VALORES DE EXEMPLO — ajuste com os bairros e preços reais da sua área.
 * A chave é o nome do bairro; a busca ignora maiúsculas/minúsculas e acentos.
 *
 * Os 3 primeiros batem com os clientes do seed (Centro, Jardim América,
 * Vila Nova) para você ver o cálculo funcionando de imediato.
 */
export const DELIVERY_FEES_BY_NEIGHBORHOOD: Record<string, number> = {
  'Centro': 4,
  'Jardim América': 7,
  'Vila Nova': 6,
  'Jardim Europa': 8,
  'Parque Industrial': 10,
  'Zona Rural': 12,
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .toLowerCase()
    .trim()
}

/**
 * Calcula a taxa de entrega a partir do endereço do cliente.
 *
 * Procura no endereço algum bairro conhecido da tabela acima; se encontrar,
 * usa a taxa correspondente. Caso contrário, usa DEFAULT_DELIVERY_FEE.
 * O resultado nunca fica abaixo de MIN_DELIVERY_FEE.
 *
 * É chamada ao selecionar o cliente no pedido (pré-preenche o campo de
 * entrega, que continua editável).
 */
export function computeDeliveryFee(address?: string): number {
  if (!address) return Math.max(DEFAULT_DELIVERY_FEE, MIN_DELIVERY_FEE)

  const normalizedAddress = normalize(address)

  // Do bairro mais específico (nome mais longo) para o mais curto, evitando
  // que um nome curto "ganhe" de um composto (ex.: "Jardim" vs "Jardim América").
  const neighborhoods = Object.keys(DELIVERY_FEES_BY_NEIGHBORHOOD).sort(
    (a, b) => b.length - a.length
  )

  for (const neighborhood of neighborhoods) {
    if (normalizedAddress.includes(normalize(neighborhood))) {
      return Math.max(DELIVERY_FEES_BY_NEIGHBORHOOD[neighborhood], MIN_DELIVERY_FEE)
    }
  }

  return Math.max(DEFAULT_DELIVERY_FEE, MIN_DELIVERY_FEE)
}
