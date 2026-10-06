const { spawnSync } = require('node:child_process')
const { existsSync } = require('node:fs')
const path = require('node:path')

const env = { ...process.env }
// VS Code puede heredar esta variable; Electron debe arrancar como navegador.
delete env.ELECTRON_RUN_AS_NODE
const localCache = path.resolve(__dirname, '../../.tools/cypress-cache')
if (!env.CYPRESS_CACHE_FOLDER && existsSync(localCache)) {
  env.CYPRESS_CACHE_FOLDER = localCache
}
const result = spawnSync(process.execPath, [
  path.resolve(__dirname, '../node_modules/cypress/bin/cypress'),
  ...process.argv.slice(2),
], { stdio: 'inherit', env })
if (result.error) {
  console.error(result.error.message)
}
process.exit(result.status ?? 1)
