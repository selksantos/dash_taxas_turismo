'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      <h2 className="text-xl font-semibold mb-4 text-white">Quantidade por Faixa Etária</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dadosFormatados}>
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
    </div>
  );
}