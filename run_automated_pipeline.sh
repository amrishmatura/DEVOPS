#!/usr/bin/env bash
# DIT University CSN-452 DevOps - Automated Pipeline Runner
set -e

echo "=== [JENKINS AUTOMATION] Executing Pipeline (Build #3 Benchmark) ==="
cd deployment-comparison

echo "[Stage 1: Install Dependencies]"
node -v
npm -v
npm install

echo "[Stage 2: Deploy Application]"
nohup node server.js > app.log 2>&1 &

echo "[Stage 3: Verify Deployment]"
for i in 1 2 3 4 5; do
  if curl -fsS http://localhost:3000/health; then
    echo "Deployment successful!"
    exit 0
  fi
  sleep 2
done

echo "Deployment failed!"
exit 1
