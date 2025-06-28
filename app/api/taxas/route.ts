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

    const dados = await prisma.dashboard.findMany({
      where: whereClause,
      orderBy: {
        dataPasseio: 'asc'
      }
    });

    const dadosAgregados = {
      porFaixaEtaria: await calcularFaixasEtarias(whereClause),
      porSexo: await prisma.dashboard.groupBy({
        by: ['sexo'],
        where: whereClause,
        _sum: {
          quantidadeTaxa: true,
          totalTaxa: true
        }
      }),
      porEstado: await prisma.dashboard.groupBy({
        by: ['estado'],
        where: whereClause,
        _sum: {
          quantidadeTaxa: true,
          totalTaxa: true
        }
      }),
      evolucaoPorData: dados.map(item => ({
        data: item.dataPasseio,
        quantidadeTaxa: item.quantidadeTaxa,
        totalTaxa: item.totalTaxa.toNumber()
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