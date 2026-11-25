import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChefHat,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { CartItem, SubmittedOrder } from '../data/menuData';
import { formatBRL, formatTime } from '../utils/format';
import { DishImage } from './DishImage';

interface OrderSummaryDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  submittedOrders: SubmittedOrder[];
  onClose: () => void;
  onUpdateQuantity: (dishId: number, delta: number) => void;
  onRemoveItem: (dishId: number) => void;
  onClearCart: () => void;
  onSubmitOrder: (kitchenNote: string, includeServiceFee: boolean) => SubmittedOrder;
}

export function OrderSummaryDrawer({
  isOpen,
  items,
  submittedOrders,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder,
}: OrderSummaryDrawerProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [kitchenNote, setKitchenNote] = useState('');
  const [includeServiceFee, setIncludeServiceFee] = useState(true);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<SubmittedOrder | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && items.length > 0 && lastConfirmedOrder) {
      setLastConfirmedOrder(null);
    }
  }, [isOpen, items.length, lastConfirmedOrder]);

  if (!isOpen) return null;

  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.dish.preco * item.quantity, 0);
  const serviceFee = includeServiceFee ? subtotal * 0.1 : 0;
  const total = subtotal + serviceFee;

  const handleConfirmOrder = () => {
    if (items.length === 0) return;
    const confirmed = onSubmitOrder(kitchenNote.trim(), includeServiceFee);
    setLastConfirmedOrder(confirmed);
    setKitchenNote('');
  };

  const totalTableSpent = submittedOrders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-summary-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg h-full bg-[var(--surface)] border-l border-[var(--hairline)] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Resumo */}
        <div className="px-6 py-5 border-b border-[var(--hairline)] flex items-center justify-between gap-4">
          <div>
            <h2
              id="order-summary-title"
              className="font-display text-2xl font-bold text-[var(--ink-primary)]"
            >
              Resumo do Pedido
            </h2>
            <p className="text-sm text-[var(--ink-muted)] mt-0.5">
              Mesa 04 · Restaurante Sabor &amp; Tradição
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[var(--hairline)] text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Fechar resumo do pedido"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Abas quando já há pedidos enviados para a cozinha */}
        {submittedOrders.length > 0 && (
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--hairline)]">
              <button
                type="button"
                onClick={() => setActiveTab('current')}
                className={`min-h-[40px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'current'
                    ? 'bg-[var(--surface)] text-[var(--ink-primary)] shadow-xs'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                Pedido Atual ({totalUnits})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`min-h-[40px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[var(--surface)] text-[var(--ink-primary)] shadow-xs'
                    : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                Enviados ({submittedOrders.length})
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'history' ? (
            <div className="space-y-6">
              {submittedOrders.map((order) => (
                <section
                  key={order.orderNumber}
                  className="pb-6 border-b border-[var(--hairline)] last:border-b-0 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink-primary)]">
                      <ChefHat className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                      <span>Pedido #{order.orderNumber}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Em preparo · {formatTime(order.submittedAt)}</span>
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {order.items.map((item) => (
                      <li
                        key={`${order.orderNumber}-${item.dish.id}`}
                        className="flex items-start justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-[var(--ink-primary)] tabular-nums">
                            {item.quantity}x
                          </span>{' '}
                          <span className="text-[var(--ink-secondary)]">
                            {item.dish.nomeClaro}
                          </span>
                          {item.note && (
                            <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                              Obs.: {item.note}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 font-semibold text-[var(--ink-primary)] tabular-nums">
                          {formatBRL(item.dish.preco * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {order.kitchenNote && (
                    <p className="text-xs text-[var(--ink-muted)] pt-1">
                      Observação geral: {order.kitchenNote}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between text-sm font-bold text-[var(--ink-primary)]">
                    <span>Total enviado</span>
                    <span className="tabular-nums text-[var(--accent)]">
                      {formatBRL(order.total)}
                    </span>
                  </div>
                </section>
              ))}

              <div className="pt-4 border-t border-[var(--hairline)] flex items-center justify-between text-base font-extrabold text-[var(--ink-primary)]">
                <span>Consumo acumulado da Mesa 04</span>
                <span className="tabular-nums text-[var(--accent)]">
                  {formatBRL(totalTableSpent)}
                </span>
              </div>
            </div>
          ) : lastConfirmedOrder && items.length === 0 ? (
            <div className="py-8 space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <CheckCircle2
                  className="w-12 h-12 text-emerald-700"
                  aria-hidden="true"
                />
                <h3 className="font-display text-2xl font-bold text-[var(--ink-primary)]">
                  Pedido #{lastConfirmedOrder.orderNumber} enviado
                </h3>
                <p className="text-sm text-[var(--ink-secondary)] max-w-sm leading-relaxed">
                  A cozinha já recebeu o pedido da Mesa 04 às{' '}
                  <span className="font-semibold tabular-nums">
                    {formatTime(lastConfirmedOrder.submittedAt)}
                  </span>
                  . Assim que ficar pronto, nossa equipe levará à sua mesa.
                </p>
              </div>

              <div className="pt-5 border-t border-[var(--hairline)] space-y-3">
                <h4 className="text-sm font-bold text-[var(--ink-primary)]">
                  Comprovante do pedido
                </h4>
                <ul className="space-y-2 text-sm">
                  {lastConfirmedOrder.items.map((item) => (
                    <li
                      key={item.dish.id}
                      className="flex justify-between gap-4 text-[var(--ink-secondary)]"
                    >
                      <span>
                        <strong className="text-[var(--ink-primary)] tabular-nums">
                          {item.quantity}x
                        </strong>{' '}
                        {item.dish.nomeClaro}
                      </span>
                      <span className="font-semibold text-[var(--ink-primary)] tabular-nums shrink-0">
                        {formatBRL(item.dish.preco * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-[var(--hairline)] flex justify-between text-base font-bold text-[var(--ink-primary)]">
                  <span>Total confirmado</span>
                  <span className="tabular-nums text-[var(--accent)]">
                    {formatBRL(lastConfirmedOrder.total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLastConfirmedOrder(null);
                    onClose();
                  }}
                  className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-bold hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                >
                  Continuar no Cardápio
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="w-full min-h-[44px] px-5 py-2.5 rounded-xl border border-[var(--hairline)] text-sm font-semibold text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
                >
                  Ver pedidos enviados da Mesa 04
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center space-y-4">
              <ShoppingBag
                className="w-10 h-10 text-stone-300"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <h3 className="font-display text-xl font-semibold text-[var(--ink-primary)]">
                  Seu pedido está vazio
                </h3>
                <p className="text-sm text-[var(--ink-muted)] max-w-xs">
                  Escolha entradas, pratos principais ou sobremesas no cardápio para montar o pedido da Mesa 04.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
              >
                Explorar Cardápio
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lista de itens */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink-secondary)]">
                  {totalUnits} {totalUnits === 1 ? 'item selecionado' : 'itens selecionados'}
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                >
                  Limpar pedido
                </button>
              </div>

              <ul className="divide-y divide-[var(--hairline)]">
                {items.map((item) => (
                  <li key={item.dish.id} className="py-4 first:pt-0 flex gap-4">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <DishImage
                        src={item.dish.imagem}
                        alt={item.dish.nomeClaro}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[var(--ink-primary)] leading-snug">
                            {item.dish.nomeClaro}
                          </h3>
                          <p className="text-xs text-[var(--ink-muted)] mt-0.5 tabular-nums">
                            {formatBRL(item.dish.preco)} cada · {item.dish.porcao}
                          </p>
                          {item.note && (
                            <p className="text-xs text-[var(--accent)] mt-1">
                              Obs.: {item.note}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.dish.id)}
                          className="p-1.5 text-[var(--ink-muted)] hover:text-red-700 transition-colors cursor-pointer"
                          aria-label={`Remover ${item.dish.nomeClaro} do pedido`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-lg border border-[var(--hairline)] bg-[var(--surface-subtle)]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.dish.id, -1)}
                            className="inline-flex items-center justify-center w-9 h-9 text-[var(--ink-primary)] hover:bg-[var(--surface)] rounded-l-lg transition-colors cursor-pointer"
                            aria-label={`Diminuir quantidade de ${item.dish.nomeClaro}`}
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold tabular-nums text-[var(--ink-primary)]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.dish.id, 1)}
                            className="inline-flex items-center justify-center w-9 h-9 text-[var(--ink-primary)] hover:bg-[var(--surface)] rounded-r-lg transition-colors cursor-pointer"
                            aria-label={`Aumentar quantidade de ${item.dish.nomeClaro}`}
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-[var(--ink-primary)] tabular-nums">
                          {formatBRL(item.dish.preco * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Observação geral da mesa */}
              <div className="pt-4 border-t border-[var(--hairline)] space-y-2">
                <label
                  htmlFor="kitchen-note"
                  className="block text-sm font-semibold text-[var(--ink-primary)]"
                >
                  Observações gerais da Mesa 04 (opcional)
                </label>
                <textarea
                  id="kitchen-note"
                  rows={2}
                  value={kitchenNote}
                  onChange={(e) => setKitchenNote(e.target.value)}
                  placeholder="Ex.: Servir as entradas primeiro, trazer pratos extras para compartilhar..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--hairline)] bg-[var(--canvas)] text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Rodapé fixo com totais e confirmação (somente na aba Pedido Atual com itens) */}
        {activeTab === 'current' && items.length > 0 && (
          <div className="px-6 py-5 border-t border-[var(--hairline)] bg-[var(--surface-subtle)] space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-[var(--ink-secondary)]">
                <span>Subtotal ({totalUnits} {totalUnits === 1 ? 'item' : 'itens'})</span>
                <span className="font-semibold text-[var(--ink-primary)] tabular-nums">
                  {formatBRL(subtotal)}
                </span>
              </div>

              <label className="flex items-center justify-between gap-3 cursor-pointer text-[var(--ink-secondary)]">
                <span className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeServiceFee}
                    onChange={(e) => setIncludeServiceFee(e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent)] rounded cursor-pointer"
                  />
                  <span>Taxa de serviço opcional (10%)</span>
                </span>
                <span className="font-medium text-[var(--ink-primary)] tabular-nums">
                  {formatBRL(serviceFee)}
                </span>
              </label>

              <div className="pt-2 border-t border-[var(--hairline)] flex items-center justify-between text-lg font-extrabold text-[var(--ink-primary)]">
                <span>Total do Pedido</span>
                <span className="tabular-nums text-[var(--accent)]">
                  {formatBRL(total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmOrder}
              className="w-full min-h-[52px] px-5 py-3 rounded-xl bg-[var(--accent)] text-white text-base font-bold hover:bg-[var(--accent-hover)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            >
              Enviar Pedido para a Cozinha
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
