import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const inicio = searchParams.get('inicio');
    const fim = searchParams.get('fim');

    let whereClause = {};
    
    if (inicio && fim) {
      whereClause = {
        data: {
          gte: new Date(inicio),
          lte: new Date(fim)
        }
      };
    }

    const dados = await prisma.dashboard.findMany({
      where: whereClause,
      orderBy: {
        data: 'asc'
      }
    });

    const dadosAgregados = {
      porFaixaEtaria: await prisma.dashboard.groupBy({
        by: ['faixaEtaria'],
        where: whereClause,
        _sum: {
          quantidadeTaxa: true,
          totalTaxa: true
        }
      }),
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
        data: item.data,
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