# The BETHS stack

- **B**un
- **E**lysia
- **T**ailwind
- **H**TMX
- **S**Qlite

Inspired by [The BETH Stack: Build Hypermedia-Driven Web Apps with Great DX and Performance](https://youtu.be/cpzowDDJj24?si=OX6VxrwnRbDEFvmB) by Ethan Niser but without Turso and with a slightly different approach.

---

## Bun

✅ Supports TypeScript and TSX out of the box with no setup or transpilation

✅ Bun's `--watch` flag makes `nodemon` and `ts-node` obsolete

✅ Extremely fast

✅ `Bun.env` makes `dotenv` obsolete

✅ Has native SQLite drivers

❌ Copilot and ChatGPT were less helpful because it's not as ubiquitous as node

---

## Elysia

✅ Feels like a combination of Express and Flask which are both great to work with

✅ Supports typed params from the request

✅ Supports SSR HTML very well making TSX easy to use

❌ The syntax for typed params feels a bit verbose and ugly, I'd almost rather cast or convert types to make the code more readable

---

## HTMX

✅ Allows for individual HTML elements to be swapped out without a full reload or re-render preserving state

✅ Allows for more functionality without JS

✅ Can drop in a CDN tag and have full functionality

✅ Tailwind compliments HTMX very well

✅ SSG JSX works very well with HTMX

❌ Completely different way of thinking about apps which I find unpleasant
❌ Equally as unpleasant as imperative JS, but less intuitive

---

## SQLite

✅ Portable, DB saves to a single file

✅ Mature and battle-tested

✅ Lightweight, perfect for small toy apps like this

✅ Can be used as an in-memory database

❌ I have less experience with it since it's not super common in the JavaScript ecosystem

---

## Summary

**✅ Bun** had a great DX and I thoroughly enjoyed using it. I'm aleready looking forward to using more of it and think it can dethrone node.

**✅ Elysia** is modern and intuitive. I liked it. My gut feeling is that I prefer Express because it's what I know and love but I'd need to build a larger app with Elysia to decide for sure. If Bun really is a drop-in replacement for node, it might be hard for me to pick Elysia over Express.

**❌ HTMX** was not something I'm looking forward to using again. Admittedly it has great interop with SSG JSX but it's a completely different way of thinking about building UIs that I don't want to learn to like. It takes the fun out of the front-end for me.

**✅ SQLite** got the job done. I like the idea of a portable relational database and I love that Bun supports SQLite drivers by default. Since I plan to use a lot more Bun, I'll probably be using a lot more SQLite. Next time, I'll play with an ORM instead of writing vanilla SQL.

_This was a fun little project to play with new technologies. I'm super impressed with Bun and expect to see fast adoption. I strongly disliked HTMX and would be surprised to see any meaningful adoption outside of backend engineers who don't want to learn a framework but are forced to build a web UI._

---

```bash
bun install
bun run serve
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh)
