'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
  const dadosFormatados = dados.map(item => ({
    name: item.sexo,
    value: item._sum.quantidadeTaxa || 0
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Distribuição por Sexo</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dadosFormatados}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dadosFormatados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}