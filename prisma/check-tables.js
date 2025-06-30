const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  try {
    // Listar todas as tabelas no schema public
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('📋 Tabelas encontradas no banco:');
    tables.forEach(t => console.log(`  - ${t.table_name}`));
    
    // Verificar se existe Dashboard com D maiúsculo
    const dashboardExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Dashboard'
      );
    `;
    
    if (dashboardExists[0].exists) {
      console.log('\n✅ Tabela "Dashboard" (com D maiúsculo) existe!');
      
      // Contar registros
      const count = await prisma.$queryRaw`SELECT COUNT(*) FROM "Dashboard"`;
      console.log(`📊 Total de registros: ${count[0].count}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();