#!/bin/zsh
set -e

# Function to run commands with timeout
run_with_timeout() {
  local timeout=$1
  shift
  timeout $timeout "$@" || {
    echo "Command timed out after ${timeout}s: $*"
    return 1
  }
}

# Resolve repo root regardless of where this script is invoked from
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

echo "===== Installing toolchain ====="
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE 
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_ANALYTICS=1

# Install CocoaPods with timeout
if ! brew list cocoapods >/dev/null 2>&1; then
  echo "Installing CocoaPods..."
  run_with_timeout 300 brew install cocoapods
else
  echo "CocoaPods already installed"
fi

# Install Node.js with timeout
if ! brew list node >/dev/null 2>&1; then
  echo "Installing Node.js..."
  run_with_timeout 300 brew install node
else
  echo "Node.js already installed"
fi

# Ensure Node is on PATH on Xcode Cloud runners (both Homebrew prefixes)
export PATH="/opt/homebrew/bin:/usr/local/bin:/opt/homebrew/opt/node/bin:/usr/local/opt/node/bin:$PATH"

# Install Yarn with timeout
if ! brew list yarn >/dev/null 2>&1; then
  echo "Installing Yarn..."
  run_with_timeout 300 brew install yarn
else
  echo "Yarn already installed"
fi

# Verify installations
echo "Node: $(node -v || echo 'NOT FOUND')"
echo "Yarn: $(yarn -v || echo 'NOT FOUND')"
echo "CocoaPods: $(pod --version || echo 'NOT FOUND')"

# Fail if any tool is missing
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js not found in PATH"
  exit 1
fi

if ! command -v yarn >/dev/null 2>&1; then
  echo "ERROR: Yarn not found in PATH"
  exit 1
fi

if ! command -v pod >/dev/null 2>&1; then
  echo "ERROR: CocoaPods not found in PATH"
  exit 1
fi

echo "===== Installing JS dependencies ====="
run_with_timeout 600 yarn install --frozen-lockfile || run_with_timeout 600 yarn install

echo "===== Installing iOS Pods ====="
cd ios

# Clean up any existing pods to prevent conflicts
rm -rf Pods Podfile.lock

# Update pod repo with timeout
echo "Updating CocoaPods repo..."
run_with_timeout 300 pod repo update

# Install pods with timeout and better error handling
echo "Installing CocoaPods dependencies..."
run_with_timeout 600 pod install --verbose --clean-install

# Verify pod installation
if [ ! -d "Pods" ]; then
  echo "ERROR: Pods directory not created"
  exit 1
fi

echo "===== Build preparation complete ====="
echo "Workspace: $(ls -la *.xcworkspace 2>/dev/null || echo 'No workspace found')"