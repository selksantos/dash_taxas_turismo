const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Executar o UPDATE para preencher prefeitura_id
    const result = await prisma.$executeRaw`
      UPDATE "Dashboard" 
      SET prefeitura_id = 1
      WHERE prefeitura_id IS NULL
    `;
    
    console.log(`✅ ${result} registros atualizados com prefeitura_id = 1`);
    
    // Verificar quantos registros têm prefeitura_id = 1
    const count = await prisma.dashboard.count({
      where: {
        prefeitura_id: 1
      }
    });
    
    console.log(`📊 Total de registros com prefeitura_id = 1: ${count}`);
    
    // Verificar se ainda existem registros sem prefeitura_id
    const countNull = await prisma.dashboard.count({
      where: {
        prefeitura_id: null
      }
    });
    
    console.log(`❓ Registros sem prefeitura_id: ${countNull}`);
    
  } catch (error) {
    console.error('❌ Erro ao executar update:', error.message);
    // Tentar fornecer mais detalhes sobre o erro
    if (error.code === 'P1000') {
      console.error('\n⚠️  Erro de autenticação com o banco de dados.');
      console.error('Por favor, verifique as credenciais no arquivo .env');
      console.error('DATABASE_URL atual:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });