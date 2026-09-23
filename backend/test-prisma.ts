import { getPrismaClient } from './src/config/database';

async function main() {
  try {
    const prisma = getPrismaClient();
    console.log("Connecting...");
    const user = await prisma.user.findFirst();
    console.log("Success:", user);
  } catch (err) {
    console.error("Error:", JSON.stringify(err, null, 2));
    console.error(err);
  } finally {
    process.exit();
  }
}

main();
