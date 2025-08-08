#!/bin/bash

set -euo pipefail

echo "Updating Terraform provider lock file for multiple platforms..."

terraform providers lock \
  -platform=windows_amd64 \
  -platform=darwin_amd64 \
  -platform=linux_amd64 \
  -platform=darwin_arm64 \
  -platform=linux_arm64

echo ".terraform.lock.hcl has been updated successfully."
