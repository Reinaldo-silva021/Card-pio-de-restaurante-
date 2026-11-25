export type CategoryKey = 'entradas' | 'carnes' | 'peixes' | 'massas' | 'sobremesas';

export type FilterTagKey = 'all' | 'sem-gluten' | 'sem-lactose' | 'individual' | 'familia';

export interface AllergenInfo {
  text: string;
  type: 'warning' | 'safe';
}

export interface Dish {
  id: number;
  category: CategoryKey;
  nomeOriginal: string;
  nomeClaro: string;
  preco: number;
  porcao: string;
  imagem: string;
  desc: string;
  ingredientes: string;
  alergens: AllergenInfo[];
  tags: Exclude<FilterTagKey, 'all'>[];
}

export interface CategoryMeta {
  key: CategoryKey;
  navLabel: string;
  title: string;
  subtitle: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: 'entradas',
    navLabel: 'Entradas',
    title: 'Entradas e Petiscos',
    subtitle: 'Porções preparadas na hora para compartilhar e abrir o apetite.',
  },
  {
    key: 'carnes',
    navLabel: 'Carnes Nobres',
    title: 'Carnes Nobres & Assados',
    subtitle: 'Cortes selecionados grelhados no ponto e assados lentos no forno a lenha.',
  },
  {
    key: 'peixes',
    navLabel: 'Peixes & Frutos',
    title: 'Peixes & Frutos do Mar',
    subtitle: 'Receitas tradicionais da costa preparadas com pescados frescos.',
  },
  {
    key: 'massas',
    navLabel: 'Massas & Fit',
    title: 'Massas Artesanais & Fit',
    subtitle: 'Massas frescas feitas na casa e pratos leves equilibrados.',
  },
  {
    key: 'sobremesas',
    navLabel: 'Sobremesas',
    title: 'Sobremesas & Drinks',
    subtitle: 'Clássicos artesanais preparados diariamente na nossa confeitaria.',
  },
];

export const FILTER_OPTIONS: { key: FilterTagKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'sem-gluten', label: 'Sem Glúten' },
  { key: 'sem-lactose', label: 'Sem Lactose' },
  { key: 'individual', label: 'Individual' },
  { key: 'familia', label: 'Para 2 ou mais' },
];

export const DISHES: Dish[] = [
  {
    id: 1,
    category: 'entradas',
    nomeOriginal: 'Delícia Colonial',
    nomeClaro: 'Tábua de Salames & Torradas Artesanais',
    preco: 48.0,
    porcao: 'Serve 2 pessoas (350g)',
    imagem: '/src/assets/images/dish_tabua_salames_1795639053187.jpg',
    desc: 'Seleção especial de embutidos suínos coloniais fatiados finos, acompanhados de torradas artesanais grelhadas no azeite de ervas finas.',
    ingredientes:
      'Salame italiano, copa defumada, queijo colonial, torradinhas de pão de fermentação natural, azeite extra virgem, alecrim e orégano.',
    alergens: [
      { text: 'Contém Glúten', type: 'warning' },
      { text: 'Contém Lactose', type: 'warning' },
    ],
    tags: ['familia'],
  },
  {
    id: 2,
    category: 'entradas',
    nomeOriginal: 'Surpresa do Mar do Sul',
    nomeClaro: 'Iscas de Peixe Crocantes com Tártaro',
    preco: 62.0,
    porcao: 'Serve 2 pessoas (400g)',
    imagem: '/src/assets/images/dish_iscas_peixe_1795639054564.jpg',
    desc: 'Tiras suculentas de filé de pescada branca empanadas na farinha panko crocante. Acompanha molho tártaro especial da casa.',
    ingredientes:
      'Pescada branca fresca, farinha panko, limão siciliano, molho tártaro (maionese caseira, alcaparras e picles).',
    alergens: [
      { text: 'Contém Peixe', type: 'warning' },
      { text: 'Contém Ovos', type: 'warning' },
      { text: 'Sem Lactose', type: 'safe' },
    ],
    tags: ['sem-lactose', 'familia'],
  },
  {
    id: 3,
    category: 'entradas',
    nomeOriginal: 'Ninho de Ouro Tradicional',
    nomeClaro: 'Bolinhos de Carne Seca com Mandioca',
    preco: 38.0,
    porcao: 'Serve 2 pessoas (6 unidades)',
    imagem: '/src/assets/images/dish_bolinhos_carne_seca_1795639055316.jpg',
    desc: 'Bolinhos artesanais moldados com massa cremosa de mandioca cozida, recheados com carne seca desfiada e temperos da fazenda.',
    ingredientes:
      'Mandioca, carne seca desfiada, queijo coalho, tempero verde, alho e pimenta de cheiro (não ardida).',
    alergens: [
      { text: 'Sem Glúten', type: 'safe' },
      { text: 'Contém Lactose', type: 'warning' },
    ],
    tags: ['sem-gluten', 'familia'],
  },
  {
    id: 4,
    category: 'entradas',
    nomeOriginal: 'Mistério de Queijos e Ervas',
    nomeClaro: 'Tábua de Queijos Finos com Geleia',
    preco: 44.0,
    porcao: 'Serve 2 pessoas (300g)',
    imagem: '/src/assets/images/dish_tabua_queijos_1795639056525.jpg',
    desc: 'Variedade de queijos nobres (Brie, Gorgonzola e Gouda) acompanhados de geleia artesanal de pimenta/frutas e pães frescos.',
    ingredientes:
      'Queijo Brie, Gorgonzola, Gouda, geleia de morango com pimenta suave, pão baguete fatiado.',
    alergens: [
      { text: 'Contém Lactose', type: 'warning' },
      { text: 'Contém Glúten', type: 'warning' },
    ],
    tags: ['familia'],
  },
  {
    id: 5,
    category: 'carnes',
    nomeOriginal: 'Filé à Moda do Fundador',
    nomeClaro: 'Filé Mignon ao Molho Madeira e Arroz',
    preco: 115.0,
    porcao: 'Serve 2 pessoas fartamente (700g)',
    imagem: '/src/assets/images/dish_file_madeira_1795639057026.jpg',
    desc: 'Medalhões de filé mignon grelhados no ponto desejado, cobertos com molho madeira artesanal e cogumelos frescos. Acompanha arroz biro-biro e batatas rústicas.',
    ingredientes:
      'Filé Mignon bovino, molho de vinho madeira, cogumelos paris, arroz, ovos, batata cozida e frita.',
    alergens: [
      { text: 'Sem Lactose', type: 'safe' },
      { text: 'Contém Glúten', type: 'warning' },
    ],
    tags: ['sem-lactose', 'familia'],
  },
  {
    id: 6,
    category: 'carnes',
    nomeOriginal: 'Bife Imperial do Barão',
    nomeClaro: 'Contrafilé Grelhado com Legumes e Arroz',
    preco: 98.0,
    porcao: 'Serve 1 a 2 pessoas (500g)',
    imagem: '/src/assets/images/dish_contrafile_legumes_1795639058096.jpg',
    desc: 'Corte alto de contrafilé macio salteado na manteiga de ervas, servido com brócolis, cenoura ao vapor e arroz soltinho.',
    ingredientes:
      'Contrafilé nobre, manteiga, brócolis, cenoura, abobrinha, arroz branco.',
    alergens: [
      { text: 'Sem Glúten', type: 'safe' },
      { text: 'Contém Lactose', type: 'warning' },
    ],
    tags: ['sem-gluten', 'individual'],
  },
  {
    id: 7,
    category: 'carnes',
    nomeOriginal: 'Segredo da Fazenda Sabor & Tradição',
    nomeClaro: 'Costela Bovina Assada na Lenha com Farofa',
    preco: 128.0,
    porcao: 'Serve 3 pessoas (900g)',
    imagem: '/src/assets/images/dish_costela_lenha_1795639060569.jpg',
    desc: 'Costela janela assada lentamente por 12 horas no forno a lenha. Acompanha farofa rica de bacon, mandioca frita e mandioca cozida.',
    ingredientes:
      'Costela bovina, mandioca, farinha de mandioca, bacon, cheiro verde e sal grosso.',
    alergens: [
      { text: 'Sem Lactose', type: 'safe' },
      { text: 'Sem Glúten', type: 'safe' },
    ],
    tags: ['sem-gluten', 'sem-lactose', 'familia'],
  },
  {
    id: 8,
    category: 'peixes',
    nomeOriginal: 'Moqueca Encanto das Águas',
    nomeClaro: 'Moqueca Baiana de Garoupa e Camarão',
    preco: 145.0,
    porcao: 'Serve 2 a 3 pessoas (800g)',
    imagem: '/src/assets/images/dish_moqueca_baiana_1795639061269.jpg',
    desc: 'Postas de peixe garoupa e camarões rosas cozidos em panela de barro com leite de coco, pimentões e azeite de dendê. Acompanha pirão e arroz.',
    ingredientes:
      'Peixe Garoupa, Camarão Rosa, leite de coco, azeite de dendê, pimentão vermelho e amarelo, coentro, farinha de mandioca.',
    alergens: [
      { text: 'Contém Frutos do Mar', type: 'warning' },
      { text: 'Sem Lactose', type: 'safe' },
      { text: 'Sem Glúten', type: 'safe' },
    ],
    tags: ['sem-gluten', 'sem-lactose', 'familia'],
  },
  {
    id: 9,
    category: 'peixes',
    nomeOriginal: 'Bacalhau Dourado dos Navegantes',
    nomeClaro: 'Bacalhau Lagareiro com Batatas ao Murro',
    preco: 160.0,
    porcao: 'Serve 2 pessoas (650g)',
    imagem: '/src/assets/images/dish_bacalhau_lagareiro_1795639061135.jpg',
    desc: 'Posta nobre de Bacalhau Gadus Morhua dessalgada e assada no azeite extra virgem com bastante alho, cebolas roxas, batatas ao murro e azeitonas pretas.',
    ingredientes:
      'Bacalhau nobre, azeite de oliva extra virgem, batata inglesa, alho, cebola roxa, azeitonas portuguesas.',
    alergens: [
      { text: 'Sem Lactose', type: 'safe' },
      { text: 'Sem Glúten', type: 'safe' },
    ],
    tags: ['sem-gluten', 'sem-lactose', 'familia'],
  },
  {
    id: 10,
    category: 'massas',
    nomeOriginal: 'Massa do Artista ao Molho Secreto',
    nomeClaro: 'Fettuccine Italiano com Molho de Tomate Fresco',
    preco: 68.0,
    porcao: 'Individual Generoso (400g)',
    imagem: '/src/assets/images/dish_fettuccine_italiano_1795639062614.jpg',
    desc: 'Massa artesanal tipo fettuccine feita na casa, servida com molho rústico de tomates italianos maduros, manjericão fresco e queijo parmesão ralado.',
    ingredientes:
      'Farinha de trigo, ovos frescos, tomate italiano, alho, azeite, manjericão e queijo parmesão.',
    alergens: [
      { text: 'Contém Glúten', type: 'warning' },
      { text: 'Contém Lactose', type: 'warning' },
    ],
    tags: ['individual'],
  },
  {
    id: 11,
    category: 'massas',
    nomeOriginal: 'Jardim do Éden Verde',
    nomeClaro: 'Bowl Fit Vegetariano com Cogumelos e Quinoa',
    preco: 58.0,
    porcao: 'Individual (350g)',
    imagem: '/src/assets/images/dish_bowl_fit_quinoa_1795639063722.jpg',
    desc: 'Mix nutritivo de quinoa real, cogumelos Shimeji e Paris salteados no azeite, brócolis, legumes grelhados e sementes de girassol.',
    ingredientes:
      'Quinoa, cogumelos shimeji/paris, abobrinha, cenoura, tomate cereja, azeite e ervas.',
    alergens: [
      { text: 'Vegano', type: 'safe' },
      { text: 'Sem Glúten', type: 'safe' },
      { text: 'Sem Lactose', type: 'safe' },
    ],
    tags: ['sem-gluten', 'sem-lactose', 'individual'],
  },
  {
    id: 12,
    category: 'sobremesas',
    nomeOriginal: 'Doce Tentação da Vovó',
    nomeClaro: 'Pudim de Leite Condensado Tradicional',
    preco: 28.0,
    porcao: 'Fatia Individual (180g)',
    imagem: '/src/assets/images/dish_pudim_leite_1795639063639.jpg',
    desc: 'Pudim de leite condensado super cremoso, sem furinhos, servido com calda de caramelo artesanal e toque de baunilha.',
    ingredientes: 'Leite condensado, leite integral, ovos e açúcar caramelizado.',
    alergens: [
      { text: 'Contém Lactose', type: 'warning' },
      { text: 'Sem Glúten', type: 'safe' },
    ],
    tags: ['sem-gluten', 'individual'],
  },
];

export interface CartItem {
  dish: Dish;
  quantity: number;
  note?: string;
}

export interface SubmittedOrder {
  orderNumber: string;
  submittedAt: Date;
  items: CartItem[];
  kitchenNote: string;
  includeServiceFee: boolean;
  subtotal: number;
  serviceFee: number;
  total: number;
}

// Pedido inicial da Mesa 04 (2 itens somando R$ 186,00, coerente com o protótipo original)
export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    dish: DISHES.find((d) => d.id === 7)!,
    quantity: 1,
  },
  {
    dish: DISHES.find((d) => d.id === 11)!,
    quantity: 1,
  },
];
