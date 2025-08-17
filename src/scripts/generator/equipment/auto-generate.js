import { spawn } from 'child_process';

console.log('🎮 Auto-generating equipment data...');

const generator = spawn(
  'npx',
  ['tsx', 'src/scripts/generator/equipment/index.ts'],
  {
    stdio: 'inherit',
  }
);

generator.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Equipment generation completed successfully!');
  } else {
    console.error(`❌ Equipment generation failed with code ${code}`);
    process.exit(1);
  }
});

generator.on('error', (error) => {
  console.error('Failed to start equipment generator:', error);
  process.exit(1);
});
