# Instruções de Deploy

## Pré-requisitos
- Docker e Docker Compose instalados

## Deploy Rápido (Recomendado)

### 1. Clonar o repositório
```bash
git clone https://github.com/selksantos/dash_taxas_turismo.git
cd dash_taxas_turismo
```

### 2. Subir os containers
```bash
docker-compose up -d
```

**Pronto!** O sistema estará disponível em http://localhost:3000

## O que acontece automaticamente:

1. ✅ PostgreSQL é instalado e configurado
2. ✅ Banco de dados `taxas_turismo` é criado
3. ✅ Tabelas são criadas (Prefeitura e Dashboard)
4. ✅ Dados da Prefeitura de Ilha Grande são inseridos
5. ✅ Aplicação Next.js é iniciada

## Configuração

As variáveis de ambiente já estão configuradas no `docker-compose.yml`:
- **DATABASE_URL**: Conexão com PostgreSQL local
- **PATH_PORTAL**: ilha-grande-pi (padrão)

Para alterar, edite o arquivo `docker-compose.yml` antes de subir os containers.

## Comandos úteis

```bash
# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Limpar tudo (incluindo banco de dados)
docker-compose down -v

# Reconstruir após mudanças no código
docker-compose build --no-cache
docker-compose up -d

# Acessar container da aplicação
docker-compose exec app sh

# Acessar banco de dados
docker-compose exec db psql -U admin -d taxas_turismo
```

## Estrutura dos Containers

- **db**: PostgreSQL 15 (porta interna 5432)
- **app**: Aplicação Next.js (porta 3000)