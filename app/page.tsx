'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  const [periodoAtual, setPeriodoAtual] = useState<{ inicio: string; fim: string } | undefined>(undefined);

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
      
      // Atualizar período atual
      if (inicio && fim) {
        setPeriodoAtual({ inicio, fim });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sempre carregar dados dos últimos 7 dias ao entrar no site
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);
    
    const inicio = seteDiasAtras.toISOString().split('T')[0];
    const fim = hoje.toISOString().split('T')[0];
    
    carregarDados(inicio, fim);
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
    <main className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 lg:mb-8 space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Image 
              src="/images/brasao_ilha_grande.png" 
              alt="Brasão de Ilha Grande" 
              width={80} 
              height={80}
              className="object-contain w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center sm:text-left">Dashboard de Taxas de Turismo</h1>
          </div>
          {periodoAtual && (
            <div className="text-sm text-gray-400 flex justify-center lg:justify-end">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-lg">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="whitespace-nowrap">
                  {new Date(periodoAtual.inicio).toLocaleDateString('pt-BR')} - {new Date(periodoAtual.fim).toLocaleDateString('pt-BR')}
                </span>
              </span>
            </div>
          )}
        </div>
        
        <FiltroData onFiltrar={handleFiltrar} periodoInicial={periodoAtual} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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