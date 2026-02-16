# Calculadora de IMC

Calculadora de Índice de Massa Corporal feita com **React**, **Vite** e bibliotecas modernas.

## Bibliotecas utilizadas

- **React 18** — biblioteca de interface
- **Vite** — build tool e dev server
- **Chakra UI** — componentes de UI prontos e acessíveis
- **React Hook Form** — gerenciamento de formulários
- **Zod** — validação de schema
- **@hookform/resolvers** — integração Zod + React Hook Form

## Como executar

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Funcionalidades

- Altura (cm), peso (kg) e idade
- Cálculo automático do IMC
- Classificação: Abaixo do peso, Normal, Sobrepeso, Obesidade
- Indicação de quanto emagrecer ou ganhar para o peso ideal
- Validação com mensagens de erro
