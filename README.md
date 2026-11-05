# A Gente Tenta

Site para organizar resenha com os amigos sem aquela confusão no grupo do WhatsApp.

**[Abrir o site](https://v0-a-gente-tenta.vercel.app)**

1. Cria a resenha com data, horário, local e descrição
2. Manda o link para a galera
3. O pessoal confirma presença e comenta

Dá para juntar várias resenhas numa coleção e gerenciar tudo pelo painel de administrador.

Feito com Next.js, TypeScript e Supabase.

## Rodar local

```bash
cp .env.example .env.local   # preencha as chaves do Supabase
npm install
npm run dev
```

As tabelas estão em `scripts/`.
