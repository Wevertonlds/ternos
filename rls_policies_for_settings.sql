-- 1. Habilita a Segurança a Nível de Linha (RLS) na tabela de configurações.
alter table public.settings enable row level security;

-- 2. Cria uma regra para permitir que QUALQUER UM leia as configurações.
-- Isso é seguro para informações públicas como o nome do site.
create policy "Allow public read access to settings"
on public.settings for select
using ( true );

-- 3. Cria uma regra para permitir que APENAS USUÁRIOS LOGADOS (admins) atualizem as configurações.
create policy "Allow authenticated users to update settings"
on public.settings for update
using ( auth.role() = 'authenticated' )
with check ( auth.role() = 'authenticated' );

-- 4. Cria uma regra para permitir que APENAS USUÁRIOS LOGADOS (admins) insiram as configurações.
-- Necessário para a primeira vez que as configurações são salvas.
create policy "Allow authenticated users to insert settings"
on public.settings for insert
with check ( auth.role() = 'authenticated' );