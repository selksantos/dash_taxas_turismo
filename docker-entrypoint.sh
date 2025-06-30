#!/bin/sh

echo "Aguardando banco de dados..."
sleep 5

echo "Gerando cliente Prisma..."
npx prisma generate

echo "Aplicando migrations/schema..."
npx prisma db push --skip-generate

echo "Iniciando aplicação..."
exec "$@"