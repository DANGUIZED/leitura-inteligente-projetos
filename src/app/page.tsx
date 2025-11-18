'use client';

import { useState } from 'react';
import { FileUploadZone } from '@/components/custom/file-upload-zone';
import { AnalysisResults } from '@/components/custom/analysis-results';
import { SymbolEditor } from '@/components/custom/symbol-editor';
import { Symbol } from '@/lib/types';
import { ALL_SYMBOLS } from '@/lib/symbols-database';
import { 
  Building2, 
  Settings, 
  FileText, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customSymbols, setCustomSymbols] = useState<Symbol[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'symbols' | 'results'>('upload');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError('');
    setActiveTab('results');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('customSymbols', JSON.stringify(customSymbols));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao processar arquivo');
      }

      const results = await response.json();
      setAnalysisResults(results);
    } catch (err: any) {
      setError(err.message || 'Erro ao analisar projeto');
      setActiveTab('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (!analysisResults) return;

    const dataStr = JSON.stringify(analysisResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analise_${selectedFile?.name || 'projeto'}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleNewAnalysis = () => {
    setSelectedFile(null);
    setAnalysisResults(null);
    setError('');
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Análise Inteligente de Projetos
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sistema completo de leitura de plantas arquitetônicas, elétricas, hidráulicas e estruturais
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Upload e Análise
          </button>
          <button
            onClick={() => setActiveTab('symbols')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'symbols'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Símbolos Personalizados
            {customSymbols.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                {customSymbols.length}
              </span>
            )}
          </button>
          {analysisResults && (
            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'results'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Resultados
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-6 md:p-8">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Enviar Projeto para Análise
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Faça upload de plantas em PDF, DWG, DXF ou imagens (PNG, JPG)
                </p>
              </div>

              <FileUploadZone onFileSelect={handleFileSelect} />

              {selectedFile && (
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Arquivo pronto para análise
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedFile.name} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Building2 className="w-5 h-5" />
                        Iniciar Análise
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">
                      Erro na análise
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Detecção Automática
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Identifica automaticamente tipo de projeto, escala e símbolos conforme ABNT
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Quantitativos Completos
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Calcula áreas, perímetros, pontos elétricos, hidráulicos e elementos estruturais
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Relatório Técnico
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gera relatório completo com observações, inconsistências e sugestões
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Symbols Tab */}
          {activeTab === 'symbols' && (
            <SymbolEditor
              symbols={[...ALL_SYMBOLS, ...customSymbols]}
              onSymbolsChange={setCustomSymbols}
            />
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Analisando projeto...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    Estamos processando seu projeto com IA avançada. Isso pode levar alguns instantes.
                  </p>
                </div>
              ) : analysisResults ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Resultados da Análise
                    </h2>
                    <button
                      onClick={handleNewAnalysis}
                      className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors"
                    >
                      Nova Análise
                    </button>
                  </div>
                  <AnalysisResults 
                    results={analysisResults} 
                    onExport={handleExport}
                  />
                </>
              ) : (
                <div className="text-center py-20">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Nenhuma análise realizada ainda
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-950 rounded-xl shadow-lg">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Formatos Suportados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {['PDF', 'DWG', 'DXF', 'PNG', 'JPG', 'JPEG'].map(format => (
              <div
                key={format}
                className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center"
              >
                <p className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                  {format}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
