# Agentic Framework - Models

This directory is intended to contain the configuration, definitions, and adapters for the different Language Models (LLMs) used in the ecosystem.

## Estructura Recomendada
- `openai.config.ts`: Configuración para modelos de OpenAI.
- `anthropic.config.ts`: Configuración para modelos de Anthropic (Claude).
- `gemini.config.ts`: Configuración para modelos de Google (Gemini).
- `/adapters`: Interfaces estandarizadas para que los agentes puedan interactuar con cualquier modelo sin acoplarse a su API específica.
