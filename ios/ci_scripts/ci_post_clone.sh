#!/bin/zsh
set -e

# Resolve repo root regardless of where this script is invoked from
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

echo "===== Installing toolchain ====="
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE HOMEBREW_NO_AUTO_UPDATE=1

if ! brew list cocoapods >/dev/null 2>&1; then
  brew install cocoapods
else
  echo "CocoaPods already installed"
fi

if ! brew list node >/dev/null 2>&1; then
  brew install node
else
  echo "Node already installed"
fi
# Ensure Node is on PATH on Xcode Cloud runners (both Homebrew prefixes)
export PATH="/opt/homebrew/opt/node/bin:/usr/local/opt/node/bin:$PATH"

if ! brew list yarn >/dev/null 2>&1; then
  brew install yarn
fi

echo "Node: $(node -v || echo not found)"
echo "Yarn: $(yarn -v || echo not found)"
echo "CocoaPods: $(pod --version || echo not found)"

echo "===== Installing JS dependencies ====="
yarn install --frozen-lockfile || yarn install

echo "===== Installing iOS Pods ====="
cd ios
pod repo update
pod install --verbose