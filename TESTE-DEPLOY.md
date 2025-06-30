# Guia de Teste do Deploy

## Pré-requisitos
- Docker instalado
- Docker Compose instalado
- Git instalado

## Passo a Passo do Teste

### 1. Criar diretório de teste
```bash
mkdir ~/teste-dashboard
cd ~/teste-dashboard
```

### 2. Clonar o repositório
```bash
git clone https://github.com/selksantos/dash_taxas_turismo.git
cd dash_taxas_turismo
```

### 3. Verificar branch correto
```bash
git checkout feature/multiprefeitura
```

### 4. Subir os containers
```bash
docker compose up -d
```

### 5. Acompanhar os logs (opcional)
```bash
# Ver logs de inicialização
docker compose logs -f

# Ou ver logs só da aplicação
docker compose logs -f app
```

### 6. Aguardar inicialização
Aguarde cerca de 30-60 segundos para:
- Banco de dados iniciar
- Tabelas serem criadas
- Aplicação compilar e iniciar

### 7. Verificar se containers estão rodando
```bash
docker compose ps
```

Deve mostrar:
- `dash_taxas_turismo-db-1` - Status: healthy
- `dash_taxas_turismo-app-1` - Status: running

### 8. Testar a aplicação
Abra o navegador em: http://localhost:3000

### 9. Verificar o banco de dados (opcional)
```bash
# Acessar o PostgreSQL
docker compose exec db psql -U admin -d taxas_turismo

# Comandos SQL para verificar:
\dt                    # Listar tabelas
SELECT * FROM "Prefeitura";  # Ver prefeitura cadastrada
SELECT COUNT(*) FROM "Dashboard";  # Verificar se está vazio (0 registros)
\q                     # Sair
```

### 10. Testar a API
```bash
# Testar endpoint da API
curl http://localhost:3000/api/taxas

# Ou com path_portal específico
curl "http://localhost:3000/api/taxas?path_portal=ilha-grande-pi"
```

## Resultado Esperado

✅ **Containers rodando**: db e app ativos  
✅ **Dashboard acessível**: http://localhost:3000  
✅ **Banco de dados**: Tabelas criadas  
✅ **Prefeitura cadastrada**: Ilha Grande  
✅ **API respondendo**: JSON com estrutura vazia  
⚠️ **Dashboard vazio**: Normal, sem dados mockados  

## Comandos Úteis

### Ver logs em tempo real
```bash
docker compose logs -f
```

### Parar os containers
```bash
docker compose down
```

### Limpar tudo (incluindo banco)
```bash
docker compose down -v
```

### Reconstruir do zero
```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

### Verificar uso de recursos
```bash
docker stats
```

## Troubleshooting

### Erro: "port 3000 already in use"
```bash
# Verificar o que está usando a porta
lsof -i :3000
# Ou mudar a porta no docker-compose.yml
```

### Erro: "Cannot connect to database"
```bash
# Verificar se o container db está healthy
docker compose ps
# Reiniciar containers
docker compose restart
```

### Aplicação não inicia
```bash
# Ver logs detalhados
docker compose logs app
# Verificar se o build foi bem sucedido
docker compose build
```

## Limpeza após teste
```bash
cd ~
docker compose -f ~/teste-dashboard/dash_taxas_turismo/docker-compose.yml down -v
rm -rf ~/teste-dashboard
```