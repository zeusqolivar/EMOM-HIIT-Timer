#!/bin/sh
set -e

echo "🚀 [Xcode Cloud] Running post-clone setup script..."

# Install Node.js
if brew list node@18 >/dev/null 2>&1; then
  echo "✅ Node.js already installed"
else
  echo "📦 Installing Node.js 18..."
  brew install node@18
fi
brew link --overwrite node@18

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install Yarn
if ! command -v yarn >/dev/null 2>&1; then
  echo "📦 Installing Yarn..."
  npm install --global yarn
else
  echo "✅ Yarn already installed"
fi

echo "Yarn version: $(yarn -v)"

# Install JS dependencies
echo "📦 Installing JS dependencies..."
yarn install --frozen-lockfile

# Install CocoaPods
echo "📦 Installing iOS pods..."
cd ios
pod install --repo-update
cd ..

echo "✅ Post-clone setup complete!"
