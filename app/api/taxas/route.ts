import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function calcularFaixasEtarias(whereClause: Record<string, unknown>) {
  const dados = await prisma.dashboard.findMany({
    where: whereClause,
    select: {
      dataNascimento: true,
      quantidadeTaxa: true,
      totalTaxa: true
    }
  });

  // Se não há dados, retornar array vazio
  if (dados.length === 0) {
    return [];
  }

  const faixas = {
    '0-17': { _sum: { quantidadeTaxa: 0, totalTaxa: 0 } },
    '18-30': { _sum: { quantidadeTaxa: 0, totalTaxa: 0 } },
    '31-50': { _sum: { quantidadeTaxa: 0, totalTaxa: 0 } },
    '51+': { _sum: { quantidadeTaxa: 0, totalTaxa: 0 } }
  };

  dados.forEach(item => {
    const hoje = new Date();
    const nascimento = new Date(item.dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    let faixa: keyof typeof faixas;
    if (idade < 18) faixa = '0-17';
    else if (idade <= 30) faixa = '18-30';
    else if (idade <= 50) faixa = '31-50';
    else faixa = '51+';

    faixas[faixa]._sum.quantidadeTaxa! += item.quantidadeTaxa;
    faixas[faixa]._sum.totalTaxa! += item.totalTaxa.toNumber();
  });

  return Object.entries(faixas).map(([faixaEtaria, valores]) => ({
    faixaEtaria,
    ...valores
  }));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const inicio = searchParams.get('inicio');
    const fim = searchParams.get('fim');

    let whereClause = {};
    
    if (inicio && fim) {
      whereClause = {
        dataPasseio: {
          gte: new Date(inicio),
          lte: new Date(fim)
        }
      };
    }

    // Agregar dados por data para evitar problemas de performance
    const dadosPorData = await prisma.dashboard.groupBy({
      by: ['dataPasseio'],
      where: whereClause,
      _sum: {
        quantidadeTaxa: true,
        totalTaxa: true
      },
      orderBy: {
        dataPasseio: 'asc'
      }
    });

    // Filtrar apenas estados brasileiros (não 'N/A')
    const whereClauseEstadosBrasil = {
      ...whereClause,
      estado: {
        not: 'N/A'
      },
      pais: 'Brasil'
    };

    // Query por país
    const porPais = await prisma.dashboard.groupBy({
      by: ['pais'],
      where: whereClause,
      _sum: {
        quantidadeTaxa: true,
        totalTaxa: true
      },
      orderBy: {
        _sum: {
          totalTaxa: 'desc'
        }
      },
      take: 10 // Top 10 países
    });
    
    // Query por estado
    const porEstado = await prisma.dashboard.groupBy({
      by: ['estado'],
      where: whereClauseEstadosBrasil,
      _sum: {
        quantidadeTaxa: true,
        totalTaxa: true
      },
      orderBy: {
        _sum: {
          totalTaxa: 'desc'
        }
      },
      take: 10 // Top 10 estados brasileiros
    });

    const dadosAgregados = {
      porFaixaEtaria: await calcularFaixasEtarias(whereClause),
      porSexo: (await prisma.dashboard.groupBy({
        by: ['sexo'],
        where: whereClause,
        _sum: {
          quantidadeTaxa: true,
          totalTaxa: true
        }
      })).map(item => ({
        ...item,
        _sum: {
          quantidadeTaxa: item._sum.quantidadeTaxa || 0,
          totalTaxa: item._sum.totalTaxa?.toNumber() || 0
        }
      })),
      porPais: porPais.map(item => ({
        ...item,
        _sum: {
          quantidadeTaxa: item._sum.quantidadeTaxa || 0,
          totalTaxa: item._sum.totalTaxa?.toNumber() || 0
        }
      })),
      porEstado: porEstado.map(item => ({
        ...item,
        _sum: {
          quantidadeTaxa: item._sum.quantidadeTaxa || 0,
          totalTaxa: item._sum.totalTaxa?.toNumber() || 0
        }
      })),
      evolucaoPorData: dadosPorData.map(item => ({
        data: item.dataPasseio,
        quantidadeTaxa: item._sum.quantidadeTaxa || 0,
        totalTaxa: item._sum.totalTaxa?.toNumber() || 0
      }))
    };

    return NextResponse.json(dadosAgregados);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    );
  }
}