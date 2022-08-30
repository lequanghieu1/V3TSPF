<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, defineAsyncComponent, computed } from "vue";
import { useMouse } from "../../helper/mouse";
import { useTodoListStore } from "../store/useStore";
import { useSocketIO } from "../socket";
import firebase from "firebase";

const store = useTodoListStore();
let srcImg = ref("");
const text = ref('')
const isChat = ref(false)
const messages = ref([])
const { socket } = useSocketIO()
socket.on('statusRoom', (message: string) => {
  messages.value.push({
    message,
    type: 'status',
  })

})
socket.on('connect', () => {
  console.log(socket)
})
socket.on('receiveMessage', (mes: any) => {
  receiveMessage(mes._value)
})
function sendMessage() {
  if (text.value !== '') {
    socket.emit('sendMessage', text) // emit lên server
    messages.value.push({
      message: text.value,
      type: 'send',
    })
  }
  text.value = ''
}
function receiveMessage(message: string) { //nhận tín nhắn từ ng khác trong phòng, push tin nhắn vào mảng ban đầu
  messages.value.push({
    message,
    type: 'receive',
  })
}
const { x, y } = useMouse();
const vColor = {
  mounted: (el: any, binding: any) => (el.style.color = binding.value),
};
const chat = () => {
  isChat.value = true
}
const TodoForm = defineAsyncComponent(() => import("./TodoForm.vue"));
const TodoList = defineAsyncComponent(() => import("./TodoList.vue"));
const changeColor = computed((): string => {
  if (+x.value < 100) return "red";
  else if (+x.value > 100 && +x.value < 200) return "orange";
  else if (+x.value > 200 && +x.value < 300) return "yellow";
  else if (+x.value > 300 && +x.value < 400) return "green";
  else if (+x.value > 400 && +x.value < 500) return "blue";
  else if (+x.value > 500 && +x.value < 600) return "black";
  else if (+x.value > 600 && +x.value < 700) return "pink";
  else if (+x.value > 700 && +x.value < 800) return "violet";
  else if (+x.value > 800 && +x.value < 900) return "gray";
  else if (+x.value > 900 && +x.value < 1000) return "#06c1f0";
  return "#0af895";
});
const email = computed((): string => {
  return JSON.parse(localStorage.getItem("user")).email;
});

const router = useRouter();
let pageTitle = ref("aaaa");
function logout() {
  localStorage.removeItem("user");
  firebase.auth().signOut();
  router.push("/login");
}
</script>
<template>
  <div class="todo-app">
    <!-- <h1 v-color="changeColor">{{ store.showAlert }} {{ x }} {{ y }}</h1> -->
    <h1>To do List</h1><button style="background-color:green" @click="chat">chat</button>
    <p>{{  email  }}</p>
    <button class=" btn" @click="logout">Logout</button>
    <TodoForm :modelValue="pageTitle" @update:modelValue="(newValue) => (pageTitle = newValue)"
      @uploadImages="(newValue) => (srcImg = newValue)"><template #header><img v-if="srcImg" :src="srcImg"
          alt="" /></template><template #footer>Please type something...</template></TodoForm>
    <todo-list :src="srcImg" />
    <div id="appaa" v-if="isChat">
      <div v-for="(message, index) in messages" :key="index">
        {{  message.type  }} : {{  message.message  }}
      </div>
      <input type="text" v-model="text">
      <button @click="sendMessage()">Send</button>
    </div>
  </div>
</template>
<style scoped>
.todo-app {
  padding: 5vh;
  min-height: 100vh;
  width: 30vw;
  background-color: #f7fcfa;
}

.btn {
  background-color: red;
  margin-left: 405px;
}
</style>
