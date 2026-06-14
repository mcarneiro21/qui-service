export const MIN_DELIVERY_FEE = 3

/**
 * Calcula a taxa de entrega de um pedido.
 *
 * Hoje retorna sempre o valor mínimo (R$ 3,00). Este é o ÚNICO ponto a ser
 * alterado no futuro para derivar a taxa a partir do endereço do cliente
 * (ex.: tabela de bairros/zonas, distância, CEP). A assinatura já recebe o
 * endereço para essa evolução.
 */
export function computeDeliveryFee(_address?: string): number {
  // TODO(futuro): calcular com base em `_address` (bairro/zona/distância).
  return MIN_DELIVERY_FEE
}
