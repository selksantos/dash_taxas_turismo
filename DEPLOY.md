# Instruções de Deploy

## Pré-requisitos
- Docker e Docker Compose instalados
- Git instalado

## Passos para Deploy

### 1. Clonar o repositório
```bash
git clone https://github.com/selksantos/dash_taxas_turismo.git
cd dash_taxas_turismo
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `DATABASE_URL`: String de conexão com o PostgreSQL
- `PATH_PORTAL`: Path portal da prefeitura (ex: ilha-grande-pi)

### 3. Subir os containers

#### Opção A: Usando banco de dados externo
Se você já tem um banco PostgreSQL configurado:
```bash
docker build -t dash-taxas-turismo .
docker run -d --name dash-taxas-turismo -p 3000:3000 --env-file .env dash-taxas-turismo
```

#### Opção B: Usando Docker Compose (inclui banco local)
```bash
docker-compose up -d
```

### 4. Inicialização do banco (apenas primeira vez)

Se o banco ainda não tem as tabelas criadas, elas serão criadas automaticamente pelo entrypoint.

Para popular a tabela Prefeitura e vincular os dados existentes:
```bash
# Acessar o container
docker exec -it dash-taxas-turismo sh

# Executar scripts de inicialização
node prisma/seed-prefeitura.js
node prisma/execute-update-prefeitura-id.js
```

## Verificação

Acesse http://localhost:3000 para verificar se o dashboard está funcionando.

## Comandos úteis

```bash
# Ver logs
docker logs dash-taxas-turismo

# Parar containers
docker-compose down

# Reconstruir imagem
docker-compose build --no-cache

# Acessar container
docker exec -it dash-taxas-turismo sh
```