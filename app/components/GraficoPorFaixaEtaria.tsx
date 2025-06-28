'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmptyChart } from './EmptyChart';

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
  const dadosFormatados = dados.map(item => ({
    faixaEtaria: item.faixaEtaria,
    quantidade: item._sum.quantidadeTaxa || 0,
    total: item._sum.totalTaxa || 0
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Quantidade por Faixa Etária
      </h2>
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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dadosFormatados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="faixaEtaria" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend />
          <Bar dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}