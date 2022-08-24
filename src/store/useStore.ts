import { defineStore } from "pinia";

interface ToDoItem {
  id: number;
  item: string;
  completed: boolean;
  email: string;
  imageUrl: string;
}

export const useTodoListStore = defineStore("todoList", {
  state: () => ({
    todoList: [] as ToDoItem[],
    id: 0,
    showAlert: false,
  }),
  actions: {
    addTodo(item: string) {
      this.todoList.push({
        item,
        id: this.id++,
        completed: false,
        email: "",
        imageUrl: "",
      });
      this.todoList = this.todoList.filter(Boolean)
    },
    loadTodo(item: ToDoItem) {
      this.todoList.push(item);
      this.todoList = this.todoList.filter(Boolean)
    },
    resetArr() {
      this.todoList = [];
    },
    deleteTodo(itemID: number) {
      this.todoList = this.todoList.filter((object) => {
        return object.id !== itemID;
      });
    },
    toggleCompleted(idToFind: number) {
      const todo = this.todoList.find((obj) => obj.id === idToFind);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    inputAlert() {
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 1000);
    },
  },
});
