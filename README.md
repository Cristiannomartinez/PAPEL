# 📄 ConsultWorker - Digital Document & Signature System

O **ConsultWorker** é uma plataforma open-source de alta fidelidade projetada para empresas que precisam realizar consultas formais com seus colaboradores, garantindo validade jurídica interna através de assinaturas digitais e geração de documentos em formato padrão A4 (ISO 216).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)

## 🌟 Principais Funcionalidades

- **Assinatura Digital Nativa**: Campo de assinatura responsivo baseado em HTML5 Canvas.
- **Visualização de Folha A4**: Interface que emula perfeitamente uma folha A4 (210mm x 297mm) com sombras e margens.
- **Otimização para Impressão**: Estilos CSS `@media print` que removem elementos de interface e preservam apenas o documento oficial.
- **Painel Administrativo**: Gestão centralizada de todas as respostas coletadas.
- **Conformidade em PDF**: Permite salvar como PDF através do diálogo de impressão nativo do navegador.

## 🚀 Como Publicar

### No Vercel / Netlify
Como este projeto utiliza módulos ES6 nativos e Tailwind CSS via CDN, o deploy é instantâneo:
1. Conecte seu repositório GitHub.
2. Defina o diretório raiz como build folder (ou simplesmente deixe o padrão).
3. Publique!

### No GitHub Pages
Certifique-se de configurar o roteamento para lidar com SPAs se adicionar rotas complexas.

## 🛠️ Tecnologias
- **React 19**
- **Tailwind CSS** (UI Moderna)
- **Lucide Icons** (Ícones Profissionais)
- **LocalStorage API** (Persistência sem banco de dados)

## 📝 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para clonar e adaptar para sua organização.
