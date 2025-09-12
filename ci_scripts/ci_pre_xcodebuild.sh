#!/bin/sh
set -e

echo "🔧 [Xcode Cloud] Running pre-xcodebuild setup..."

# Set up environment variables
export NODE_ENV=production
export RCT_METRO_PORT=8081

# Clean and prepare for build
echo "🧹 Cleaning previous builds..."
cd ios
xcodebuild clean -workspace EMOMHIITTimer.xcworkspace -scheme EMOMHIITTimer
cd ..

# Start Metro bundler in background for iOS build
echo "🚀 Starting Metro bundler..."
npx react-native start --reset-cache &
METRO_PID=$!

# Wait for Metro to be ready
echo "⏳ Waiting for Metro bundler to be ready..."
sleep 10

# Store Metro PID for cleanup
echo $METRO_PID > /tmp/metro_pid

echo "✅ Pre-xcodebuild setup complete!"
