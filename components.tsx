import * as elements from "typed-html";
import type { Todo } from "./db";

export const TodoItem = ({ content, completed, id }: Todo) => {
  return (
    <div class="flex flex-row space-x-3 border-b-2 my-2 p-2 border-dotted">
      <p class="w-full">{content}</p>
      <input
        class="w-6"
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-target="closest div"
        hx-swap="outerHTML"
      />
      <button
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        ❌
      </button>
    </div>
  );
};

export const TodoList = ({ todos }: { todos: Todo[] }) => {
  return (
    <div class="h-full p-8 w-1/2">
      <TodoForm />
      <div id="todoListContainer">
        {todos.map((todo) => (
          <TodoItem {...todo} />
        ))}
      </div>
    </div>
  );
};

export const TodoForm = () => {
  return (
    <form
      class="flex flex-row space-x-3 relative top-0 mb-8"
      hx-post="/todos"
      hx-swap="beforeend"
      hx-target="#todoListContainer"
    >
      <input
        type="text"
        name="content"
        class="border-2 border-black p-1 rounded w-full"
      />
      <button
        class="border-2 border-gray-700 bg-gray-700 hover:bg-gray-500 w-24 rounded text-white"
        type="submit"
      >
        Add
      </button>
    </form>
  );
};

export const BaseHtml = ({ children }: elements.Children) => `
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
