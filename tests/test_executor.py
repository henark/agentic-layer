"""Testes para o módulo Executor."""

import pytest
from src.agentic.executor import BasicExecutor
from src.agentic.cache import InMemoryCache


@pytest.mark.asyncio
async def test_basic_executor_run_step():
    """
    Testa se o BasicExecutor pode executar um passo e interagir com o cache.
    """
    # 1. Setup
    executor = BasicExecutor()
    cache = InMemoryCache()
    step = {
        "id": "test_step",
        "action": "test_action",
        "prompt": "Do something.",
    }

    # 2. Primeira execução (deve executar e armazenar no cache)
    result1 = await executor.run_step(step, cache)
    assert "Resultado simulado" in result1
    assert await cache.get("test_step:test_action") is not None

    # 3. Segunda execução (deve retornar do cache)
    # Para verificar se veio do cache, podemos "envenenar" o cache com um valor diferente
    await cache.set("test_step:test_action", "cached_result")
    result2 = await executor.run_step(step, cache)
    assert result2 == "cached_result"
