<template>
  <div v-for="(todo, i) in listLoop" :key="todo.id" class="list">
    <div class="item">
      <div :class="{ completed: todo?.completed }">{{ todo.item }}</div>
      <div>
        <img width="50" height="27" v-if="todo.imageUrl" :src="todo.imageUrl" />
        <!-- <span @click.stop="toggleCompleted(todo.id)">&#10004;</span> -->
        <span @click.stop="editItem(i, todo)">&#10004;</span>
        <span @click="deleteItem(todo.id)" class="x">&#10060;</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodoListStore } from "../store/useStore";
import { storeToRefs } from "pinia";
import { onBeforeMount, inject, computed } from "vue";
import firebase from "firebase";
const emitter: any = inject("emitter");
interface User {
  id: number;
  item: string;
  completed: boolean;
  email: string;
  imageUrl: string;
}
const props = defineProps(["src"]);
const store = useTodoListStore();
const { todoList } = storeToRefs(store);
const { toggleCompleted, deleteTodo } = store;
function tang() {
  store.showAlert = true;
}
onBeforeMount(() => {
  countRecord();
});
const listLoop = computed(() => {
  return todoList.value?.filter((e) => {
    return e.email === JSON.parse(localStorage.getItem("user")).email;
  });
});
function editItem(index: number, todo: User) {
  emitter.emit("editItem", { index, todo });
}
function deleteItem(index: number) {
  // console.log(index)
  emitter.emit("deleteItem", index);
}
function countRecord() {
  const listItem = firebase.database().ref();
  listItem.on("value", (snapshot) => {
    // console.log(snapshot.val());
    if (Array.isArray(snapshot.val()?.users)) {
      List(snapshot.val()?.users);
    } else if (snapshot.val() === null) {
      store.resetArr();
    } else {
      {
        const array = Object.keys(snapshot.val()?.users || {}).map(function (
          key
        ) {
          return snapshot.val()?.users[key];
        });
        List(array);
      }
    }

    // store.resetArr();
    // for (let i = 0; i <= +snapshot.numChildren(); i++) {
    //   List(i);
    // }
  });
}
function List(i: User[]) {
  store.loadTodo(i);
  // const listItem = firebase.database().ref(`users/${i}`);
  // listItem.on("value", (snapshot) => {
  //   store.loadTodo(snapshot.val());
  // });
}
</script>

<style scoped>
span {
  margin: 0 10px;
  cursor: pointer;
}

.completed {
  text-decoration: line-through;
}

.list {
  display: flex;
  justify-content: center;
}

.item {
  display: flex;
  font-size: 1.5em;
  justify-content: space-between;
  width: 80vw;
  padding: 5px;
}
</style>
