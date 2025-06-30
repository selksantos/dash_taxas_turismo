#!/bin/sh

echo " Aguardando banco de dados..."
# Loop até o banco estar pronto
while ! nc -z db 5432; do
  echo " Banco ainda não está pronto..."
  sleep 2
done

echo " Banco de dados está pronto!"
sleep 2

echo " Gerando cliente Prisma..."
npx prisma generate

echo " Aplicando schema no banco..."
npx prisma db push --skip-generate

echo " Executando seed inicial..."
node prisma/seed.js

echo " Iniciando aplicação..."
exec "$@"