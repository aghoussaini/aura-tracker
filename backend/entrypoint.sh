#!/bin/sh
set -e

echo "Running database migrations..."
python -m flask db upgrade

echo "Starting Flask application..."
exec python app.py
