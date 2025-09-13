"""Este módulo define a interface para o Cache e implementações concretas."""

import time
from abc import ABC, abstractmethod
from typing import Any, Dict, NamedTuple


class CacheEntry(NamedTuple):
    """Uma entrada no cache, com valor e tempo de expiração."""

    value: Any
    expires_at: float | None


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


class InMemoryCache(Cache):
    """
    Uma implementação de cache em memória simples.
    Ótima para testes e desenvolvimento local.
    """

    def __init__(self) -> None:
        self._cache: Dict[str, CacheEntry] = {}

    async def get(self, key: str) -> Any | None:
        """Recupera um item do cache, respeitando o TTL."""
        entry = self._cache.get(key)
        if not entry:
            return None

        if entry.expires_at is not None and time.time() > entry.expires_at:
            # A entrada expirou, remova-a
            del self._cache[key]
            return None

        return entry.value

    async def set(self, key: str, value: Any, ttl: int | None = None) -> None:
        """Define um item no cache com um TTL opcional."""
        expires_at = time.time() + ttl if ttl is not None else None
        self._cache[key] = CacheEntry(value=value, expires_at=expires_at)
