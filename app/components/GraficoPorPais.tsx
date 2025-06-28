'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
  const dadosFormatados = dados.map(item => ({
    pais: item.pais,
    quantidade: item._sum.quantidadeTaxa || 0,
    total: item._sum.totalTaxa || 0
  }));

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Top 10 Países</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dadosFormatados}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="pais" 
            stroke="#9CA3AF"
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.375rem'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'total') {
                return formatarMoeda(value);
              }
              return value;
            }}
            labelFormatter={(label) => `País: ${label}`}
          />
          <Legend 
            wrapperStyle={{ color: '#9CA3AF' }}
            formatter={(value) => value === 'total' ? 'Valor Total' : 'Quantidade'}
          />
          <Bar dataKey="quantidade" fill="#3B82F6" />
          <Bar dataKey="total" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}