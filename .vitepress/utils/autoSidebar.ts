import fs from 'fs'
import path from 'path'
import { type DefaultTheme } from 'vitepress'

interface SidebarGroupConfig {
  text: string
  collapsed?: boolean
  items: string[]
}

const docsRoot = path.resolve(process.cwd())

function matchFile(filename: string, prefix: string): boolean {
  const name = filename.replace(/\.md$/, '')
  if (/^\d+$/.test(prefix)) {
    return name.startsWith(prefix + '-') || name.startsWith(prefix + '.')
  }
  return name.startsWith(prefix)
}

function extractTitle(filename: string): string {
  const name = filename.replace(/\.md$/, '')
  const match = name.match(/^(?:.*?\d+[-.])?(.+)$/)
  return match ? match[1] : name
}

export function autoSidebar(
  dir: string,
  groups: SidebarGroupConfig[]
): DefaultTheme.SidebarItem[] {
  const fullDir = path.join(docsRoot, dir)
  const files = fs
    .readdirSync(fullDir)
    .filter(f => f.endsWith('.md'))
    .sort()

  const matched = new Set<string>()

  return groups.map(group => {
    const items: DefaultTheme.SidebarItem[] = []

    for (const prefix of group.items) {
      for (const file of files) {
        if (matched.has(file)) continue
        if (matchFile(file, prefix)) {
          matched.add(file)
          items.push({ text: extractTitle(file), link: file })
        }
      }
    }

    return {
      text: group.text,
      collapsed: group.collapsed ?? false,
      items
    }
  })
}
