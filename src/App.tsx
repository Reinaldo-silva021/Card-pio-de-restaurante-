import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, Search, ShoppingBag, UtensilsCrossed, X } from 'lucide-react';
import { DishCard } from './components/DishCard';
import { DishDetailModal } from './components/DishDetailModal';
import { OrderSummaryDrawer } from './components/OrderSummaryDrawer';
import {
  CATEGORIES,
  CartItem,
  CategoryKey,
  DISHES,
  Dish,
  FILTER_OPTIONS,
  FilterTagKey,
  INITIAL_CART_ITEMS,
  SubmittedOrder,
} from './data/menuData';
import { formatBRL } from './utils/format';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<CategoryKey>('entradas');
  const [currentFilter, setCurrentFilter] = useState<FilterTagKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [seniorMode, setSeniorMode] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [submittedOrders, setSubmittedOrders] = useState<SubmittedOrder[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (seniorMode) {
      root.classList.add('senior-mode');
    } else {
      root.classList.remove('senior-mode');
    }
    return () => {
      root.classList.remove('senior-mode');
    };
  }, [seniorMode]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const cartSummary = useMemo(() => {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const total = cartItems.reduce((acc, item) => acc + item.dish.preco * item.quantity, 0);
    return { count, total };
  }, [cartItems]);

  const quantityByDishId = useMemo(() => {
    const map = new Map<number, number>();
    for (const item of cartItems) {
      map.set(item.dish.id, item.quantity);
    }
    return map;
  }, [cartItems]);

  const categoryLabelMap = useMemo(() => {
    const map = new Map<CategoryKey, string>();
    for (const cat of CATEGORIES) {
      map.set(cat.key, cat.navLabel);
    }
    return map;
  }, []);

  const activeCategoryMeta = useMemo(
    () => CATEGORIES.find((c) => c.key === currentCategory) ?? CATEGORIES[0],
    [currentCategory]
  );

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const filteredDishes = useMemo(() => {
    let list = isSearching
      ? DISHES
      : DISHES.filter((dish) => dish.category === currentCategory);

    if (currentFilter !== 'all') {
      list = list.filter((dish) => dish.tags.includes(currentFilter));
    }

    if (isSearching) {
      list = list.filter(
        (dish) =>
          dish.nomeClaro.toLowerCase().includes(trimmedQuery) ||
          dish.nomeOriginal.toLowerCase().includes(trimmedQuery) ||
          dish.desc.toLowerCase().includes(trimmedQuery) ||
          dish.ingredientes.toLowerCase().includes(trimmedQuery)
      );
    }

    return list;
  }, [currentCategory, currentFilter, isSearching, trimmedQuery]);

  const handleAddToCart = (dish: Dish, quantity = 1, note?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.dish.id === dish.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + quantity,
          note: note ?? existing.note,
        };
        return updated;
      }
      return [...prev, { dish, quantity, note }];
    });
    showToast(`${quantity}x ${dish.nomeClaro} adicionado ao pedido.`);
  };

  const handleUpdateQuantity = (dishId: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.dish.id === dishId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (dishId: number) => {
    setCartItems((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSubmitOrder = (
    kitchenNote: string,
    includeServiceFee: boolean
  ): SubmittedOrder => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.dish.preco * item.quantity,
      0
    );
    const serviceFee = includeServiceFee ? subtotal * 0.1 : 0;
    const total = subtotal + serviceFee;
    const orderNumber = `04${String(submittedOrders.length + 1).padStart(2, '0')}`;

    const newOrder: SubmittedOrder = {
      orderNumber,
      submittedAt: new Date(),
      items: [...cartItems],
      kitchenNote,
      includeServiceFee,
      subtotal,
      serviceFee,
      total,
    };

    setSubmittedOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    return newOrder;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCurrentFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)] text-[var(--ink-primary)]">
      {/* Top Bar de 3 Zonas */}
      <header className="sticky top-0 z-30 bg-[var(--surface)]/95 backdrop-blur-sm border-b border-[var(--hairline)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zona 1: Marca (elemento único, sem subtítulos ou badges acoplados) */}
          <button
            type="button"
            onClick={() => {
              setCurrentCategory('entradas');
              setSearchQuery('');
            }}
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--accent)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-md"
          >
            Sabor &amp; Tradição
          </button>

          {/* Zona 2: Links de navegação de categorias em linha única */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label="Categorias do cardápio"
          >
            {CATEGORIES.map((category) => {
              const isActive = !isSearching && currentCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => {
                    setCurrentCategory(category.key);
                    if (isSearching) setSearchQuery('');
                  }}
                  className={`py-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-t ${
                    isActive
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:border-stone-300'
                  }`}
                >
                  {category.navLabel}
                </button>
              );
            })}
          </nav>

          {/* Zona 3: Ação principal única — Abrir Resumo do Pedido */}
          <button
            type="button"
            onClick={() => setIsOrderDrawerOpen(true)}
            className="inline-flex items-center gap-2.5 min-h-[44px] px-4 sm:px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-bold hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            aria-label={`Abrir resumo do pedido da Mesa 04 com ${cartSummary.count} itens, total ${formatBRL(cartSummary.total)}`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Seu Pedido</span>
            <span aria-hidden="true" className="opacity-60">
              ·
            </span>
            <span className="tabular-nums">
              {cartSummary.count} ({formatBRL(cartSummary.total)})
            </span>
          </button>
        </div>

        {/* Navegação de categorias para tablet/mobile */}
        <nav
          className="lg:hidden border-t border-[var(--hairline)] overflow-x-auto"
          aria-label="Categorias do cardápio em dispositivos menores"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-5">
            {CATEGORIES.map((category) => {
              const isActive = !isSearching && currentCategory === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => {
                    setCurrentCategory(category.key);
                    if (isSearching) setSearchQuery('');
                  }}
                  className={`py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-[var(--accent)] text-[var(--accent)]'
                      : 'border-transparent text-[var(--ink-secondary)]'
                  }`}
                >
                  {category.navLabel}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Área Principal do Cardápio */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Cabeçalho da Seção + Ferramentas de Busca e Acessibilidade */}
        <section className="space-y-6 pb-6 border-b border-[var(--hairline)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[var(--ink-muted)]">
                Cardápio Digital · Mesa 04
                {submittedOrders.length > 0 && (
                  <>
                    {' '}
                    ·{' '}
                    <button
                      type="button"
                      onClick={() => setIsOrderDrawerOpen(true)}
                      className="text-[var(--accent)] underline underline-offset-2 cursor-pointer"
                    >
                      {submittedOrders.length}{' '}
                      {submittedOrders.length === 1
                        ? 'pedido enviado à cozinha'
                        : 'pedidos enviados à cozinha'}
                    </button>
                  </>
                )}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink-primary)] text-balance">
                {isSearching
                  ? `Resultados para "${searchQuery.trim()}"`
                  : activeCategoryMeta.title}
              </h1>
              <p className="text-sm sm:text-base text-[var(--ink-secondary)] max-w-2xl">
                {isSearching
                  ? `${filteredDishes.length} ${
                      filteredDishes.length === 1 ? 'prato encontrado' : 'pratos encontrados'
                    } em todo o cardápio.`
                  : activeCategoryMeta.subtitle}
              </p>
            </div>

            {/* Controle de Acessibilidade (Persona Maria das Graças) */}
            <button
              type="button"
              onClick={() => setSeniorMode((prev) => !prev)}
              aria-pressed={seniorMode}
              className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                seniorMode
                  ? 'bg-[var(--ink-primary)] text-white border-[var(--ink-primary)]'
                  : 'bg-[var(--surface)] text-[var(--ink-primary)] border-[var(--hairline)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {seniorMode
                  ? 'Texto Ampliado: Ativado'
                  : 'Modo Texto Ampliado'}
              </span>
            </button>
          </div>

          {/* Barra de Busca + Filtros de Dieta e Porção */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative w-full lg:max-w-sm">
              <Search
                className="w-4 h-4 text-[var(--ink-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar prato ou ingrediente..."
                aria-label="Buscar prato ou ingrediente"
                className="w-full min-h-[44px] pl-10 pr-10 py-2 rounded-xl border border-[var(--hairline)] bg-[var(--surface)] text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-lg text-[var(--ink-muted)] hover:text-[var(--ink-primary)] cursor-pointer"
                  aria-label="Limpar busca"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Filtros Interativos Segmentados */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--hairline)]"
              role="group"
              aria-label="Filtros de restrição alimentar e tamanho da porção"
            >
              {FILTER_OPTIONS.map((option) => {
                const isActive = currentFilter === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setCurrentFilter(option.key)}
                    aria-pressed={isActive}
                    className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                      isActive
                        ? 'bg-[var(--surface)] text-[var(--ink-primary)] shadow-xs'
                        : 'text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Grade de Pratos */}
        {filteredDishes.length === 0 ? (
          <section className="py-16 flex flex-col items-center text-center space-y-4">
            <UtensilsCrossed
              className="w-10 h-10 text-stone-300"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-semibold text-[var(--ink-primary)]">
                Nenhum prato encontrado
              </h2>
              <p className="text-sm text-[var(--ink-muted)] max-w-md">
                Não encontramos pratos que correspondam aos filtros selecionados nesta categoria.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
            >
              Limpar filtros
            </button>
          </section>
        ) : (
          <section
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
            aria-label="Lista de pratos disponíveis"
          >
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                categoryLabel={
                  isSearching ? categoryLabelMap.get(dish.category) : undefined
                }
                quantityInCart={quantityByDishId.get(dish.id) ?? 0}
                onOpenDetail={setSelectedDish}
                onAdd={(item) => handleAddToCart(item, 1)}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </section>
        )}
      </main>

      {/* Rodapé Limpo */}
      <footer className="border-t border-[var(--hairline)] bg-[var(--surface)] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)]">
          <p>
            Restaurante Sabor &amp; Tradição · Mesa 04 · Ingredientes e alergênicos informados em cada prato.
          </p>
          <button
            type="button"
            onClick={() => setIsOrderDrawerOpen(true)}
            className="font-semibold text-[var(--accent)] hover:underline whitespace-nowrap cursor-pointer"
          >
            Ver resumo do pedido ({cartSummary.count} · {formatBRL(cartSummary.total)})
          </button>
        </div>
      </footer>

      {/* Notificação rápida ao adicionar prato */}
      {toastMessage && !isOrderDrawerOpen && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 max-w-sm bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-4 text-sm"
        >
          <span className="leading-snug">{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsOrderDrawerOpen(true);
            }}
            className="shrink-0 font-bold text-amber-300 hover:text-amber-200 underline underline-offset-2 whitespace-nowrap cursor-pointer"
          >
            Ver resumo
          </button>
        </div>
      )}

      {/* Modal de Detalhes do Prato */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Painel Lateral de Resumo do Pedido da Mesa 04 */}
      <OrderSummaryDrawer
        isOpen={isOrderDrawerOpen}
        items={cartItems}
        submittedOrders={submittedOrders}
        onClose={() => setIsOrderDrawerOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onSubmitOrder={handleSubmitOrder}
      />
    </div>
  );
}
