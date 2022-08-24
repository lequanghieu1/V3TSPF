<script lang="ts" setup>

import { ref, watch } from "vue";
import { useTodoListStore } from "../store/useStore";
import firebase from 'firebase'
const todo = ref("");
const store = useTodoListStore();
const fileIn = ref(null);
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'uploadImages'])
watch([todo, fileIn], ([todo, files]) => {

});
function addItemAndClear(item: string) {
  if (item.length === 0) {
    store.inputAlert();
    return;
  }
  emit('update:modelValue', item)
  store.addTodo(item);
  todo.value = "";
}
function uploadImage(file: File) {
  let storageRef = firebase.storage().ref().child(`${file.name}`);
  storageRef.put(file).on('state_changed',
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      storageRef.put(file).snapshot.ref.getDownloadURL().then((downloadURL) => {
        emit('uploadImages', downloadURL)
        console.log('File available at', downloadURL);
      });
    }
  );
}
function writeUserData(userId: number, name: string, email: string, imageUrl: string) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture: imageUrl
  });
}
function onImageChange(e: any) {
  let files: any = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  uploadImage(files[0])
}
</script>
<template>
  <div>
    <form>
      <input v-model="todo" type="text" /><button @click.prevent="addItemAndClear(todo)" style="color:white">
        {{ props.modelValue }}
      </button>
      <input ref="fileIn" type="file" @change="onImageChange" />
      <div @click="fileIn.click()">
        <slot name="header"></slot>
      </div>

      <div class="alert-div">
        <div v-show="store.showAlert" class="alert">
          <slot name="footer"></slot>
        </div>
      </div>
    </form>
  </div>
</template>



<style scoped>
form {
  margin-bottom: 15px;
}

input {
  margin-top: 25px;
  margin-bottom: 15px;
  height: 20px;
  width: 50%;
}

button {
  margin-left: 30px;
  background-color: #2f6089;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-weight: 800;
  color: white;
  width: 15%;
}

.alert-div {
  min-height: 25px;
}

.alert {
  color: #d1495b;
  font-size: 1em;
  font-weight: 600;
}
</style>