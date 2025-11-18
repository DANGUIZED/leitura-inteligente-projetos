// Tipos do Sistema de Análise de Projetos

export type ProjectType = 
  | 'arquitetonico' 
  | 'eletrico' 
  | 'hidraulico' 
  | 'estrutural' 
  | 'sanitario' 
  | 'ppci'
  | 'desconhecido';

export type FileFormat = 'pdf' | 'dwg' | 'dxf' | 'png' | 'jpg' | 'jpeg';

export interface ProjectScale {
  detected: boolean;
  value: string; // ex: "1:50"
  ratio: number; // ex: 50
  method: 'manual' | 'ocr' | 'calculated';
}

export interface Symbol {
  id: string;
  name: string;
  code: string;
  category: 'eletrico' | 'hidraulico' | 'arquitetonico' | 'estrutural';
  description: string;
  customizable: boolean;
}

export interface DetectedElement {
  id: string;
  type: string;
  symbolId?: string;
  location: {
    x: number;
    y: number;
    room?: string;
  };
  properties: Record<string, any>;
  coordinates?: string;
}

export interface AreaCalculation {
  name: string;
  type: 'total' | 'util' | 'molhada' | 'circulacao' | 'comodo';
  value: number; // em m²
  room?: string;
}

export interface WallCalculation {
  thickness: number; // em cm
  linearMeters: number;
  area: number; // para reboco
  location: string;
}

export interface ElectricalPoint {
  id: string;
  name: string;
  type: 'tomada_simples' | 'tomada_dupla' | 'tomada_especifica' | 
        'interruptor_simples' | 'interruptor_paralelo' | 'interruptor_intermediario' |
        'ponto_luz' | 'luminaria' | 'quadro_eletrico' | 'ar_condicionado';
  location: string;
  coordinates: { x: number; y: number };
  height?: number;
  circuit?: string;
  power?: number;
}

export interface HydraulicPoint {
  id: string;
  name: string;
  type: 'agua_fria' | 'agua_quente' | 'esgoto' | 'ventilacao' | 
        'ralo' | 'chuveiro' | 'vaso' | 'lavatorio' | 'tanque';
  location: string;
  coordinates: { x: number; y: number };
  diameter?: number;
  material?: string;
}

export interface StructuralElement {
  id: string;
  type: 'pilar' | 'viga' | 'laje';
  dimensions: string;
  position: string;
  axis?: string;
  thickness?: number;
  level?: number;
}

export interface ProjectAnalysis {
  id: string;
  fileName: string;
  fileType: FileFormat;
  uploadDate: Date;
  projectType: ProjectType;
  scale: ProjectScale;
  
  // Quantitativos
  areas: AreaCalculation[];
  walls: WallCalculation[];
  electricalPoints: ElectricalPoint[];
  hydraulicPoints: HydraulicPoint[];
  structuralElements: StructuralElement[];
  
  // Símbolos e Legendas
  detectedSymbols: Symbol[];
  customSymbols: Symbol[];
  
  // Observações
  observations: string[];
  inconsistencies: string[];
  suggestions: string[];
  
  // Status
  status: 'processing' | 'completed' | 'error';
  progress: number;
}

export interface CustomSymbolLibrary {
  id: string;
  name: string;
  symbols: Symbol[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisReport {
  summary: string;
  quantitatives: {
    areas: AreaCalculation[];
    walls: WallCalculation[];
    coatings: any[];
  };
  points: {
    electrical: ElectricalPoint[];
    hydraulic: HydraulicPoint[];
    structural: StructuralElement[];
  };
  symbolsInterpreted: Symbol[];
  pointsMap: DetectedElement[];
  technicalObservations: string[];
  suggestions: string[];
}
