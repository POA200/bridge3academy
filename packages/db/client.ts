import { PrismaClient } from "@prisma/client"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

function loadDatabaseUrlFromEnvFiles() {
  if (process.env.DATABASE_URL) {
    return
  }

  const currentDir = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    join(process.cwd(), ".env.local"),
    join(process.cwd(), ".env"),
    join(currentDir, "..", "..", ".env.local"),
    join(currentDir, "..", "..", ".env"),
  ]

  for (const filePath of candidates) {
    if (!existsSync(filePath)) {
      continue
    }

    const content = readFileSync(filePath, "utf8")
    const match = content.match(/^DATABASE_URL\s*=\s*(["']?)(.+)\1\s*$/m)

    if (!match) {
      continue
    }

    const value = match[2]?.trim()

    if (value) {
      process.env.DATABASE_URL = value
      return
    }
  }
}

loadDatabaseUrlFromEnvFiles()

function resolveQueryEngineLibraryPath() {
  const currentDir = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    join(currentDir, "node_modules", ".prisma", "client"),
    join(process.cwd(), "node_modules", ".prisma", "client"),
  ]

  for (const engineDir of candidates) {
    if (!existsSync(engineDir)) {
      continue
    }

    const engineFile = readdirSync(engineDir).find((fileName) =>
      /^libquery_engine-.*\.(so|dylib|dll)\.node$/.test(fileName),
    )

    if (engineFile) {
      return join(engineDir, engineFile)
    }
  }

  return null
}

if (!process.env.PRISMA_QUERY_ENGINE_LIBRARY) {
  const resolvedPath = resolveQueryEngineLibraryPath()

  if (resolvedPath) {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = resolvedPath
  }
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma
