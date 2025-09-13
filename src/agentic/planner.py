"""Este módulo define a interface para o Planner e uma implementação inicial."""

from abc import ABC, abstractmethod
from typing import Any, Dict, List


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


class LLMPlanner(Planner):
    """
    Uma implementação do Planner que usa um LLM para gerar o plano.
    NOTA: Esta é uma implementação de esqueleto (stub).
    """

    async def create_plan(self, intent: str, context: Dict[str, Any] | None = None) -> List[Dict[str, Any]]:
        """
        Gera um plano de exemplo. A implementação real chamaria um LLM.
        """
        print(f"Gerando plano para a intenção: '{intent}'")
        # Exemplo de plano hardcoded para fins de demonstração
        return [
            {
                "id": "step-1",
                "action": "call_llm",
                "prompt": f"Analise a seguinte intenção do usuário e forneça um resumo: '{intent}'",
                "output_key": "summary",
            },
            {
                "id": "step-2",
                "action": "search_web",
                "query": f"Pesquisar informações sobre '{intent}'",
                "output_key": "search_results",
            },
        ]
