#!/usr/bin/env bash

cd "$(dirname "$0")" || exit 1

PORT=8000

if command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
elif command -v python >/dev/null 2>&1; then
  PYTHON=python
else
  echo "Python not found. Please install python 3 and try again"
  exit 1
fi

PYTHON_VERSION=$($PYTHON - <<'EOF'
import sys
print(sys.version_info.major)
EOF
)

if [ "$PYTHON_VERSION" -ne 3 ]; then
  echo "Need python version 3. Found $PYTHON_VERSION"
  exit 1
fi

echo "Try Hungry Tree Friends via link http://localhost:$PORT/game"

$PYTHON -m http.server $PORT
