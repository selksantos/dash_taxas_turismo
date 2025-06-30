-- Script SQL para preencher o campo prefeitura_id na tabela Dashboard
-- com o id da prefeitura existente

-- Atualizar todos os registros do Dashboard que têm prefeitura_id NULL
-- para ter prefeitura_id = 1 (Prefeitura de Ilha Grande)
UPDATE dashboard 
SET prefeitura_id = 1
WHERE prefeitura_id IS NULL;

-- Verificar quantos registros foram atualizados
-- SELECT COUNT(*) FROM dashboard WHERE prefeitura_id = 1;

-- Verificar se ainda existem registros sem prefeitura_id
-- SELECT COUNT(*) FROM dashboard WHERE prefeitura_id IS NULL;