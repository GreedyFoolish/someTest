<template>
  <div id="app">
    <TinymceEdit />
  </div>
</template>

<script>
import TinymceEdit from "./components/tinymceEdit.vue";

export default {
  name: "App",
  components: {
    TinymceEdit,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
