#!/bin/bash
cd /workspaces/offensive_sec_quiz_2
echo "======================================"
echo "RUNNING FIX_ALL.js"
echo "======================================"
node FIX_ALL.js
FIX_EXIT=$?
echo ""
echo "======================================"
echo "RUNNING DIAGNOSTIC_TEST.js"
echo "======================================"
node DIAGNOSTIC_TEST.js
TEST_EXIT=$?
echo ""
echo "======================================"
echo "FINAL STATUS"
echo "======================================"
echo "FIX_ALL.js exit code: $FIX_EXIT"
echo "DIAGNOSTIC_TEST.js exit code: $TEST_EXIT"
echo "Checking ports..."
netstat -tulpn 2>/dev/null | grep -E ':(3000|5000)' || echo "Ports 3000 and 5000 are not in use"
