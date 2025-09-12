#!/bin/sh
set -e

echo "===== Installing CocoaPods ====="
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods

echo "===== Installing Node.js ====="
brew install node@21

echo "===== Installing yarn ====="
brew install yarn

# Verify installations
echo "Node version: $(node -v)"
echo "Yarn version: $(yarn -v)"
echo "CocoaPods version: $(pod --version)"

# Install dependencies
echo "===== Running yarn install ====="
yarn install

echo "===== Running pod install ====="
cd ios
pod install

# Verify pod installation
echo "===== Verifying installation ====="
if [ ! -f "EMOMHIITTimer.xcworkspace" ]; then
  echo "❌ Workspace not found!"
  exit 1
fi

if [ ! -d "Pods" ]; then
  echo "❌ Pods directory not found!"
  exit 1
fi

echo "✅ Installation complete!"
