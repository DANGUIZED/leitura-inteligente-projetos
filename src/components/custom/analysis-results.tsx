'use client';

import { useState } from 'react';
import { 
  Building2, 
  Zap, 
  Droplet, 
  Layers, 
  FileText,
  Download,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  results: any;
  onExport?: () => void;
}

export function AnalysisResults({ results, onExport }: AnalysisResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    areas: true,
    electrical: false,
    hydraulic: false,
    structural: false,
    symbols: false,
    observations: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getProjectTypeIcon = () => {
    switch (results.projectType) {
      case 'eletrico': return <Zap className="w-5 h-5" />;
      case 'hidraulico': return <Droplet className="w-5 h-5" />;
      case 'estrutural': return <Layers className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
    }
  };

  const getProjectTypeLabel = () => {
    const types: Record<string, string> = {
      'arquitetonico': 'Arquitetônico',
      'eletrico': 'Elétrico',
      'hidraulico': 'Hidráulico',
      'estrutural': 'Estrutural',
      'sanitario': 'Sanitário',
      'ppci': 'PPCI'
    };
    return types[results.projectType] || 'Não identificado';
  };

  const Section = ({ 
    id, 
    title, 
    icon, 
    children, 
    badge 
  }: { 
    id: string; 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode;
    badge?: number;
  }) => (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-blue-600 dark:text-blue-400">
            {icon}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          {badge !== undefined && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              {badge}
            </span>
          )}
        </div>
        {expandedSections[id] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections[id] && (
        <div className="p-4 bg-white dark:bg-gray-950">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
        <div className="flex items-center gap-4">
          {getProjectTypeIcon()}
          <div>
            <h2 className="text-2xl font-bold">Análise Concluída</h2>
            <p className="text-blue-100">
              Projeto {getProjectTypeLabel()} • Escala {results.scale?.value || 'Não detectada'}
            </p>
          </div>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Resumo Geral */}
      <Section id="summary" title="Resumo Geral" icon={<Eye />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Arquivo</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {results.fileName}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tipo</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getProjectTypeLabel()}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Escala</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {results.scale?.value || 'Não detectada'}
            </p>
          </div>
        </div>
      </Section>

      {/* Áreas */}
      {results.areas && results.areas.length > 0 && (
        <Section 
          id="areas" 
          title="Quantitativos - Áreas" 
          icon={<Building2 />}
          badge={results.areas.length}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ambiente
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tipo
                  </th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Área (m²)
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Dimensões
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.areas.map((area: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                      {area.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {area.type}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                      {area.value?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {area.dimensions || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Pontos Elétricos */}
      {results.electricalPoints && results.electricalPoints.length > 0 && (
        <Section 
          id="electrical" 
          title="Pontos Elétricos" 
          icon={<Zap />}
          badge={results.electricalPoints.length}
        >
          <div className="space-y-3">
            {results.electricalPoints.map((point: any, index: number) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {point.type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {point.location}
                    </p>
                  </div>
                  {point.circuit && (
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs rounded">
                      {point.circuit}
                    </span>
                  )}
                </div>
                {point.details && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    {point.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Pontos Hidráulicos */}
      {results.hydraulicPoints && results.hydraulicPoints.length > 0 && (
        <Section 
          id="hydraulic" 
          title="Pontos Hidráulicos" 
          icon={<Droplet />}
          badge={results.hydraulicPoints.length}
        >
          <div className="space-y-3">
            {results.hydraulicPoints.map((point: any, index: number) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {point.type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {point.location}
                    </p>
                  </div>
                  {point.diameter && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                      Ø {point.diameter}mm
                    </span>
                  )}
                </div>
                {point.details && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    {point.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Elementos Estruturais */}
      {results.structuralElements && results.structuralElements.length > 0 && (
        <Section 
          id="structural" 
          title="Elementos Estruturais" 
          icon={<Layers />}
          badge={results.structuralElements.length}
        >
          <div className="space-y-3">
            {results.structuralElements.map((element: any, index: number) => (
              <div 
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {element.type} - {element.dimensions}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Posição: {element.position}
                    </p>
                  </div>
                  {element.axis && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded">
                      Eixo {element.axis}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Símbolos Interpretados */}
      {results.symbols && results.symbols.length > 0 && (
        <Section 
          id="symbols" 
          title="Símbolos Interpretados" 
          icon={<FileText />}
          badge={results.symbols.length}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.symbols.map((symbol: any, index: number) => (
              <div 
                key={index}
                className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                    {symbol.code}
                  </span>
                  {symbol.count && (
                    <span className="text-xs text-gray-500">
                      {symbol.count}x
                    </span>
                  )}
                </div>
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {symbol.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {symbol.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Observações e Sugestões */}
      {((results.observations && results.observations.length > 0) ||
        (results.inconsistencies && results.inconsistencies.length > 0) ||
        (results.suggestions && results.suggestions.length > 0)) && (
        <Section id="observations" title="Observações Técnicas" icon={<FileText />}>
          <div className="space-y-4">
            {results.observations && results.observations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Observações
                </h4>
                <ul className="space-y-2">
                  {results.observations.map((obs: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.inconsistencies && results.inconsistencies.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                  Inconsistências Encontradas
                </h4>
                <ul className="space-y-2">
                  {results.inconsistencies.map((inc: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                      <span className="mt-1">⚠</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.suggestions && results.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
                  Sugestões de Melhoria
                </h4>
                <ul className="space-y-2">
                  {results.suggestions.map((sug: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400">
                      <span className="mt-1">✓</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}
