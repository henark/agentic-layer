"""Testes para o módulo Cache."""

import asyncio
import time

import pytest
from src.agentic.cache import InMemoryCache


@pytest.fixture
def cache():
    """Fornece uma instância de InMemoryCache para cada teste."""
    return InMemoryCache()


@pytest.mark.asyncio
async def test_cache_set_get(cache: InMemoryCache):
    """Testa a definição e obtenção de um item no cache."""
    await cache.set("key1", "value1")
    result = await cache.get("key1")
    assert result == "value1"


@pytest.mark.asyncio
async def test_cache_get_miss(cache: InMemoryCache):
    """Testa a obtenção de um item que não existe no cache."""
    result = await cache.get("non_existent_key")
    assert result is None


@pytest.mark.asyncio
async def test_cache_overwrite(cache: InMemoryCache):
    """Testa a sobrescrita de um valor existente no cache."""
    await cache.set("key1", "value1")
    await cache.set("key1", "value2")
    result = await cache.get("key1")
    assert result == "value2"


@pytest.mark.asyncio
async def test_cache_ttl_expiration(cache: InMemoryCache):
    """Testa se um item do cache expira após o TTL."""
    await cache.set("key1", "value1", ttl=1)
    # Aguarda o item expirar
    await asyncio.sleep(1.1)
    result = await cache.get("key1")
    assert result is None


@pytest.mark.asyncio
async def test_cache_ttl_no_expiration(cache: InMemoryCache):
    """Testa se um item do cache não expira antes do TTL."""
    await cache.set("key1", "value1", ttl=2)
    await asyncio.sleep(1)
    result = await cache.get("key1")
    assert result == "value1"
