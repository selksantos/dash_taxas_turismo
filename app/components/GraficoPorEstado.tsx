'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmptyChart } from './EmptyChart';
import { ResponsiveChartWrapper } from './ResponsiveChartWrapper';
import { useState, useEffect } from 'react';

interface DadosEstado {
  estado: string;
  _sum: {
    quantidadeTaxa: number | null;
    totalTaxa: number | null;
  };
}

interface Props {
  dados: DadosEstado[];
}

export function GraficoPorEstado({ dados }: Props) {
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
    estado: item.estado,
    quantidade: Number(item._sum.quantidadeTaxa) || 0,
    total: Number(item._sum.totalTaxa) || 0
  })).sort((a, b) => b.total - a.total).slice(0, 10);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  const chartIcon = (
    <svg className="w-full h-full text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <ResponsiveChartWrapper
      title="Top 10 Estados Brasileiros"
      icon={chartIcon}
    >
      {dadosFormatados.length === 0 ? (
        <EmptyChart 
          height={400}
          message="Nenhum dado disponível para estados brasileiros"
          icon={
            <svg className="w-12 h-12 mb-4 text-green-400 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      ) : (
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <BarChart 
          data={dadosFormatados}
          margin={isMobile ? { top: 10, right: 10, left: 10, bottom: 5 } : { top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="estado" 
            stroke="#9CA3AF"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval={isMobile ? 'preserveStartEnd' : 0}
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            stroke="#10B981"
            tickFormatter={(value) => value.toLocaleString('pt-BR')}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 40 : 60}
          />
          {!isMobile && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#3B82F6"
              tickFormatter={formatarMoeda}
              tick={{ fontSize: 12 }}
            />
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '0.375rem',
              fontSize: isMobile ? '12px' : '14px'
            }}
            labelStyle={{ color: '#F3F4F6' }}
            formatter={(value: number, name: string) => {
              if (name === 'Valor Total') {
                return formatarMoeda(value);
              }
              return value.toLocaleString('pt-BR');
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
            iconSize={isMobile ? 16 : 20}
          />
          <Bar yAxisId="left" dataKey="quantidade" fill="#10B981" name="Quantidade" />
          {!isMobile && <Bar yAxisId="right" dataKey="total" fill="#3B82F6" name="Valor Total" />}
        </BarChart>
      </ResponsiveContainer>
      )}
    </ResponsiveChartWrapper>
  );
}