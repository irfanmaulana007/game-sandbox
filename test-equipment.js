// Simple Node.js test for equipment data
console.log('=== Node.js Equipment Test ===\n');

try {
  // Try to read the file directly
  const fs = await import('fs');
  const path = await import('path');

  const filePath = path.join(
    process.cwd(),
    'src',
    'constants',
    'equipment',
    'index.ts'
  );
  console.log('Reading file:', filePath);

  if (fs.existsSync(filePath)) {
    console.log('✅ File exists');

    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log(`✅ File read successfully (${fileContent.length} characters)`);

    // Count equipment items
    const idMatches = fileContent.match(/id:\s*\d+/g);
    if (idMatches) {
      console.log(`📁 Found ${idMatches.length} equipment items`);

      // Check if EQUIPMENT_DATA is exported
      if (fileContent.includes('export const EQUIPMENT_DATA')) {
        console.log('✅ EQUIPMENT_DATA is exported');
      } else {
        console.log('❌ EQUIPMENT_DATA is not exported');
      }

      // Check array structure
      if (
        fileContent.includes('export const EQUIPMENT_DATA: Equipment[] = [')
      ) {
        console.log('✅ EQUIPMENT_DATA array declaration found');
      } else {
        console.log('❌ EQUIPMENT_DATA array declaration not found');
      }
    } else {
      console.log('❌ No equipment items found in file');
    }
  } else {
    console.log('❌ File does not exist');
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}
