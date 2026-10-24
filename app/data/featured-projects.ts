export type ProjectCategory = 'all' | 'desktop' | 'ai' | 'cloud' | 'saas';

export interface FeaturedProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'desktop' | 'ai' | 'cloud' | 'saas';
  categoryLabel: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  npmUrl?: string;
  liveUrl?: string;
  highlights: string[];
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'bereia-verse',
    title: 'Bereia Versículos',
    tagline: 'Leitor flutuante moderno de versículos bíblicos',
    description: 'Leitor bíblico nativo em Kotlin Multiplatform. Detecta referências na área de transferência e abre versículos instantaneamente em janelas flutuantes com SQLite embutido e suporte a Hyprland, Windows e Android.',
    category: 'desktop',
    categoryLabel: 'Desktop & Linux',
    image: '/images/projects/bereia-verse.webp',
    tags: ['Kotlin', 'Compose Desktop', 'Android', 'SQLite', 'Hyprland'],
    githubUrl: 'https://github.com/HelenoSalgado/bereia-verse',
    highlights: ['Detecção de Clipboard', 'Widget Hyprland', 'Offline First']
  },
  {
    id: 'saloppdf',
    title: 'Salop PDF & RAG Engine',
    tagline: 'Conversor acadêmico e base vetorial para IA local',
    description: 'Pipeline de extração de PDFs acadêmicos complexos via MinerU e vetorização FAISS para RAG local, preservando notas de rodapé e terminologia clássica conectada ao Ollama.',
    category: 'ai',
    categoryLabel: 'IA & Pipelines',
    image: '/images/projects/saloppdf.svg',
    tags: ['Python', 'UV', 'MinerU', 'FAISS', 'Ollama', 'EPUB3'],
    githubUrl: 'https://github.com/HelenoSalgado/saloppdf',
    highlights: ['RAG Local', 'Indexação FAISS', 'Extração de Notas']
  },
  {
    id: 'routerworkers',
    title: 'RouterWorkers',
    tagline: 'Roteador minimalista para Cloudflare Workers',
    description: 'Roteador ultrarrápido para Cloudflare Workers publicado no NPM. Desenvolvido em TypeScript 5.9 com zero dependências externas, grupos de rotas e suporte nativo a CORS.',
    category: 'cloud',
    categoryLabel: 'Cloud & Edge',
    image: '/images/projects/routerworkers.svg',
    tags: ['TypeScript 5.9', 'Cloudflare Workers', 'NPM Package', 'Edge'],
    githubUrl: 'https://github.com/HelenoSalgado/routerworkers',
    npmUrl: 'https://www.npmjs.com/package/routerworkers',
    highlights: ['Pacote NPM Oficial', 'Zero Dependências', 'Ultra Baixa Latência']
  },
  {
    id: 'salopbar',
    title: 'Salop Bar',
    tagline: 'Barra de status nativa para Hyprland e Arch Linux',
    description: 'Barra de status modular para Hyprland desenvolvida com TypeScript e AGS (GTK). Oferece widgets reativos para workspaces, áudio, rede e telemetria em tempo real.',
    category: 'desktop',
    categoryLabel: 'Desktop & Linux',
    image: '/images/projects/salop-bar.webp',
    tags: ['TypeScript', 'AGS', 'GTK', 'Meson', 'Hyprland'],
    githubUrl: 'https://github.com/HelenoSalgado/salopbar',
    highlights: ['Wayland Nativo', 'Widgets Reativos', 'GObject']
  },
  {
    id: 'guicont',
    title: 'Guia Cont (Emissor XML)',
    tagline: 'SaaS fiscal e download em lote de NF-e',
    description: 'SaaS contábil para consulta, validação e download em lote de NF-e/XMLs, com autenticação JWT multi-tenant e faturamento automatizado via gateway Asaas.',
    category: 'saas',
    categoryLabel: 'SaaS Comercial',
    image: '/images/projects/guicont.svg',
    tags: ['PHP / Laravel', 'API REST', 'JWT', 'Asaas Gateway'],
    githubUrl: 'https://github.com/HelenoSalgado/guicont-emissor-xml',
    highlights: ['Download em Lote', 'Multi-CNPJ', 'Integração Asaas']
  },
  {
    id: 'openscimd',
    title: 'OpenSciMD',
    tagline: 'Publicação científica com busca textual FTS5',
    description: 'Repositório acadêmico de artigos abertos em Markdown, equipado com busca textual veloz em SQLite FTS5 (BM25) e pipeline de geração automatizada de capas.',
    category: 'ai',
    categoryLabel: 'Publicações & Dados',
    image: '/images/projects/openscimd.webp',
    tags: ['Markdown', 'SQLite FTS5 / BM25', 'Nuxt 4'],
    githubUrl: 'https://github.com/HelenoSalgado/openscimd',
    highlights: ['Busca FTS5 / BM25', 'Open Access', 'Geração de Capas']
  }
];

export const CATEGORIES: { key: ProjectCategory; label: string }[] = [
  { key: 'all', label: 'Todos os Projetos' },
  { key: 'desktop', label: 'Desktop & Linux' },
  { key: 'ai', label: 'IA & Pipelines' },
  { key: 'cloud', label: 'Cloud & Edge' },
  { key: 'saas', label: 'SaaS & Web' }
];
