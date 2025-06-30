const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando seed do banco de dados...');
  
  try {
    // Criar a prefeitura de Ilha Grande
    const prefeitura = await prisma.prefeitura.upsert({
      where: { id_prefeitura: 1 },
      update: {},
      create: {
        id_prefeitura: 1,
        razao_social: 'MUNICIPIO DE ILHA GRANDE',
        nome_fantasia: 'PREFEITURA MUNICIPAL DE ILHA GRANDE',
        cnpj: '45663892000149',
        ativo: true,
        path_portal: 'ilha-grande-pi'
      }
    });
    
    console.log(' Prefeitura criada/atualizada:', prefeitura);
    console.log(' Seed concluído com sucesso!');
    
  } catch (error) {
    console.error(' Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });