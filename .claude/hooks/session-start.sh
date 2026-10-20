#!/bin/bash
set -euo pipefail

# Solo en sesiones remotas (nube)
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Instala MarkItDown (Microsoft) si no está disponible; idempotente
if ! command -v markitdown >/dev/null 2>&1; then
  pip install --quiet 'markitdown[all]'
fi
