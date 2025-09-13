"""Testes para o módulo Planner."""

import pytest
from src.agentic.planner import LLMPlanner


@pytest.mark.asyncio
async def test_llm_planner_creaplan():
    """Testa se o LLMPlanner pode ser instanciado e se create_plan funciona."""
    planner = LLMPlanner()
    intent = "Test intent"
    plan = await planner.create_plan(intent)

    assert isinstance(plan, list)
    assert len(plan) > 0
    assert "id" in plan[0]
    assert "action" in plan[0]
