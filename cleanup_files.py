#!/usr/bin/env python3
"""
Cleanup unnecessary files from the Offensive Security Escape Room project
"""
import os
import sys

os.chdir('/workspaces/offensive_sec_quiz_2')

# Files to remove
unnecessary_files = [
    '00_START_HERE.md',
    'API_DOCUMENTATION.md',
    'API_REFERENCE.md',
    'API_TESTING.md',
    'API_VERIFICATION_REPORT.md',
    'ARCHITECTURE.md',
    'COMPLETE_CHECKLIST.md',
    'COMPLETION_REPORT.md',
    'CONTRIBUTING.md',
    'DEPLOYMENT.md',
    'DEPLOYMENT_GUIDE.md',
    'DOCUMENTATION_COMPLETE.md',
    'ERROR_PREVENTION_GUIDE.md',
    'EVERYTHING_READY.md',
    'EXECUTIVE_SUMMARY.md',
    'FILES_CREATED.md',
    'FINAL_CHECKLIST.md',
    'FINAL_IMPROVEMENTS.md',
    'FINAL_STATUS.md',
    'FINAL_VERIFICATION.txt',
    'IMPLEMENTATION_COMPLETE.md',
    'IMPLEMENTATION_VERIFICATION.md',
    'INSTALLATION_CHECKLIST.md',
    'LAUNCH_README.md',
    'MAIN_DOCUMENTATION_INDEX.md',
    'MAIN_IMPLEMENTATION_COMPLETE.md',
    'MAIN_JS_README.md',
    'MAIN_LAUNCHER_GUIDE.md',
    'NEXT_STEPS.md',
    'PRODUCTION_MASTER_GUIDE.md',
    'PRODUCTION_READY_SUMMARY.md',
    'PROJECT_COMPLETION.md',
    'QUICK_LAUNCH_CHECKLIST.md',
    'QUICK_REFERENCE.md',
    'QUICK_RUN.md',
    'QUICK_START.md',
    'README_NEW.md',
    'RESOLUTION_SUMMARY.md',
    'START_HERE_NOW.md',
    'START_WITH_MAIN_JS.md',
    'SUMMARY.md',
    'TESTING.md',
    'TRANSFORMATION_COMPLETE.md',
    'VISUAL_SUMMARY.md',
    'final-check.sh',
    'quick-launch.sh',
    'setup-quick.sh',
    'setup.sh',
    'start.sh',
    'validate.sh',
    'launch.sh',
    'cleanup.sh',
]

removed = 0
for file in unnecessary_files:
    if os.path.exists(file):
        try:
            os.remove(file)
            print(f"✓ Removed: {file}")
            removed += 1
        except Exception as e:
            print(f"✗ Failed to remove {file}: {e}")

print(f"\n✓ Successfully removed {removed} unnecessary files")
