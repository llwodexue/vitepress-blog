import type { MarkdownOptions } from 'vitepress'
import { getReadingTime } from '../utils/pageInfo'

const markdown: MarkdownOptions = {
  math: true,
  lineNumbers: true,
  config: md => {
    md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
      let htmlResult = slf.renderToken(tokens, idx, options)
      if (tokens[idx].tag === 'h1') {
        let code = env.content
        code = code.replace(/[^\w\s{}%!-\[\]]/g, '')
        const { readTime, words } = getReadingTime(code)
        htmlResult += `\n<ClientOnly><PageInfo :frontmatter="$frontmatter" :readTime="${readTime}" :words="${words}" /></ClientOnly>`
      }
      return htmlResult
    }
  },
  image: {
    lazyLoading: true
  }
}

export default markdown
