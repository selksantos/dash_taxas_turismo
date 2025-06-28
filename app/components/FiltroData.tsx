'use client';

interface Props {
  onFiltrar: (inicio: string, fim: string) => void;
}

export function FiltroData({ onFiltrar }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inicio = formData.get('inicio') as string;
    const fim = formData.get('fim') as string;
    
    if (inicio && fim) {
      onFiltrar(inicio, fim);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Filtrar por Período do Passeio</h2>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="inicio" className="block text-sm font-medium text-gray-300 mb-2">
            Data Inicial do Passeio
          </label>
          <input
            type="date"
            id="inicio"
            name="inicio"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="fim" className="block text-sm font-medium text-gray-300 mb-2">
            Data Final do Passeio
          </label>
          <input
            type="date"
            id="fim"
            name="fim"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Filtrar
        </button>
      </div>
    </form>
  );
}