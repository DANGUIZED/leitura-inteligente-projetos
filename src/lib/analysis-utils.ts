// Utilitários para Análise de Projetos

import { ProjectType, ProjectScale } from './types';

/**
 * Detecta o tipo de projeto baseado em palavras-chave e padrões
 */
export function detectProjectType(text: string, fileName: string): ProjectType {
  const lowerText = text.toLowerCase();
  const lowerFileName = fileName.toLowerCase();
  
  // Elétrico
  if (
    lowerText.includes('elétric') || 
    lowerText.includes('eletric') ||
    lowerText.includes('quadro de distribuição') ||
    lowerText.includes('circuito') ||
    lowerText.includes('tomada') ||
    lowerText.includes('interruptor') ||
    lowerFileName.includes('eletric')
  ) {
    return 'eletrico';
  }
  
  // Hidráulico
  if (
    lowerText.includes('hidráulic') ||
    lowerText.includes('hidraulic') ||
    lowerText.includes('água fria') ||
    lowerText.includes('água quente') ||
    lowerText.includes('esgoto') ||
    lowerText.includes('tubulação') ||
    lowerFileName.includes('hidraulic')
  ) {
    return 'hidraulico';
  }
  
  // Sanitário
  if (
    lowerText.includes('sanitári') ||
    lowerText.includes('sanitari') ||
    lowerFileName.includes('sanit')
  ) {
    return 'sanitario';
  }
  
  // Estrutural
  if (
    lowerText.includes('estrutural') ||
    lowerText.includes('pilar') ||
    lowerText.includes('viga') ||
    lowerText.includes('laje') ||
    lowerText.includes('fundação') ||
    lowerFileName.includes('estrut')
  ) {
    return 'estrutural';
  }
  
  // PPCI
  if (
    lowerText.includes('ppci') ||
    lowerText.includes('incêndio') ||
    lowerText.includes('incendio') ||
    lowerText.includes('prevenção') ||
    lowerFileName.includes('ppci')
  ) {
    return 'ppci';
  }
  
  // Arquitetônico (padrão)
  if (
    lowerText.includes('arquitetônic') ||
    lowerText.includes('arquitetonic') ||
    lowerText.includes('planta baixa') ||
    lowerText.includes('layout') ||
    lowerFileName.includes('arq')
  ) {
    return 'arquitetonico';
  }
  
  return 'desconhecido';
}

/**
 * Extrai a escala do projeto a partir de texto OCR
 */
export function extractScale(text: string): ProjectScale {
  // Padrões de escala comuns: 1:50, 1:75, 1:100, ESC 1:50, ESCALA 1/100
  const scalePatterns = [
    /(?:esc(?:ala)?[:\s]*)?1[:\s\/](\d+)/i,
    /escala[:\s]+1[:\s\/](\d+)/i
  ];
  
  for (const pattern of scalePatterns) {
    const match = text.match(pattern);
    if (match) {
      const ratio = parseInt(match[1]);
      return {
        detected: true,
        value: `1:${ratio}`,
        ratio,
        method: 'ocr'
      };
    }
  }
  
  return {
    detected: false,
    value: '1:100',
    ratio: 100,
    method: 'manual'
  };
}

/**
 * Calcula escala baseado em cotas conhecidas
 */
export function calculateScaleFromDimensions(
  measuredPixels: number,
  realMeters: number,
  dpi: number = 96
): ProjectScale {
  // Converte pixels para metros considerando DPI
  const pixelsPerMeter = measuredPixels / realMeters;
  const ratio = Math.round((pixelsPerMeter * 0.0254) / (dpi / 100));
  
  return {
    detected: true,
    value: `1:${ratio}`,
    ratio,
    method: 'calculated'
  };
}

/**
 * Converte medidas em pixels para metros reais baseado na escala
 */
export function pixelsToMeters(pixels: number, scale: ProjectScale, dpi: number = 96): number {
  const metersPerPixel = (scale.ratio * 0.0254) / dpi;
  return pixels * metersPerPixel;
}

/**
 * Calcula área em m² a partir de dimensões em pixels
 */
export function calculateArea(widthPx: number, heightPx: number, scale: ProjectScale, dpi: number = 96): number {
  const widthM = pixelsToMeters(widthPx, scale, dpi);
  const heightM = pixelsToMeters(heightPx, scale, dpi);
  return parseFloat((widthM * heightM).toFixed(2));
}

/**
 * Identifica o nome do ambiente baseado em texto OCR
 */
export function identifyRoom(text: string): string {
  const lowerText = text.toLowerCase();
  
  const roomPatterns: Record<string, string[]> = {
    'Sala': ['sala', 'living'],
    'Cozinha': ['cozinha', 'coz.'],
    'Quarto': ['quarto', 'dormitório', 'dorm.', 'suíte', 'suite'],
    'Banheiro': ['banheiro', 'wc', 'bwc', 'lavabo'],
    'Área de Serviço': ['área de serviço', 'a.serviço', 'serviço'],
    'Garagem': ['garagem', 'gar.'],
    'Varanda': ['varanda', 'sacada'],
    'Corredor': ['corredor', 'circulação', 'hall'],
    'Escritório': ['escritório', 'home office'],
    'Despensa': ['despensa']
  };
  
  for (const [room, patterns] of Object.entries(roomPatterns)) {
    if (patterns.some(pattern => lowerText.includes(pattern))) {
      return room;
    }
  }
  
  return 'Ambiente não identificado';
}

/**
 * Valida consistência de dados do projeto
 */
export function validateProjectConsistency(analysis: any): string[] {
  const issues: string[] = [];
  
  if (!analysis.scale.detected) {
    issues.push('Escala não detectada automaticamente - verificar manualmente');
  }
  
  if (analysis.projectType === 'desconhecido') {
    issues.push('Tipo de projeto não identificado - classificar manualmente');
  }
  
  if (analysis.detectedSymbols.length === 0) {
    issues.push('Nenhum símbolo detectado - verificar legenda do projeto');
  }
  
  if (analysis.areas.length === 0) {
    issues.push('Áreas não calculadas - verificar cotas e dimensões');
  }
  
  return issues;
}

/**
 * Formata número para exibição com unidade
 */
export function formatMeasurement(value: number, unit: 'm' | 'm²' | 'cm'): string {
  return `${value.toFixed(2)} ${unit}`;
}

/**
 * Gera ID único para elementos
 */
export function generateElementId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
