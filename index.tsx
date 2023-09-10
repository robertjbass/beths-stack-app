import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { Database } from "bun:sqlite";
import { deleteTodo, getTodos, insertTodo, toggleTodo } from "./db";

export type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

export const db = new Database("db.sqlite", { create: true });
db.query(
  "CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL, completed BOOLEAN NOT NULL DEFAULT false)"
).run();

class State {
  public todos: Todo[] = [];

  constructor() {
    this.refresh();
  }

  public refresh() {
    this.todos = getTodos() || [];
  }
}

export const state = new State();

const PORT = Bun.env.PORT || 3000;

const app = new Elysia()
  .use(html)
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <body
          class="flex w-full h-screen justify-center items-center"
          hx-get="/todos"
          hx-trigger="load"
          hx-swap="innerHTML"
        />
      </BaseHtml>
    )
  )
  .get("/todos", () => <TodoList todos={state.todos} />)
  .post(
    "/todos",
    ({ body }) => {
      if (body.content.length === 0) {
        throw new Error("Content cannot be empty");
      }

      const newTodo = insertTodo(body.content);
      if (newTodo) {
        return (
          <div>
            <script>
              document.querySelector("input[name=content]").value=""
            </script>
            <TodoItem {...newTodo} />
          </div>
        );
      }
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    }
  )
  .post(
    "/todos/toggle/:id",
    ({ params }) => {
      const todo = toggleTodo(params.id);
      if (todo) {
        return <TodoItem {...todo} />;
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .delete(
    "/todos/:id",
    ({ params }) => {
      deleteTodo(params.id);
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .listen(PORT);

console.log(
  `🦊 Elysia is running on at http://${app.server?.hostname}:${app.server?.port}`
);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>The BETH stack</title>
  <script src="https://unpkg.com/htmx.org@1.9.5"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

${children}
`;

function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-target="closest div"
        hx-swap="outerHTML"
      />
      <button
        class="text-red-500"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        X
      </button>
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
}

function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todos"
      hx-swap="beforebegin"
      hx-reset-on-success
    >
      <input
        type="text"
        name="content"
        class="border-2 border-black p-1 rounded"
      />
      <button type="submit">Add</button>
    </form>
  );
}
