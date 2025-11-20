import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

console.log('🚀 Starting Offensive Security Quiz Setup...\n');

// Check if node_modules exists
const hasRootDeps = existsSync(join(__dirname, 'node_modules'));
const hasClientDeps = existsSync(join(__dirname, 'client', 'node_modules'));
const hasClientBuild = existsSync(join(__dirname, 'client', 'dist'));

async function runCommand(command, args, cwd = __dirname) {
  return new Promise((resolve, reject) => {
    console.log(`📦 Running: ${command} ${args.join(' ')}`);
    const proc = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function setup() {
  try {
    // Install root dependencies
    if (!hasRootDeps) {
      console.log('📥 Installing root dependencies...\n');
      await runCommand('npm', ['install']);
    } else {
      console.log('✅ Root dependencies already installed\n');
    }

    // Install client dependencies
    if (!hasClientDeps) {
      console.log('📥 Installing client dependencies...\n');
      await runCommand('npm', ['install'], join(__dirname, 'client'));
    } else {
      console.log('✅ Client dependencies already installed\n');
    }

    // Build client
    if (!hasClientBuild) {
      console.log('🔨 Building client application...\n');
      await runCommand('npm', ['run', 'build'], join(__dirname, 'client'));
    } else {
      console.log('✅ Client build already exists\n');
    }

    // Start server
    console.log(`\n🎮 Starting server on port ${PORT}...\n`);
    console.log(`🌐 Open your browser to: http://localhost:${PORT}\n`);
    
    const serverProc = spawn('node', ['server/index.js'], {
      cwd: __dirname,
      stdio: 'inherit',
      env: { ...process.env, PORT }
    });

    serverProc.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
      process.exit(code);
    });

    // Auto-open browser after a short delay
    setTimeout(() => {
      const openCmd = process.platform === 'win32' ? 'start' : 
                      process.platform === 'darwin' ? 'open' : 'xdg-open';
      spawn(openCmd, [`http://localhost:${PORT}`], { shell: true, detached: true });
    }, 2000);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
