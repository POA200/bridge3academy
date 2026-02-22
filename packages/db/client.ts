import { PrismaClient } from "@prisma/client"
import { existsSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

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
