#!/bin/sh
set -e

echo "🚀 [Xcode Cloud] Running post-clone setup script..."

# Set up environment variables
export NODE_ENV=production
export RCT_METRO_PORT=8081

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

# Install Ruby and CocoaPods
echo "💎 Setting up Ruby environment..."
if ! command -v gem >/dev/null 2>&1; then
  echo "Installing Ruby..."
  brew install ruby
fi

echo "📦 Installing CocoaPods..."
if ! command -v pod >/dev/null 2>&1; then
  echo "Installing CocoaPods..."
  gem install cocoapods
else
  echo "✅ CocoaPods already installed"
fi

echo "CocoaPods version: $(pod --version)"

# Clean and install iOS pods
echo "📦 Installing iOS pods..."
cd ios

# Clean previous pod installation
echo "🧹 Cleaning previous pod installation..."
rm -rf Pods
rm -rf Podfile.lock
rm -rf .xcode.env.local

# Install pods with verbose output
echo "📦 Running pod install..."
pod install --repo-update --verbose

# Verify pod installation and workspace
echo "🔍 Verifying pod installation..."
if [ ! -d "Pods" ]; then
  echo "❌ Pods directory not found!"
  exit 1
fi

if [ ! -f "EMOMHIITTimer.xcworkspace" ]; then
  echo "❌ Workspace not found!"
  exit 1
fi

if [ ! -f "Pods/Target Support Files/Pods-EMOMHIITTimer/Pods-EMOMHIITTimer.debug.xcconfig" ]; then
  echo "❌ Debug configuration not found!"
  exit 1
fi

if [ ! -f "Pods/Target Support Files/Pods-EMOMHIITTimer/Pods-EMOMHIITTimer.release.xcconfig" ]; then
  echo "❌ Release configuration not found!"
  exit 1
fi

echo "✅ Pod installation and workspace verified"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
xcodebuild clean -workspace EMOMHIITTimer.xcworkspace -scheme EMOMHIITTimer

cd ..

# Start Metro bundler in background for iOS build
echo "🚀 Starting Metro bundler..."
npx react-native start --reset-cache &
METRO_PID=$!

# Wait for Metro to be ready
echo "⏳ Waiting for Metro bundler to be ready..."
sleep 10

# Store Metro PID for cleanup (will be killed automatically by Xcode Cloud)
echo $METRO_PID > /tmp/metro_pid

echo "✅ Post-clone setup complete!"
