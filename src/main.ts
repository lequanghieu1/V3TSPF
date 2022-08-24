import { createApp } from "vue";
import firebase from "firebase";
import { createPinia } from "pinia";
import mitt from "mitt";
import router from "./router";
import "./style.css";
import App from "./App.vue";

const emitter = mitt();
const firebaseConfig = {
  apiKey: "AIzaSyA6zVhkj1mSTNoosYDNGJ77CldxYIU76Xo",
  authDomain: "vue3-f7cf5.firebaseapp.com",
  databaseURL: "https://vue3-f7cf5-default-rtdb.firebaseio.com",
  projectId: "vue3-f7cf5",
  storageBucket: "vue3-f7cf5.appspot.com",
  messagingSenderId: "1098606230090",
  appId: "1:1098606230090:web:c4c8f249b5d7bc09ad44b3",
  measurementId: "G-K3TDCC3GSD",
};
firebase.initializeApp(firebaseConfig);
const app = createApp(App);
app.provide('emitter', emitter);
app.use(createPinia()).use(router).mount("#app");
