const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Atualizar todos os registros do dashboard para associar com a prefeitura id 1
    const result = await prisma.dashboard.updateMany({
      where: {
        prefeitura_id: null
      },
      data: {
        prefeitura_id: 1
      }
    });
    
    console.log(`${result.count} registros atualizados com sucesso`);
  } catch (error) {
    console.error('Erro ao atualizar dashboard:', error);
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