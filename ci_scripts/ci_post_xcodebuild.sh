#!/bin/sh
set -e

echo "🏁 [Xcode Cloud] Running post-xcodebuild cleanup..."

# Kill Metro bundler if it's still running
if [ -f /tmp/metro_pid ]; then
    METRO_PID=$(cat /tmp/metro_pid)
    if ps -p $METRO_PID > /dev/null; then
        echo "🛑 Stopping Metro bundler..."
        kill $METRO_PID
    fi
    rm -f /tmp/metro_pid
fi

# Clean up any remaining Metro processes
pkill -f "react-native start" || true

echo "✅ Post-xcodebuild cleanup complete!"
