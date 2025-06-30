'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EmptyChart } from './EmptyChart';
import { ResponsiveChartWrapper } from './ResponsiveChartWrapper';
import { useState, useEffect } from 'react';

interface DadosEvolucao {
  data: string;
  quantidadeTaxa: number;
  totalTaxa: number;
}

interface Props {
  dados: DadosEvolucao[];
}

export function GraficoEvolucao({ dados }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const dadosFormatados = dados.map(item => ({
    data: format(new Date(item.data), 'dd/MM', { locale: ptBR }),
    quantidade: item.quantidadeTaxa,
    total: item.totalTaxa
  }));

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  // Calcular valores máximos para definir domínios dos eixos
  const maxQuantidade = Math.max(...dadosFormatados.map(d => d.quantidade));
  const maxTotal = Math.max(...dadosFormatados.map(d => d.total));

  const chartIcon = (
    <svg className="w-full h-full text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  );

  return (
    <ResponsiveChartWrapper
      title="Evolução de Taxa por Data"
      icon={chartIcon}
      className="col-span-1 lg:col-span-2"
    >
      {dados.length === 0 ? (
        <EmptyChart 
          message="Nenhum dado disponível para o período selecionado"
          icon={
            <svg className="w-12 h-12 mb-4 text-purple-400 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          }
        />
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
        <LineChart 
          data={dadosFormatados} 
          margin={isMobile ? { top: 5, right: 30, left: 10, bottom: 5 } : { top: 5, right: 80, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="data" 
            stroke="#9CA3AF" 
            tick={{ fontSize: isMobile ? 12 : 14 }}
            interval={isMobile ? 'preserveStartEnd' : 0}
          />
          <YAxis 
            yAxisId="left" 
            stroke="#3B82F6" 
            domain={[0, maxQuantidade * 1.1]} 
            tick={{ fontSize: isMobile ? 12 : 14 }}
            width={isMobile ? 40 : 60}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#EF4444" 
            domain={[0, maxTotal * 1.1]} 
            tickFormatter={formatarMoeda}
            tick={{ fontSize: isMobile ? 12 : 14 }}
            width={isMobile ? 60 : 80}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: isMobile ? '12px' : '14px'
            }}
            labelStyle={{ color: '#F3F4F6' }}
            formatter={(value: number, name: string) => {
              if (name === 'Total (R$)') {
                return formatarMoeda(value);
              }
              return value;
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
            iconSize={isMobile ? 16 : 20}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="quantidade" 
            stroke="#3B82F6" 
            name="Quantidade"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="total" 
            stroke="#EF4444" 
            name="Total (R$)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
      )}
    </ResponsiveChartWrapper>
  );
}