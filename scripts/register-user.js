// scripts/register-user.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function registerUser(email, password, name) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error('User with this email already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        role: 'user',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'REGISTER',
        userId: user.id,
        details: 'User registration via script',
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log('User registered successfully:');
    console.log(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const email = args[0];
const password = args[1];
const name = args[2];

if (!email || !password) {
  console.log('Usage: node scripts/register-user.js <email> <password> [name]');
  process.exit(1);
}

registerUser(email, password, name); 