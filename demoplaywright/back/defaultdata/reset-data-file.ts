
// scripts/reset-user-dir.ts
// Behavior:
//   Empties ../back/files/user1 and copies ./person.json into ./user1 (relative paths).

import { resetUserDir } from '../src/resetUserDir';



async function main(): Promise<void> {
  const info = await resetUserDir();
  console.log('✅ Reset completed:', info);
}

main().catch((err) => {
  console.error('❌ Reset failed:', err);
  process.exit(1);
});
