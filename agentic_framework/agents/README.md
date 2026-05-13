# Agentic Framework - Agents

This directory contains the definitions and behaviors of the specific intelligent agents in the system.

## Tipos de Agentes Sugeridos para el Sistema
- **TriageAgent**: Agente responsable de clasificar y priorizar las emergencias reportadas.
- **SupportAgent**: Agente orientado a responder preguntas frecuentes y guiar a los usuarios en la plataforma.
- **AnalyticsAgent**: Agente que procesa y unifica reportes múltiples (ej. varios usuarios reportando el mismo incidente).

## Arquitectura de un Agente
Cada agente debe tener:
- Un **Rol** o System Prompt claro.
- Acceso a un conjunto específico de **Skills** (herramientas).
- Un modelo de lenguaje subyacente (definido en `/models`).
