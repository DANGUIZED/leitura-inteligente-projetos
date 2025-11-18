// Base de Dados de Símbolos Técnicos (ABNT)

import { Symbol } from './types';

export const ELECTRICAL_SYMBOLS: Symbol[] = [
  {
    id: 'elec_001',
    name: 'Tomada Simples',
    code: '⏚',
    category: 'eletrico',
    description: 'Tomada de uso geral 2P+T 127V/220V',
    customizable: true
  },
  {
    id: 'elec_002',
    name: 'Tomada Dupla',
    code: '⏚⏚',
    category: 'eletrico',
    description: 'Tomada dupla 2P+T',
    customizable: true
  },
  {
    id: 'elec_003',
    name: 'Tomada Específica',
    code: '⏚E',
    category: 'eletrico',
    description: 'Tomada para uso específico (geladeira, micro-ondas, etc)',
    customizable: true
  },
  {
    id: 'elec_004',
    name: 'Interruptor Simples',
    code: 'S',
    category: 'eletrico',
    description: 'Interruptor simples de uma seção',
    customizable: true
  },
  {
    id: 'elec_005',
    name: 'Interruptor Paralelo',
    code: 'S3',
    category: 'eletrico',
    description: 'Interruptor three-way (paralelo)',
    customizable: true
  },
  {
    id: 'elec_006',
    name: 'Interruptor Intermediário',
    code: 'S4',
    category: 'eletrico',
    description: 'Interruptor four-way (intermediário)',
    customizable: true
  },
  {
    id: 'elec_007',
    name: 'Ponto de Luz no Teto',
    code: '⊕',
    category: 'eletrico',
    description: 'Ponto de luz incandescente no teto',
    customizable: true
  },
  {
    id: 'elec_008',
    name: 'Luminária Fluorescente',
    code: '⊞',
    category: 'eletrico',
    description: 'Luminária fluorescente',
    customizable: true
  },
  {
    id: 'elec_009',
    name: 'Quadro de Distribuição',
    code: 'QD',
    category: 'eletrico',
    description: 'Quadro de distribuição de circuitos',
    customizable: true
  },
  {
    id: 'elec_010',
    name: 'Ponto de Ar Condicionado',
    code: 'AC',
    category: 'eletrico',
    description: 'Ponto elétrico para ar condicionado',
    customizable: true
  }
];

export const HYDRAULIC_SYMBOLS: Symbol[] = [
  {
    id: 'hydr_001',
    name: 'Ponto de Água Fria',
    code: 'AF',
    category: 'hidraulico',
    description: 'Ponto de alimentação de água fria',
    customizable: true
  },
  {
    id: 'hydr_002',
    name: 'Ponto de Água Quente',
    code: 'AQ',
    category: 'hidraulico',
    description: 'Ponto de alimentação de água quente',
    customizable: true
  },
  {
    id: 'hydr_003',
    name: 'Esgoto',
    code: 'ES',
    category: 'hidraulico',
    description: 'Ponto de esgoto sanitário',
    customizable: true
  },
  {
    id: 'hydr_004',
    name: 'Ventilação',
    code: 'V',
    category: 'hidraulico',
    description: 'Tubo de ventilação',
    customizable: true
  },
  {
    id: 'hydr_005',
    name: 'Ralo Seco',
    code: 'RS',
    category: 'hidraulico',
    description: 'Ralo seco',
    customizable: true
  },
  {
    id: 'hydr_006',
    name: 'Ralo Sifonado',
    code: 'RSi',
    category: 'hidraulico',
    description: 'Ralo sifonado',
    customizable: true
  },
  {
    id: 'hydr_007',
    name: 'Chuveiro',
    code: 'CH',
    category: 'hidraulico',
    description: 'Ponto de chuveiro',
    customizable: true
  },
  {
    id: 'hydr_008',
    name: 'Vaso Sanitário',
    code: 'VS',
    category: 'hidraulico',
    description: 'Vaso sanitário',
    customizable: true
  },
  {
    id: 'hydr_009',
    name: 'Lavatório',
    code: 'L',
    category: 'hidraulico',
    description: 'Lavatório',
    customizable: true
  },
  {
    id: 'hydr_010',
    name: 'Tanque',
    code: 'TQ',
    category: 'hidraulico',
    description: 'Tanque de lavar roupa',
    customizable: true
  }
];

export const ARCHITECTURAL_SYMBOLS: Symbol[] = [
  {
    id: 'arch_001',
    name: 'Parede',
    code: 'PAR',
    category: 'arquitetonico',
    description: 'Parede de alvenaria',
    customizable: true
  },
  {
    id: 'arch_002',
    name: 'Porta',
    code: 'P',
    category: 'arquitetonico',
    description: 'Porta de abrir',
    customizable: true
  },
  {
    id: 'arch_003',
    name: 'Janela',
    code: 'J',
    category: 'arquitetonico',
    description: 'Janela',
    customizable: true
  },
  {
    id: 'arch_004',
    name: 'Escada',
    code: 'ESC',
    category: 'arquitetonico',
    description: 'Escada',
    customizable: true
  },
  {
    id: 'arch_005',
    name: 'Pilar',
    code: 'PIL',
    category: 'arquitetonico',
    description: 'Pilar arquitetônico',
    customizable: true
  }
];

export const STRUCTURAL_SYMBOLS: Symbol[] = [
  {
    id: 'stru_001',
    name: 'Pilar',
    code: 'P',
    category: 'estrutural',
    description: 'Pilar estrutural',
    customizable: true
  },
  {
    id: 'stru_002',
    name: 'Viga',
    code: 'V',
    category: 'estrutural',
    description: 'Viga estrutural',
    customizable: true
  },
  {
    id: 'stru_003',
    name: 'Laje',
    code: 'L',
    category: 'estrutural',
    description: 'Laje',
    customizable: true
  }
];

export const ALL_SYMBOLS = [
  ...ELECTRICAL_SYMBOLS,
  ...HYDRAULIC_SYMBOLS,
  ...ARCHITECTURAL_SYMBOLS,
  ...STRUCTURAL_SYMBOLS
];

export function getSymbolsByCategory(category: Symbol['category']): Symbol[] {
  return ALL_SYMBOLS.filter(s => s.category === category);
}

export function getSymbolById(id: string): Symbol | undefined {
  return ALL_SYMBOLS.find(s => s.id === id);
}
