import { Database } from "bun:sqlite";

export type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

export const getTodos = (where?: string): Todo[] | void => {
  try {
    const query = ["SELECT * FROM todo", where].filter(Boolean).join(" WHERE ");
    const todos = db.prepare(query).all() as Todo[];
    return todos.map((todo) => ({ ...todo, completed: !!todo.completed }));
  } catch (error) {
    console.error(error);
  }
};

export const insertTodo = ($content: string): Todo | void => {
  try {
    const existingTodos = getTodos();
    const insert = db.prepare("INSERT INTO todo (content) VALUES ($content)");
    insert.run({ $content });
    const newTodos = getTodos(
      `id NOT IN (${existingTodos?.map((todo) => todo.id).join(", ")})`
    ) as Todo[];

    state.refresh();

    return newTodos[0];
  } catch (error) {
    console.error(error);
  }
};

export const toggleTodo = ($id: number): Todo | void => {
  try {
    const toggle = db.prepare(
      "UPDATE todo SET completed = NOT completed WHERE id = $id"
    );
    toggle.run({ $id });
    state.refresh();
    return getTodos(`id = ${$id}`)?.[0];
  } catch (error) {
    console.error(error);
  }
};

export const deleteTodo = ($id: number): void => {
  try {
    const del = db.prepare("DELETE FROM todo WHERE id = $id");
    del.run({ $id });
    state.refresh();
  } catch (error) {
    console.error(error);
  }
};

class State {
  public todos: Todo[] = [];

  constructor() {
    this.refresh();
  }

  public refresh() {
    this.todos = getTodos() || [];
  }
}

export const db = new Database("db.sqlite", { create: true });
db.query(
  "CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL, completed BOOLEAN NOT NULL DEFAULT false)"
).run();

export const state = new State();
