import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Minus, Plus, Users, X } from 'lucide-react';
import { Dish } from '../data/menuData';
import { formatBRL } from '../utils/format';
import { DishImage } from './DishImage';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (dish: Dish, quantity: number, note?: string) => void;
}

export function DishDetailModal({ dish, onClose, onAddToCart }: DishDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (dish) {
      setQuantity(1);
      setNote('');
    }
  }, [dish]);

  useEffect(() => {
    if (!dish) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dish, onClose]);

  if (!dish) return null;

  const handleConfirm = () => {
    onAddToCart(dish, quantity, note.trim() || undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--surface)] border border-[var(--hairline)] shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--surface)]/95 border border-[var(--hairline)] text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label="Fechar detalhes do prato"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Coluna da foto */}
        <div className="lg:col-span-6 aspect-[4/3] lg:aspect-auto bg-stone-100 overflow-hidden">
          <DishImage
            src={dish.imagem}
            alt={dish.nomeClaro}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Coluna contígua de informações e pedido */}
        <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
              <Users className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Rendimento: {dish.porcao}</span>
            </div>

            <div className="pr-10">
              <h2
                id="dish-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold leading-tight text-[var(--ink-primary)] text-balance"
              >
                {dish.nomeClaro}
              </h2>
              <p className="mt-1 text-sm italic text-[var(--ink-muted)]">
                Anteriormente: &ldquo;{dish.nomeOriginal}&rdquo;
              </p>
            </div>

            <div className="text-2xl font-extrabold text-[var(--accent)] tabular-nums">
              {formatBRL(dish.preco)}
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[var(--ink-secondary)]">
              {dish.desc}
            </p>

            {/* Ingredientes detalhados separados por linha fina */}
            <div className="pt-4 border-t border-[var(--hairline)] space-y-1.5">
              <h3 className="text-sm font-bold text-[var(--ink-primary)]">
                Ingredientes detalhados
              </h3>
              <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
                {dish.ingredientes}
              </p>
            </div>

            {/* Alergênicos e dieta */}
            <div className="pt-4 border-t border-[var(--hairline)] space-y-2">
              <h3 className="text-sm font-bold text-[var(--ink-primary)]">
                Alergênicos e restrições
              </h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                {dish.alergens.map((allergen) => (
                  <li
                    key={allergen.text}
                    className={`inline-flex items-center gap-1.5 ${
                      allergen.type === 'warning'
                        ? 'text-red-700'
                        : 'text-emerald-800'
                    }`}
                  >
                    {allergen.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>{allergen.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Observação opcional do prato */}
            <div className="pt-4 border-t border-[var(--hairline)] space-y-1.5">
              <label
                htmlFor="dish-note"
                className="block text-sm font-semibold text-[var(--ink-primary)]"
              >
                Observações para a cozinha (opcional)
              </label>
              <input
                id="dish-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex.: ponto da carne, molho à parte, sem coentro..."
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[var(--hairline)] bg-[var(--canvas)] text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>
          </div>

          {/* Controles de quantidade e adição */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-[var(--hairline)]">
            <div className="inline-flex items-center justify-between min-h-[48px] px-2 rounded-xl border border-[var(--hairline)] bg-[var(--surface-subtle)]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[var(--ink-primary)] hover:bg-[var(--surface)] disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="w-10 text-center text-base font-bold tabular-nums text-[var(--ink-primary)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[var(--ink-primary)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-xl bg-[var(--accent)] text-white text-sm sm:text-base font-bold hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            >
              <span>Adicionar ao Pedido</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{formatBRL(dish.preco * quantity)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
