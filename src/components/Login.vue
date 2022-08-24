<template>
  <div class="login">
    <input type="text" v-model="user" @input="() => text = user" />
    <input type="password" v-model="pass" style="margin: 10px 0px" />
    <button @click="submit">{{ text }}</button>
    <div class="alert-div">
      <div v-show="store.showAlert" class="alert">Username or pass fail</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import firebase from 'firebase'
import { useTodoListStore } from "../store/useStore";


const user = ref("");
const pass = ref("");
const text = ref("submit");
const router = useRouter()
const store = useTodoListStore();

function submit() {
  firebase
    .auth() // get the auth api
    .signInWithEmailAndPassword(user.value, pass.value) // need .value because ref()
    .then((data) => {
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push('/')
    })
    .catch((err) => {
      alert(err)
      store.inputAlert();
    });
  // window.localStorage.setItem(
  //   "list",
  //   JSON.stringify([
  //     { user: "hieu", pass: "123" },
  //     { user: "huong", pass: "123" },
  //   ])
  // );
  // let info = JSON.parse(window.localStorage.getItem("list")) || [];
  // console.log(user, pass);
  // info.some((e: User) => {
  //   if (e.user === user.value && e.pass === pass.value) {
  //     window.localStorage.setItem("user", user.value);
  //     router.push('/')
  //     return false;
  //   } else if (e.user !== user.value || e.pass !== pass.value) {
  //     store.inputAlert();
  //   }
  // });
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: unset;
}
</style>