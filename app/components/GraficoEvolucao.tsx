'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-2">
      <h2 className="text-xl font-semibold mb-4 text-white">Evolução de Taxa por Data</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dadosFormatados}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="data" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="quantidade" 
            stroke="#3B82F6" 
            name="Quantidade"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#EF4444" 
            name="Total (R$)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}