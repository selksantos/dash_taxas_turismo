'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const dadosFormatados = dados.map(item => ({
    estado: item.estado,
    quantidade: item._sum.quantidadeTaxa || 0,
    total: item._sum.totalTaxa || 0
  })).sort((a, b) => b.quantidade - a.quantidade).slice(0, 10);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Top 10 Estados</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dadosFormatados} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9CA3AF" />
          <YAxis dataKey="estado" type="category" stroke="#9CA3AF" width={60} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend />
          <Bar dataKey="quantidade" fill="#10B981" name="Quantidade" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}