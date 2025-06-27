'use client';

import { useState, useEffect } from 'react';
import { GraficoPorFaixaEtaria } from './components/GraficoPorFaixaEtaria';
import { GraficoPorSexo } from './components/GraficoPorSexo';
import { GraficoPorEstado } from './components/GraficoPorEstado';
import { GraficoEvolucao } from './components/GraficoEvolucao';
import { FiltroData } from './components/FiltroData';

interface DadosAPI {
  porFaixaEtaria: any[];
  porSexo: any[];
  porEstado: any[];
  evolucaoPorData: any[];
}

export default function Home() {
  const [dados, setDados] = useState<DadosAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarDados = async (inicio?: string, fim?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/taxas';
      if (inicio && fim) {
        url += `?inicio=${inicio}&fim=${fim}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao carregar dados');
      }
      
      const data = await response.json();
      setDados(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleFiltrar = (inicio: string, fim: string) => {
    carregarDados(inicio, fim);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Carregando dados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-2xl">Erro: {error}</div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Nenhum dado disponível</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard de Taxas de Turismo</h1>
        
        <FiltroData onFiltrar={handleFiltrar} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GraficoPorFaixaEtaria dados={dados.porFaixaEtaria} />
          <GraficoPorSexo dados={dados.porSexo} />
          <GraficoPorEstado dados={dados.porEstado} />
          <GraficoEvolucao dados={dados.evolucaoPorData} />
        </div>
      </div>
    </main>
  );
}