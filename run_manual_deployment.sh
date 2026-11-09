#!/usr/bin/env bash
# DIT University CSN-452 DevOps - Manual Deployment Script
set -e

echo "=== [MANUAL DEPLOYMENT] Initiating Manual Deployment Workflow ==="
cd deployment-comparison
npm install
node server.js
