'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';
import { Symbol } from '@/lib/types';

interface SymbolEditorProps {
  symbols: Symbol[];
  onSymbolsChange: (symbols: Symbol[]) => void;
}

export function SymbolEditor({ symbols, onSymbolsChange }: SymbolEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSymbol, setNewSymbol] = useState<Partial<Symbol>>({
    category: 'eletrico'
  });

  const addSymbol = () => {
    if (!newSymbol.name || !newSymbol.code) return;

    const symbol: Symbol = {
      id: `custom_${Date.now()}`,
      name: newSymbol.name,
      code: newSymbol.code,
      category: newSymbol.category as any,
      description: newSymbol.description || '',
      customizable: true
    };

    onSymbolsChange([...symbols, symbol]);
    setNewSymbol({ category: 'eletrico' });
  };

  const removeSymbol = (id: string) => {
    onSymbolsChange(symbols.filter(s => s.id !== id));
  };

  const updateSymbol = (id: string, updates: Partial<Symbol>) => {
    onSymbolsChange(
      symbols.map(s => s.id === id ? { ...s, ...updates } : s)
    );
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Símbolos Personalizados
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Adicione ou edite símbolos para adaptar a análise aos seus padrões específicos
        </p>
      </div>

      {/* Adicionar Novo Símbolo */}
      <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
          Adicionar Novo Símbolo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nome do símbolo"
            value={newSymbol.name || ''}
            onChange={(e) => setNewSymbol({ ...newSymbol, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Código (ex: TUG, AF)"
            value={newSymbol.code || ''}
            onChange={(e) => setNewSymbol({ ...newSymbol, code: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <select
            value={newSymbol.category}
            onChange={(e) => setNewSymbol({ ...newSymbol, category: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="eletrico">Elétrico</option>
            <option value="hidraulico">Hidráulico</option>
            <option value="arquitetonico">Arquitetônico</option>
            <option value="estrutural">Estrutural</option>
          </select>
          <input
            type="text"
            placeholder="Descrição"
            value={newSymbol.description || ''}
            onChange={(e) => setNewSymbol({ ...newSymbol, description: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <button
          onClick={addSymbol}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Símbolo
        </button>
      </div>

      {/* Lista de Símbolos */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          Símbolos Cadastrados ({symbols.length})
        </h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {symbols.map((symbol) => (
            <div
              key={symbol.id}
              className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {editingId === symbol.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={symbol.name}
                    onChange={(e) => updateSymbol(symbol.id, { name: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                  >
                    <Save className="w-3 h-3" />
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm">
                      {symbol.code}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {symbol.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {symbol.category} • {symbol.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(symbol.id)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => removeSymbol(symbol.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
