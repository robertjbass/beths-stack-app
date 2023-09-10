import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { deleteTodo, insertTodo, state, toggleTodo } from "./db";
import { BaseHtml, TodoItem, TodoList } from "./components";

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
