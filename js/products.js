/* productos — catálogo SENSIS GOOD FF */

const PRODUCTS = [
  {
    id: 1,
    name: 'Sistema de Sensis',
    sub: 'Generador de Sensibilidades',
    desc: 'Sistema completo para generar tus sensibilidades 100% personalizadas según tu dispositivo.',
    price: 149,
    tier: 'gold',
    tierLabel: 'Premium',
    emoji: '⚙️',
    imgHint: 'sistema-sensis',
    comingSoon: false
  },
  {
    id: 2,
    name: 'Modificación Sencilla',
    sub: '',
    desc: 'Ajustes básicos para mejorar tu puntería desde el primer día sin complicaciones.',
    price: 59,
    tier: 'blue',
    tierLabel: 'Básico',
    emoji: '⚙️',
    imgHint: 'mod-sencilla',
    comingSoon: false
  },
  {
    id: 3,
    name: 'Modificación Media',
    sub: '',
    desc: 'Configuración intermedia con mayor precisión, menor tiempo de reacción y control total.',
    price: 89,
    tier: 'silver',
    tierLabel: 'Medio',
    emoji: '⚙️',
    imgHint: 'mod-media',
    comingSoon: false
  },
  {
    id: 4,
    name: 'Modificación Extrema',
    sub: '',
    desc: 'Sensibilidades avanzadas para jugadores de alto nivel. Máxima precisión garantizada.',
    price: 129,
    tier: 'red',
    tierLabel: 'Extremo',
    emoji: '⚙️',
    imgHint: 'mod-extrema',
    comingSoon: false
  },
  {
    id: 5,
    name: 'Auxilio de Mira 2.0',
    sub: '',
    desc: 'Asistencia de mira mejorada con algoritmo propio para precisión extrema en combate.',
    price: 99,
    tier: 'red',
    tierLabel: 'Especial',
    emoji: '🎯',
    imgHint: 'auxilio-mira',
    comingSoon: false
  },
  {
    id: 6,
    name: 'Turbo X Booster',
    sub: 'Optimizador de Rendimiento',
    desc: 'Reduce el lag y mejora los FPS. Optimización profunda de tu dispositivo para Free Fire.',
    price: 79,
    tier: 'gold',
    tierLabel: 'Boost',
    emoji: '⚡',
    imgHint: 'turbo-booster',
    comingSoon: false
  },
  {
    id: 7,
    name: 'Generador de Códigos',
    sub: 'Para Brevent',
    desc: 'Genera códigos únicos para Brevent y optimiza la gestión de procesos de tu juego.',
    price: 69,
    tier: 'silver',
    tierLabel: 'Próximamente',
    emoji: '💻',
    imgHint: 'codigos-brevent',
    comingSoon: true   // ← sin botón de compra
  }
];

/* Rutas de imagen que se intentan en orden */
function getImagePaths(product) {
  return [
    `img/${product.imgHint}.jpg`,
    `img/${product.id}.jpg`,
    `img/producto-${product.id}.jpg`,
    `${product.imgHint}.jpg`,
    `producto-${product.id}.jpg`
  ];
}
