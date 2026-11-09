#!/usr/bin/env bash
# ==============================================================================
# SCRIPT: manual_deploy_checklist.sh
# PURPOSE: Demonstrates the legacy manual runbook process for production releases.
#
# DOWNSIDES OBSERVED IN THE COMPARATIVE STUDY:
# 1. Deployment Time: Takes 45 - 90 minutes.
# 2. Human Effort: Requires active attention from 2-3 engineers.
# 3. Error Rate: 26.8% risk of human typo or configuration omission.
# 4. Failure Frequency: 18.5% of manual releases result in production downtime.
# 5. Recovery Time (MTTR): 50 - 120 minutes to triage, rollback git, and restore DB.
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo " MANUAL PRODUCTION DEPLOYMENT CHECKLIST                   "
echo " (High-Risk, Human-Assisted Procedure)                   "
echo "=========================================================="

read -p "Step 1: Have you notified the team on Slack that deployment is starting? (y/n): " ans
[[ "$ans" != "y" ]] && exit 1

read -p "Step 2: Have you taken a manual database snapshot? (y/n): " ans
[[ "$ans" != "y" ]] && exit 1

read -p "Step 3: Enter the target production server IP: " server_ip
read -p "Step 4: Enter the Git Release Tag (e.g., v2.4.0): " release_tag

echo "Connecting to $server_ip via SSH..."
ssh -o BatchMode=no deploy@"$server_ip" << EOF
  echo "[SSH] Navigating to application root..."
  cd /var/www/application

  echo "[SSH] Fetching remote tags..."
  git fetch --tags

  echo "[SSH] Checking out $release_tag..."
  git checkout "$release_tag"

  echo "[SSH] Installing dependencies (High latency)..."
  npm install --production

  echo "[SSH] Running database migration script..."
  npm run db:migrate

  echo "[SSH] Compiling static frontend bundles..."
  npm run build

  echo "[SSH] Restarting application service..."
  sudo systemctl restart webapp.service

  echo "[SSH] Reloading Nginx..."
  sudo systemctl reload nginx
EOF

echo "Step 5: Please open your browser, perform smoke tests, and check error logs."
echo "If any 500 error occurs, you must manually SSH back in and perform a git checkout rollback."
