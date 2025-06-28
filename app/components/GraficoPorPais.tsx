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
  console.log('DEBUG GraficoPorPais - dados recebidos:', dados.slice(0, 3));
  
  const dadosFormatados = dados.map(item => ({
    pais: item.pais,
    quantidade: item._sum.quantidadeTaxa || 0,
    total: Number(item._sum.totalTaxa) || 0
  }));
  
  console.log('DEBUG GraficoPorPais - dados formatados:', dadosFormatados.slice(0, 3));

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
        <BarChart 
          data={dadosFormatados}
          margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="pais" 
            stroke="#9CA3AF"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.375rem',
              color: '#F3F4F6'
            }}
            formatter={(value: number, name: string) => {
              if (name === 'Valor Total') {
                return formatarMoeda(value);
              }
              return value.toLocaleString('pt-BR');
            }}
            labelFormatter={(label) => `País: ${label}`}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
          <Bar dataKey="total" fill="#10B981" name="Valor Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}