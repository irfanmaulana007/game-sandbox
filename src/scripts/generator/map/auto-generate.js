import { spawn } from 'child_process';

const inputs = [
  '9', // Number of maps
  // '3', // Number of maps

  '', // Map 1 name (random)
  '', // Map 1 description (random)
  '1', // Map 1 min level
  '3', // Map 1 monsters per rank

  '', // Map 2 name (random)
  '', // Map 2 description (random)
  '5', // Map 2 min level
  '4', // Map 2 monsters per rank

  '', // Map 3 name (random)
  '', // Map 3 description (random)
  '10', // Map 3 min level
  '5', // Map 3 monsters per rank

  '', // Map 4 name (random)
  '', // Map 4 description (random)
  '15', // Map 4 min level
  '6', // Map 4 monsters per rank

  '', // Map 5 name (random)
  '', // Map 5 description (random)
  '20', // Map 5 min level
  '7', // Map 5 monsters per rank

  '', // Map 6 name (random)
  '', // Map 6 description (random)
  '25', // Map 6 min level
  '8', // Map 6 monsters per rank

  '', // Map 7 name (random)
  '', // Map 7 description (random)
  '30', // Map 7 min level
  '9', // Map 7 monsters per rank

  '', // Map 8 name (random)
  '', // Map 8 description (random)
  '35', // Map 8 min level9
  '10', // Map 8 monsters per rank

  '', // Map 9 name (random)
  '', // Map 9 description (random)
  '40', // Map 9 min level
  '11', // Map 9 monsters per rank
];

const generator = spawn('npm', ['run', 'generate'], {
  stdio: ['pipe', 'inherit', 'inherit'],
});

// Send inputs one by one with delays
inputs.forEach((input, index) => {
  setTimeout(() => {
    generator.stdin.write(input + '\n');
  }, index * 500);
});

generator.on('close', (code) => {
  console.log(`Generator exited with code ${code}`);
});

generator.on('error', (error) => {
  console.error('Failed to start generator:', error);
  process.exit(1);
});
