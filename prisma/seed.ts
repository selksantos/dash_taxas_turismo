import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dados para geração aleatória
const paises = [
  'Brasil', 'Argentina', 'Chile', 'Uruguai', 'Paraguai', 'Peru', 'Colômbia',
  'Venezuela', 'Equador', 'Bolívia', 'Estados Unidos', 'Canadá', 'México',
  'França', 'Alemanha', 'Itália', 'Espanha', 'Portugal', 'Reino Unido',
  'Japão', 'China', 'Coreia do Sul', 'Austrália', 'Nova Zelândia'
];

const estadosBrasil = [
  'SP', 'RJ', 'MG', 'BA', 'PR', 'RS', 'PE', 'CE', 'PA', 'MA',
  'GO', 'SC', 'PB', 'RN', 'ES', 'AL', 'PI', 'DF', 'MS', 'MT',
  'RO', 'SE', 'AC', 'AM', 'RR', 'AP', 'TO'
];

const sexos = ['M', 'F', 'Outro'];

// Função para gerar data aleatória
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Função para gerar idade entre 1 e 90 anos
function generateBirthDate(): Date {
  const today = new Date();
  const age = Math.floor(Math.random() * 90) + 1;
  const birthYear = today.getFullYear() - age;
  return new Date(birthYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
}

async function main() {
  console.log('Iniciando seed do banco de dados...');
  
  // Limpar dados existentes
  await prisma.dashboard.deleteMany();
  console.log('Dados anteriores removidos.');
  
  // Gerar 100.000 registros
  const batchSize = 1000;
  const totalRecords = 1000000;
  
  for (let i = 0; i < totalRecords; i += batchSize) {
    const records = [];
    
    for (let j = 0; j < batchSize && (i + j) < totalRecords; j++) {
      const pais = paises[Math.floor(Math.random() * paises.length)];
      const estado = pais === 'Brasil' 
        ? estadosBrasil[Math.floor(Math.random() * estadosBrasil.length)]
        : 'N/A';
      
      const dataPasseio = randomDate(new Date('2025-01-01'), new Date('2025-06-28'));
      const dataCompra = randomDate(
        new Date(dataPasseio.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 dias antes
        dataPasseio
      );
      
      records.push({
        pais,
        estado,
        sexo: sexos[Math.floor(Math.random() * sexos.length)],
        dataNascimento: generateBirthDate(),
        quantidadeTaxa: Math.floor(Math.random() * 5) + 1,
        totalTaxa: parseFloat((Math.random() * 500 + 50).toFixed(2)),
        dataPasseio,
        dataCompra
      });
    }
    
    await prisma.dashboard.createMany({
      data: records
    });
    
    console.log(`Inseridos ${i + records.length} de ${totalRecords} registros...`);
  }
  
  console.log('Seed concluído com sucesso!');
  
  // Mostrar estatísticas
  const total = await prisma.dashboard.count();
  const porPais = await prisma.dashboard.groupBy({
    by: ['pais'],
    _count: true,
    orderBy: {
      _count: {
        pais: 'desc'
      }
    },
    take: 10
  });
  
  console.log(`\nTotal de registros: ${total}`);
  console.log('\nTop 10 países:');
  porPais.forEach(p => {
    console.log(`- ${p.pais}: ${p._count} registros`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });