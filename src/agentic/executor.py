"""Este módulo define a interface para o Executor e uma implementação inicial."""

from abc import ABC, abstractmethod
from typing import Any, Dict

# Importar a interface do Cache para type hinting
from .cache import Cache


class Executor(ABC):
    """Executa cada passo do plano e devolve os resultados."""

    @abstractmethod
    async def run_step(self, step: Dict[str, Any], cache: Cache) -> Any:
        """
        Executa um único passo de um plano.

        Args:
            step (Dict[str, Any]): O dicionário do passo a ser executado.
            cache (Cache): A instância do cache para consulta e armazenamento.

        Returns:
            Any: O resultado da execução do passo.
        """
        pass


class BasicExecutor(Executor):
    """
    Uma implementação básica do Executor.
    NOTA: Esta é uma implementação de esqueleto (stub).
    """

    async def run_step(self, step: Dict[str, Any], cache: Cache) -> Any:
        """
        Simula a execução de um passo. A implementação real lidaria com
        diferentes tipos de ações e interagiria com ferramentas externas.
        """
        step_id = step.get("id", "unknown_step")
        action = step.get("action", "unknown_action")

        # Gerar uma chave de cache simples (a real seria um hash mais robusto)
        cache_key = f"{step_id}:{action}"

        # 1. Verificar cache
        cached_result = await cache.get(cache_key)
        if cached_result:
            print(f"Resultado para o passo '{step_id}' encontrado no cache.")
            return cached_result

        # 2. Executar a ação (simulação)
        print(f"Executando o passo '{step_id}' com a ação '{action}'...")
        result = f"Resultado simulado para a ação '{action}'"

        # 3. Armazenar no cache
        await cache.set(cache_key, result)
        print(f"Resultado para o passo '{step_id}' armazenado no cache.")

        return result
