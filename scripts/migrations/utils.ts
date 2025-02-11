const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('fs');
const path = require('path');

// Create and export a single PrismaClient instance
const prisma = new PrismaClient();

function sanitizeString(str: string | null): string | null {
  if (!str) return null;
  // Clean unwanted characters while preserving Hebrew
  return str.trim().replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');
}

function readJsonFile(filename: string): any {
  const filePath = path.join(process.cwd(), 'data', filename);
  return JSON.parse(readFileSync(filePath, { encoding: 'utf8' }));
}

async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}

module.exports = {
  prisma,
  sanitizeString,
  readJsonFile,
  disconnectPrisma
};
