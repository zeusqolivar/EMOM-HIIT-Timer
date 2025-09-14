#!/bin/zsh
set -e

echo "===== Starting CI Post-Clone Script ====="

# Resolve repo root regardless of where this script is invoked from
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

echo "Working directory: $(pwd)"

# Set Homebrew environment variables to prevent issues
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE 
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_ANALYTICS=1

echo "===== Installing toolchain ====="

# Install CocoaPods
if ! command -v pod >/dev/null 2>&1; then
  echo "Installing CocoaPods..."
  brew install cocoapods
else
  echo "CocoaPods already installed: $(pod --version)"
fi

# Install Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js..."
  brew install node
else
  echo "Node.js already installed: $(node -v)"
fi

# Install Yarn
if ! command -v yarn >/dev/null 2>&1; then
  echo "Installing Yarn..."
  brew install yarn
else
  echo "Yarn already installed: $(yarn -v)"
fi

# Ensure tools are in PATH
export PATH="/opt/homebrew/bin:/usr/local/bin:/opt/homebrew/opt/node/bin:/usr/local/opt/node/bin:$PATH"

# Verify all tools are available
echo "===== Verifying installations ====="
echo "Node: $(node -v 2>/dev/null || echo 'NOT FOUND')"
echo "Yarn: $(yarn -v 2>/dev/null || echo 'NOT FOUND')"
echo "CocoaPods: $(pod --version 2>/dev/null || echo 'NOT FOUND')"

# Check for required tools
for tool in node yarn pod; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "ERROR: $tool not found in PATH"
    echo "Current PATH: $PATH"
    exit 1
  fi
done

echo "===== Installing JavaScript dependencies ====="
yarn install --frozen-lockfile || {
  echo "Frozen lockfile failed, trying regular install..."
  yarn install
}

echo "===== Installing iOS CocoaPods ====="
cd ios

# Clean up any existing pods
echo "Cleaning up existing Pods..."
rm -rf Pods Podfile.lock

# Update CocoaPods repo
echo "Updating CocoaPods repo..."
pod repo update

# Install pods
echo "Installing CocoaPods dependencies..."
pod install --verbose

# Verify installation
if [ ! -d "Pods" ]; then
  echo "ERROR: Pods directory was not created"
  exit 1
fi

if [ ! -f "*.xcworkspace" ]; then
  echo "WARNING: No .xcworkspace file found"
  ls -la *.xc* || echo "No Xcode project files found"
fi

echo "===== Build preparation completed successfully ====="
echo "Pods installed: $(ls -1 Pods | wc -l | tr -d ' ') directories"
echo "Workspace files: $(ls -1 *.xcworkspace 2>/dev/null || echo 'None found')"