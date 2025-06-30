'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmptyChart } from './EmptyChart';
import { ResponsiveChartWrapper } from './ResponsiveChartWrapper';
import { useState, useEffect } from 'react';

interface DadosFaixaEtaria {
  faixaEtaria: string;
  _sum: {
    quantidadeTaxa: number | null;
    totalTaxa: number | null;
  };
}

interface Props {
  dados: DadosFaixaEtaria[];
}

export function GraficoPorFaixaEtaria({ dados }: Props) {
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
    faixaEtaria: item.faixaEtaria,
    quantidade: item._sum.quantidadeTaxa || 0,
    total: item._sum.totalTaxa || 0
  }));

  const chartIcon = (
    <svg className="w-full h-full text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  return (
    <ResponsiveChartWrapper
      title="Quantidade por Faixa Etária"
      icon={chartIcon}
    >
      {dados.length === 0 ? (
        <EmptyChart 
          message="Nenhum dado disponível por faixa etária"
          icon={
            <svg className="w-12 h-12 mb-4 text-yellow-400 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      ) : (
      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
        <BarChart 
          data={dadosFormatados} 
          margin={isMobile ? { top: 5, right: 10, left: 10, bottom: 40 } : { top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="faixaEtaria" 
            stroke="#9CA3AF" 
            tick={{ fontSize: isMobile ? 10 : 12 }}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 60 : 30}
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 40 : 60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none',
              fontSize: isMobile ? '12px' : '14px'
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
            iconSize={isMobile ? 16 : 20}
          />
          <Bar dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
        </BarChart>
      </ResponsiveContainer>
      )}
    </ResponsiveChartWrapper>
  );
}