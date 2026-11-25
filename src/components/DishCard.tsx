import { AlertTriangle, Check, Info, Minus, Plus, Users } from 'lucide-react';
import { Dish } from '../data/menuData';
import { formatBRL } from '../utils/format';
import { DishImage } from './DishImage';

interface DishCardProps {
  dish: Dish;
  categoryLabel?: string;
  quantityInCart: number;
  onOpenDetail: (dish: Dish) => void;
  onAdd: (dish: Dish) => void;
  onUpdateQuantity: (dishId: number, delta: number) => void;
}

export function DishCard({
  dish,
  categoryLabel,
  quantityInCart,
  onOpenDetail,
  onAdd,
  onUpdateQuantity,
}: DishCardProps) {
  return (
    <article className="group flex flex-col bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      {/* Foto 4:3 em destaque */}
      <button
        type="button"
        onClick={() => onOpenDetail(dish)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] cursor-pointer"
        aria-label={`Ver detalhes de ${dish.nomeClaro}`}
      >
        <DishImage
          src={dish.imagem}
          alt={dish.nomeClaro}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </button>

      {/* Conteúdo com espaçamento generoso */}
      <div className="flex flex-1 flex-col justify-between p-5 gap-4">
        <div className="space-y-3">
          {/* Metadados limpos sem caixas/pílulas */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[var(--ink-muted)]">
            {categoryLabel && (
              <>
                <span className="text-[var(--accent)] font-semibold">{categoryLabel}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{dish.porcao}</span>
            </span>
          </div>

          {/* Título + Preço alinhados */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold leading-snug text-[var(--ink-primary)] text-balance">
                {dish.nomeClaro}
              </h3>
              <p className="mt-0.5 text-xs italic text-[var(--ink-muted)]">
                Anteriormente: &ldquo;{dish.nomeOriginal}&rdquo;
              </p>
            </div>
            <span className="shrink-0 text-base font-bold text-[var(--accent)] tabular-nums pt-0.5">
              {formatBRL(dish.preco)}
            </span>
          </div>

          {/* Descrição clara */}
          <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
            {dish.desc}
          </p>
        </div>

        <div className="space-y-4 pt-3 border-t border-[var(--hairline)]">
          {/* Alergênicos e dieta como texto semântico limpo (ícone + texto explícito) */}
          <ul
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium"
            aria-label="Informações de alergênicos e dieta"
          >
            {dish.alergens.map((allergen) => (
              <li
                key={allergen.text}
                className={`inline-flex items-center gap-1 ${
                  allergen.type === 'warning'
                    ? 'text-red-700'
                    : 'text-emerald-800'
                }`}
              >
                {allergen.type === 'warning' ? (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
                <span>{allergen.text}</span>
              </li>
            ))}
          </ul>

          {/* Rodapé de ações */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenDetail(dish)}
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[var(--hairline)] bg-[var(--surface)] text-sm font-semibold text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Detalhes</span>
            </button>

            {quantityInCart > 0 ? (
              <div
                className="flex-[1.25] inline-flex items-center justify-between min-h-[44px] px-1.5 rounded-xl bg-[var(--accent)] text-white"
                aria-label={`Quantidade de ${dish.nomeClaro} no pedido`}
              >
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(dish.id, -1)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/15 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={`Remover uma unidade de ${dish.nomeClaro}`}
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="text-sm font-bold tabular-nums px-2 whitespace-nowrap">
                  {quantityInCart} no pedido
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(dish.id, 1)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/15 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={`Adicionar mais uma unidade de ${dish.nomeClaro}`}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onAdd(dish)}
                className="flex-[1.25] inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
              >
                <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Pedir</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
