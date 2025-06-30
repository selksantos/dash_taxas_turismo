const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Testando conexão com o banco de dados...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));
  
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });

  try {
    // Tentar uma query simples
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados!');
    
    // Tentar contar registros
    const count = await prisma.dashboard.count();
    console.log(`📊 Total de registros na tabela Dashboard: ${count}`);
    
    // Verificar a tabela Prefeitura
    const prefeituras = await prisma.prefeitura.findMany();
    console.log(`🏛️  Prefeituras cadastradas: ${prefeituras.length}`);
    
    if (prefeituras.length > 0) {
      console.log('Prefeituras:', prefeituras);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.code === 'P1000') {
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verifique se o servidor está acessível: painel.spemm.net:5430');
      console.log('2. Confirme as credenciais com o administrador do banco');
      console.log('3. Verifique se o usuário "postgres" tem permissão no banco "taxas_turismo"');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();