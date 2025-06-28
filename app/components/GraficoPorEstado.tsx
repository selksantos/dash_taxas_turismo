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

  if (dadosFormatados.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Top 10 Estados Brasileiros</h2>
        <div className="flex items-center justify-center h-[300px] text-gray-400">
          <p>Nenhum dado disponível para estados brasileiros</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Top 10 Estados Brasileiros</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={dadosFormatados}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="estado" 
            stroke="#9CA3AF"
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            stroke="#10B981"
            tickFormatter={(value) => value.toLocaleString('pt-BR')}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#3B82F6"
            tickFormatter={formatarMoeda}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '0.375rem'
            }}
            labelStyle={{ color: '#F3F4F6' }}
            formatter={(value: number, name: string) => {
              if (name === 'Valor Total') {
                return formatarMoeda(value);
              }
              return value.toLocaleString('pt-BR');
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="quantidade" fill="#10B981" name="Quantidade" />
          <Bar yAxisId="right" dataKey="total" fill="#3B82F6" name="Valor Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}