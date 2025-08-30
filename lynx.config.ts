import { defineConfig } from '@lynx-js/rspeedy'
import fs from 'fs'
import path from 'path'

import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'

function loadEnvFile() {
  try {
    const p = path.resolve(process.cwd(), '.env')
    const txt = fs.readFileSync(p, 'utf-8')
    const out: Record<string, string> = {}
    for (const raw of txt.split(/\r?\n/)) {
      const line = raw.trim()
      if (!line || line.startsWith('#')) continue
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (!m) continue
      let v = m[2].trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      out[m[1]] = v
    }
    return out
  } catch {
    return {}
  }
}

const fileEnv = loadEnvFile()
const BACKEND_URL = process.env.BACKEND_URL || fileEnv.BACKEND_URL || ''

export default defineConfig({
  source: {
    define: {
      __BACKEND_URL__: JSON.stringify(BACKEND_URL),
    },
  },
  plugins: [
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`
      },
    }),
    pluginReactLynx(),
    pluginTypeCheck(),
  ],
})
