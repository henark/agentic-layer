# Camada Agentic (Agentic Layer)

[![CI](https://github.com/example/agentic-layer/actions/workflows/ci.yml/badge.svg)](https://github.com/example/agentic-layer/actions/workflows/ci.yml)
[![Python Version](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Uma arquitetura modular e extensível para construir, orquestrar e gerenciar agentes autônomos.

## Visão Geral

A Camada Agentic abstrai as complexidades da interação com Modelos de Linguagem Grandes (LLMs), gerenciamento de estado e execução de tarefas. Ela permite que os desenvolvedores se concentrem na lógica de negócios e na inteligência do agente.

A arquitetura é composta por seis módulos principais:
- **Planner**: Transforma a intenção do usuário em um plano de execução.
- **Executor**: Executa cada etapa do plano.
- **Cache**: Armazena resultados para otimização.
- **Reflector**: Analisa os resultados para otimizar planos futuros (Fase 2).
- **Governor**: Aplica regras de governança e segurança (Fase 2).
- **Orchestrator**: Gerencia o fluxo de ponta a ponta (Fase 2).

Para mais detalhes, consulte a [Especificação Técnica](./docs/Agentic-Layer-Spec.md).

## Getting Started

### Pré-requisitos

- Python 3.11+
- [Poetry](https://python-poetry.org/docs/#installation) para gerenciamento de dependências.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/path/to/your/repo/agentic-layer.git
    cd agentic-layer
    ```

2.  **Crie um ambiente virtual e instale as dependências:**
    Poetry irá criar um ambiente virtual automaticamente.
    ```bash
    poetry install
    ```

3.  **Configure suas chaves de API (opcional):**
    Crie um arquivo `.env` na raiz do projeto para armazenar suas chaves de API de LLM.
    ```
    OPENAI_API_KEY="sk-..."
    ANTHROPIC_API_KEY="..."
    ```

### Uso Básico

Para executar o fluxo principal, você pode usar o shell do Poetry para garantir que está usando o ambiente virtual correto.

```bash
poetry run python -c "
import asyncio
from src.agentic.planner import LLMPlanner
from src.agentic.executor import BasicExecutor
from src.agentic.cache import InMemoryCache

async def main():
    # 1. Inicializar os componentes
    planner = LLMPlanner()
    cache = InMemoryCache()
    executor = BasicExecutor()

    # 2. Definir uma intenção
    intent = 'Resuma as principais notícias sobre inteligência artificial de hoje.'

    # 3. Criar um plano
    plan = await planner.create_plan(intent)
    print(f'Plano Gerado: {plan}')

    # 4. Executar o plano
    results = []
    for step in plan:
        result = await executor.run_step(step, cache)
        results.append(result)

    print(f'Resultados da Execução: {results}')

if __name__ == '__main__':
    asyncio.run(main())
"
```

## Estrutura do Repositório

```
agentic-layer/
├─ .github/workflows/ci.yml
├─ docs/
│   └─ Agentic-Layer-Spec.md
├─ src/
│   ├─ agentic/
│   │   ├─ planner.py
│   │   └─ ...
│   └─ utils/
├─ tests/
├─ pyproject.toml
├─ Dockerfile
└─ README.md
```
