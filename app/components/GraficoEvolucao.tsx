'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EmptyChart } from './EmptyChart';

interface DadosEvolucao {
  data: string;
  quantidadeTaxa: number;
  totalTaxa: number;
}

interface Props {
  dados: DadosEvolucao[];
}

export function GraficoEvolucao({ dados }: Props) {
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

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-2">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        Evolução de Taxa por Data
      </h2>
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
        <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dadosFormatados} margin={{ top: 5, right: 80, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="data" stroke="#9CA3AF" />
          <YAxis yAxisId="left" stroke="#3B82F6" domain={[0, maxQuantidade * 1.1]} />
          <YAxis yAxisId="right" orientation="right" stroke="#EF4444" domain={[0, maxTotal * 1.1]} tickFormatter={formatarMoeda} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelStyle={{ color: '#F3F4F6' }}
            formatter={(value: number, name: string) => {
              if (name === 'Total (R$)') {
                return formatarMoeda(value);
              }
              return value;
            }}
          />
          <Legend />
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
    </div>
  );
}