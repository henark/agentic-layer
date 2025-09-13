"""
Este módulo fornece um wrapper genérico para clientes de LLM.

Ele abstrai as diferenças entre as APIs de provedores como OpenAI,
Anthropic, etc., oferecendo uma interface unificada.
"""
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente de um arquivo .env
load_dotenv()


class LlmClient:
    """Um cliente genérico para interagir com diferentes LLMs."""

    def __init__(self, provider: str = "openai"):
        self.provider = provider
        self.api_key = os.getenv(f"{provider.upper()}_API_KEY")
        if not self.api_key:
            print(f"Atenção: {provider.upper()}_API_KEY não encontrada no ambiente.")

    async def generate_text(self, prompt: str, model: str = "default") -> str:
        """
        Gera texto usando o provedor de LLM configurado.
        NOTA: Esta é uma implementação de esqueleto (stub).
        """
        print(f"Chamando LLM ({self.provider}, modelo: {model}) com o prompt: '{prompt[:50]}...'")

        # Simulação de chamada de API
        if self.provider == "openai":
            return f"Resposta simulada da OpenAI para o modelo {model}."
        elif self.provider == "anthropic":
            return f"Resposta simulada da Anthropic para o modelo {model}."
        else:
            return "Provedor de LLM não suportado ou simulado."
