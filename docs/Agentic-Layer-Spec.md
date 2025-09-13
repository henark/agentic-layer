# Especificação Técnica: Camada Agentic (Agentic Layer)

## 1. Visão Geral

A Camada Agentic é uma arquitetura modular e extensível projetada para construir, orquestrar e gerenciar agentes autônomos. Ela abstrai as complexidades da interação com Modelos de Linguagem Grandes (LLMs), gerenciamento de estado e execução de tarefas, permitindo que os desenvolvedores se concentrem na lógica de negócios e na inteligência do agente.

A arquitetura é composta por seis módulos principais:

-   **Planner**: Transforma a intenção do usuário em um plano de execução estruturado.
-   **Executor**: Executa cada etapa do plano, interagindo com LLMs ou ferramentas externas.
-   **Cache (Memory)**: Armazena e recupera resultados intermediários para otimizar a performance e garantir a consistência.
-   **Reflector**: Analisa os resultados da execução para aprender e otimizar planos futuros. (Fase 2)
-   **Governor**: Aplica regras de governança, segurança e conformidade em todo o processo. (Fase 2)
-   **Orchestrator**: Gerencia o fluxo de ponta a ponta, coordenando todos os outros módulos. (Fase 2)

O MVP inicial foca na implementação do `Planner`, `Executor` e `Cache`.

---

## 2. Contratos de Interface (MVP)

### 2.1. Interface `Planner`

O `Planner` é responsável por decompor um objetivo de alto nível em uma sequência de tarefas atômicas e executáveis.

**Contrato (Interface Abstrata):**

```python
from abc import ABC, abstractmethod
from typing import List, Dict, Any

class Planner(ABC):
    """Transforma uma intenção de alto nível em um plano estruturado."""

    @abstractmethod
    async def create_plan(self, intent: str, context: Dict[str, Any] | None = None) -> List[Dict[str, Any]]:
        """
        Gera um plano de execução com base na intenção do usuário.

        Args:
            intent (str): O objetivo descrito em linguagem natural.
            context (Dict | None): Dados auxiliares, como histórico de conversas ou estado anterior.

        Returns:
            List[Dict[str, Any]]: Uma lista de passos. Cada passo é um dicionário que define uma ação.
        """
        pass
```

**Formato do Passo (Step):**

Cada passo no plano retornado é um dicionário com a seguinte estrutura:

```json
{
    "id": "step-1",
    "action": "call_llm",
    "prompt": "Analise o sentimento do seguinte texto: '...' e retorne 'positivo', 'negativo' ou 'neutro'.",
    "output_key": "sentiment_analysis_result"
}
```

-   `id`: Identificador único para o passo.
-   `action`: Ação a ser executada (ex: `call_llm`, `run_python_code`, `http_get`).
-   `prompt` / `params`: Parâmetros necessários para a ação.
-   `output_key`: Chave para armazenar o resultado no contexto da execução.

### 2.2. Interface `Executor`

O `Executor` processa cada passo do plano, executa a ação correspondente e gerencia o resultado.

**Contrato (Interface Abstrata):**

```python
from abc import ABC, abstractmethod
from typing import Any, Dict

# Forward reference for Cache
class Cache: pass

class Executor(ABC):
    """Executa cada passo do plano e devolve os resultados."""

    @abstractmethod
    async def run_step(self, step: Dict[str, Any], cache: Cache) -> Any:
        """
        Executa um único passo de um plano.

        - Verifica se o resultado já está no cache (chave = hash(step)).
        - Caso não exista, executa a ação (ex.: chamada LLM, API externa).
        - Armazena o output no cache e devolve.

        Args:
            step (Dict[str, Any]): O dicionário do passo a ser executado.
            cache (Cache): A instância do cache para consulta e armazenamento.

        Returns:
            Any: O resultado da execução do passo.
        """
        pass
```

### 2.3. Interface `Cache`

O `Cache` fornece um mecanismo de armazenamento chave-valor para persistir os resultados da execução dos passos, evitando recomputação e economizando custos de API.

**Contrato (Interface Abstrata):**

```python
from abc import ABC, abstractmethod
from typing import Any

class Cache(ABC):
    """Interface para armazenamento de resultados em cache."""

    @abstractmethod
    async def get(self, key: str) -> Any | None:
        """Recupera um valor do cache."""
        pass

    @abstractmethod
    async def set(self, key: str, value: Any, ttl: int | None = None) -> None:
        """Armazena um valor no cache com um tempo de vida opcional (TTL) em segundos."""
        pass
```

**Implementações Planejadas:**
-   **MVP:** `SQLiteCache` para desenvolvimento local e simplicidade.
-   **Produção:** `RedisCache` para performance e escalabilidade.

---

## 3. Fluxo de Dados (MVP)

1.  **Entrada do Usuário**: O `Orchestrator` (em uma implementação futura, ou um script de teste no MVP) recebe uma `intent` (ex: "Resuma as notícias de hoje sobre IA").
2.  **Criação do Plano**: A `intent` é enviada ao `Planner.create_plan()`. O `Planner` interage com um LLM para gerar uma lista de passos (JSON).
3.  **Execução do Plano**: O `Orchestrator` itera sobre cada `step` do plano.
4.  **Execução do Passo**: Para cada `step`, o `Orchestrator` chama `Executor.run_step(step, cache)`.
5.  **Cache Check**: O `Executor` primeiro consulta o `Cache` para ver se o resultado para aquele `step` já existe.
6.  **Execução da Ação**: Se não houver cache, o `Executor` executa a ação (ex: chama `utils.llm_client`).
7.  **Armazenamento em Cache**: O resultado da execução é salvo no `Cache` pelo `Executor`.
8.  **Agregação de Resultados**: O `Orchestrator` coleta os resultados de todos os passos.
9.  **Saída Final**: O resultado final é retornado ao usuário.

---

## 4. Módulos Futuros (Fase 2)

-   **Reflector**: Será responsável por analisar o par `(plano, resultado)` para identificar ineficiências ou erros, sugerindo melhorias para o `Planner`.
-   **Governor**: Implementará hooks para verificar conformidade, custos e segurança antes e depois da execução de cada passo.
-   **Orchestrator**: Evoluirá para um componente robusto que gerencia o ciclo de vida completo do agente, incluindo a coordenação entre todos os módulos.
