'use client';

import { useState } from 'react';

interface Props {
  onFiltrar: (inicio: string, fim: string) => void;
}

export function FiltroData({ onFiltrar }: Props) {
  const [tipoFiltro, setTipoFiltro] = useState<'periodo' | 'personalizado'>('periodo');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('semana');
  const anoAtual = new Date().getFullYear();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (tipoFiltro === 'personalizado') {
      const inicio = formData.get('inicio') as string;
      const fim = formData.get('fim') as string;
      
      if (inicio && fim) {
        onFiltrar(inicio, fim);
      }
    } else {
      const periodo = formData.get('periodo') as string;
      let inicio = '';
      let fim = '';
      
      const hoje = new Date();
      const anoAtual = hoje.getFullYear();
      const mesAtual = hoje.getMonth();
      
      switch (periodo) {
        case 'hoje':
          inicio = fim = hoje.toISOString().split('T')[0];
          break;
        case 'semana':
          const semanaAtras = new Date(hoje);
          semanaAtras.setDate(hoje.getDate() - 7);
          inicio = semanaAtras.toISOString().split('T')[0];
          fim = hoje.toISOString().split('T')[0];
          break;
        case 'mes':
          inicio = new Date(anoAtual, mesAtual, 1).toISOString().split('T')[0];
          fim = new Date(anoAtual, mesAtual + 1, 0).toISOString().split('T')[0];
          break;
        case 'ano':
          inicio = `${anoAtual}-01-01`;
          fim = `${anoAtual}-12-31`;
          break;
        case 'ano-passado':
          inicio = `${anoAtual - 1}-01-01`;
          fim = `${anoAtual - 1}-12-31`;
          break;
        default:
          if (periodo.startsWith('ano-')) {
            const ano = periodo.replace('ano-', '');
            inicio = `${ano}-01-01`;
            fim = `${ano}-12-31`;
          }
      }
      
      if (inicio && fim) {
        onFiltrar(inicio, fim);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Filtrar por Período do Passeio</h2>
      
      <div className="flex gap-4 mb-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="tipoFiltro"
            value="periodo"
            checked={tipoFiltro === 'periodo'}
            onChange={(e) => setTipoFiltro(e.target.value as 'periodo' | 'personalizado')}
            className="mr-2"
          />
          <span className="text-gray-300">Período Predefinido</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="tipoFiltro"
            value="personalizado"
            checked={tipoFiltro === 'personalizado'}
            onChange={(e) => setTipoFiltro(e.target.value as 'periodo' | 'personalizado')}
            className="mr-2"
          />
          <span className="text-gray-300">Período Personalizado</span>
        </label>
      </div>
      
      {tipoFiltro === 'periodo' ? (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="periodo" className="block text-sm font-medium text-gray-300 mb-2">
              Selecione o Período
            </label>
            <select
              id="periodo"
              name="periodo"
              value={periodoSelecionado}
              onChange={(e) => setPeriodoSelecionado(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="hoje">Hoje</option>
              <option value="semana">Últimos 7 dias</option>
              <option value="mes">Este Mês</option>
              <option value="ano">Este Ano ({anoAtual})</option>
              <option value="ano-passado">Ano Passado ({anoAtual - 1})</option>
              <option value="ano-2025">2025</option>
              <option value="ano-2024">2024</option>
              <option value="ano-2023">2023</option>
              <option value="ano-2022">2022</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Filtrar
          </button>
        </div>
      ) : (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="inicio" className="block text-sm font-medium text-gray-300 mb-2">
              Data Inicial do Passeio
            </label>
            <input
              type="date"
              id="inicio"
              name="inicio"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="fim" className="block text-sm font-medium text-gray-300 mb-2">
              Data Final do Passeio
            </label>
            <input
              type="date"
              id="fim"
              name="fim"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Filtrar
          </button>
        </div>
      )}
    </form>
  );
}