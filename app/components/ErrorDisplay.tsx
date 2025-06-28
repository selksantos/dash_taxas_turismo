'use client';

interface Props {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: Props) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="relative inline-flex">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="w-16 h-16 bg-red-500 rounded-full absolute top-0 left-0 animate-ping opacity-25"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-white mb-4">
          Ops! Algo deu errado
        </h2>
        
        <p className="text-gray-400 mb-8">
          {error || 'Não foi possível carregar os dados do dashboard.'}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}