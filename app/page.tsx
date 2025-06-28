'use client';

import { useState, useEffect } from 'react';
import { GraficoPorFaixaEtaria } from './components/GraficoPorFaixaEtaria';
import { GraficoPorSexo } from './components/GraficoPorSexo';
import { GraficoPorEstado } from './components/GraficoPorEstado';
import { GraficoPorPais } from './components/GraficoPorPais';
import { GraficoEvolucao } from './components/GraficoEvolucao';
import { FiltroData } from './components/FiltroData';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ErrorDisplay } from './components/ErrorDisplay';
import { EmptyState } from './components/EmptyState';

interface DadosAgregados {
  faixaEtaria?: string;
  sexo?: string;
  estado?: string;
  pais?: string;
  _sum: {
    quantidadeTaxa: number | null;
    totalTaxa: number | null;
  };
}

interface DadosEvolucao {
  data: string;
  quantidadeTaxa: number;
  totalTaxa: number;
}

interface DadosAPI {
  porFaixaEtaria: DadosAgregados[];
  porSexo: DadosAgregados[];
  porEstado: DadosAgregados[];
  porPais: DadosAgregados[];
  evolucaoPorData: DadosEvolucao[];
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
    return <LoadingAnimation />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => carregarDados()} />;
  }

  if (!dados) {
    return <EmptyState />;
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard de Taxas de Turismo</h1>
        
        <FiltroData onFiltrar={handleFiltrar} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <GraficoEvolucao dados={dados.evolucaoPorData} />
          </div>
          <GraficoPorPais dados={dados.porPais || []} />
          <GraficoPorEstado dados={dados.porEstado} />
          <GraficoPorFaixaEtaria dados={dados.porFaixaEtaria} />
          <GraficoPorSexo dados={dados.porSexo} />
        </div>
      </div>
    </main>
  );
}