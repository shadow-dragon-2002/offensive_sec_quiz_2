#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filesToRemove = [
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
  'README_QUICK.md',
  'RESOLUTION_SUMMARY.md',
  'START_HERE_NOW.md',
  'START_WITH_MAIN_JS.md',
  'SUMMARY.md',
  'TESTING.md',
  'TRANSFORMATION_COMPLETE.md',
  'VISUAL_SUMMARY.md',
  'cleanup.sh',
  'cleanup_files.py',
  'final-check.sh',
  'launch.sh',
  'quick-launch.sh',
  'setup.sh',
  'setup-quick.sh',
  'start.sh',
  'validate.sh',
  'do_cleanup.sh'
];

const projectRoot = __dirname;
let removed = 0;
let failed = 0;

console.log('\n🗑️  Starting cleanup of unnecessary files...\n');

filesToRemove.forEach(file => {
  const filePath = path.join(projectRoot, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✓ Removed: ${file}`);
      removed++;
    }
  } catch (err) {
    console.log(`✗ Failed to remove ${file}: ${err.message}`);
    failed++;
  }
});

console.log('\n========================================');
console.log(`✓ Cleanup complete!`);
console.log(`  - Files removed: ${removed}`);
console.log(`  - Files failed: ${failed}`);
console.log('========================================\n');

console.log('📋 Essential files retained:');
const essentialFiles = [
  'README.md',
  'main.js',
  'package.json',
  'docker-compose.yml',
  'LAUNCH_INSTRUCTIONS.md',
  'STARTUP_GUIDE.md',
  'COMPREHENSIVE_SETUP.md',
  'QUICK_REFERENCE.txt',
  'PROJECT_COMPLETE.md',
  'IMPLEMENTATION_SUMMARY.md',
  'DOCUMENTATION_INDEX.md',
  'TROUBLESHOOTING.md',
  'verify-startup.js',
  'pre-launch-check.js',
  'error-recovery.js'
];

essentialFiles.forEach(f => console.log(`  ✓ ${f}`));
console.log('  ✓ backend/ (source code)');
console.log('  ✓ frontend/ (source code)');
console.log('\n🚀 Ready to launch with: node main.js\n');
