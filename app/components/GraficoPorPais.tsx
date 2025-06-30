'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmptyChart } from './EmptyChart';
import { ResponsiveChartWrapper } from './ResponsiveChartWrapper';
import { useState, useEffect } from 'react';

interface DadosPais {
  pais: string;
  _sum: {
    quantidadeTaxa: number | null;
    totalTaxa: number | null;
  };
}

interface Props {
  dados: DadosPais[];
}

export function GraficoPorPais({ dados }: Props) {
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
    pais: item.pais,
    quantidade: Number(item._sum.quantidadeTaxa) || 0,
    total: Number(item._sum.totalTaxa) || 0
  }));

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const chartIcon = (
    <svg className="w-full h-full text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <ResponsiveChartWrapper
      title="Top 10 Países"
      icon={chartIcon}
    >
      {dados.length === 0 ? (
        <EmptyChart 
          height={400}
          message="Nenhum dado disponível para países"
          icon={
            <svg className="w-12 h-12 mb-4 text-blue-400 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      ) : (
      <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
        <BarChart 
          data={dadosFormatados}
          margin={isMobile ? { top: 10, right: 10, left: 10, bottom: 60 } : { top: 20, right: 80, left: 60, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="pais" 
            stroke="#9CA3AF"
            angle={isMobile ? -90 : -45}
            textAnchor="end"
            height={isMobile ? 80 : 100}
            interval={0}
            tick={{ fontSize: isMobile ? 10 : 12 }}
          />
          {!isMobile && (
            <>
              <YAxis 
                yAxisId="left" 
                orientation="left"
                stroke="#9CA3AF" 
                tickFormatter={(value) => value.toLocaleString('pt-BR')}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                stroke="#9CA3AF" 
                tickFormatter={formatarMoeda}
                tick={{ fontSize: 12 }}
              />
            </>
          )}
          {isMobile && (
            <YAxis 
              yAxisId="left" 
              orientation="left"
              stroke="#9CA3AF" 
              tickFormatter={(value) => value.toLocaleString('pt-BR')}
              tick={{ fontSize: 10 }}
              width={40}
            />
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.375rem',
              color: '#F3F4F6',
              fontSize: isMobile ? '12px' : '14px'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'Valor Total') {
                return formatarMoeda(value);
              }
              return value.toLocaleString('pt-BR');
            }}
            labelFormatter={(label) => `País: ${label}`}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px', fontSize: isMobile ? '12px' : '14px' }}
            iconSize={isMobile ? 16 : 20}
          />
          <Bar yAxisId="left" dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
          {!isMobile && <Bar yAxisId="right" dataKey="total" fill="#10B981" name="Valor Total" />}
        </BarChart>
      </ResponsiveContainer>
      )}
    </ResponsiveChartWrapper>
  );
}