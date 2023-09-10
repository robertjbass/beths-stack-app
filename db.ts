import { Todo, db, state } from ".";

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
