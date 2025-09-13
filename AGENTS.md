# AGENTS.md

## Visão Geral do Projeto

Este repositório contém a "Camada Agentic", uma arquitetura modular para construir agentes autônomos em Python. O código-fonte está em `src/agentic`.

## Comandos de Setup e Execução

-   **Instalar dependências:**
    ```bash
    poetry install
    ```
-   **Executar testes:**
    ```bash
    poetry run pytest
    ```
-   **Executar o linter:**
    ```bash
    poetry run ruff check .
    ```
-   **Formatar o código:**
    ```bash
    poetry run ruff format .
    ```

## Estilo de Código

-   O projeto usa `ruff` para linting e formatação. A configuração está em `pyproject.toml`.
-   O código deve ser bem documentado com docstrings.
-   As interfaces principais são definidas como Classes Base Abstratas (ABCs) em `src/agentic/`.

## Considerações Adicionais

-   Para desenvolvimento, chaves de API podem ser adicionadas a um arquivo `.env` na raiz do projeto.
-   Novas dependências devem ser adicionadas usando `poetry add <package>`.
