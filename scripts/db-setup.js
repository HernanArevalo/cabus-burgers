import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('[v0] Starting database setup...')

try {
  console.log('[v0] Running prisma db push...')
  execSync('npx prisma db push --skip-generate', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  })
  console.log('[v0] Database push completed successfully')

  console.log('[v0] Generating Prisma client...')
  execSync('npx prisma generate', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  })
  console.log('[v0] Prisma client generated successfully')

  console.log('[v0] Running seed script...')
  execSync('npx tsx prisma/seed.ts', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  })
  console.log('[v0] Seed script completed successfully')

  console.log('[v0] Database setup finished!')
} catch (error) {
  console.error('[v0] Error during database setup:', error.message)
  process.exit(1)
}
