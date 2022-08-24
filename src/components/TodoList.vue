<template>
{{listItems}}
  <div v-for="todo in listItems" :key="todo.id" class="list">
    <div class="item">
      <div :class="{ completed: todo.completed }">{{ todo.item }}</div>
      <div>
        <img width=50 height=27 v-if="props.src" :src="props.src" />
        <span @click.stop="toggleCompleted(todo.id)">&#10004;</span>
        <span @click="List" class="x">&#10060;</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodoListStore } from "../store/useStore";
import { storeToRefs } from "pinia";
import { ref, onMounted, watch } from "vue";
import firebase from 'firebase'
const props = defineProps(['src'])
const store = useTodoListStore();
let listItems = ref([])
const { todoList } = storeToRefs(store);
watch(listItems, (data) => {
console.log(data)
});
const { toggleCompleted, deleteTodo } = store;
function tang() {
  store.showAlert = true
}
onMounted(() => {
  List()
})
function List() {
  const listItem = firebase.database().ref('users/1');
  listItem.on('value',async (snapshot) => {
    listItems = snapshot.val();
// console.log(listItems)
  });
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