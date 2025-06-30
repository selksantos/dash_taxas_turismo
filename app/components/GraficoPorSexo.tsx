'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { EmptyChart } from './EmptyChart';
import { ResponsiveChartWrapper } from './ResponsiveChartWrapper';
import { useState, useEffect } from 'react';

interface DadosSexo {
  sexo: string;
  _sum: {
    quantidadeTaxa: number | null;
    totalTaxa: number | null;
  };
}

interface Props {
  dados: DadosSexo[];
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981'];

export function GraficoPorSexo({ dados }: Props) {
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
    name: item.sexo,
    value: item._sum.quantidadeTaxa || 0
  }));

  const chartIcon = (
    <svg className="w-full h-full text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <ResponsiveChartWrapper
      title="Distribuição por Sexo"
      icon={chartIcon}
    >
      {dados.length === 0 ? (
        <EmptyChart 
          message="Nenhum dado disponível por sexo"
          icon={
            <svg className="w-12 h-12 mb-4 text-pink-400 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      ) : (
      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
        <PieChart>
          <Pie
            data={dadosFormatados}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}`}
            outerRadius={isMobile ? 60 : 80}
            fill="#8884d8"
            dataKey="value"
          >
            {dadosFormatados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
      )}
    </ResponsiveChartWrapper>
  );
}