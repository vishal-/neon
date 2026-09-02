import type { JSXNode } from 'hono/jsx'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string> | JSXNode, props?: { title?: string }): Response | Promise<Response>
  }
}

export const renderer = jsxRenderer(({ children, title }: { children?: any; title?: string }) => {
  const pageTitle = title || 'Neon Activities — The Cosmic Activity & Quiz App for Kids 🚀'
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Neon Activities is the ultimate cosmic brain activity, riddle, and quiz app for kids! Explore galaxy mazes, memory quests, logic challenges, and inclusive games."
        />
        <meta name="keywords" content="kids quiz app, neon activities, brain quest, kids logic games, kids puzzles, cosmic learning, inclusive kids games" />
        <meta name="theme-color" content="#050816" />
        
        {/* Google Fonts: Nunito, Fredoka, Orbitron */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700;800;900&family=Orbitron:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />

        <ViteClient />
        <Link href="/src/style.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
})
