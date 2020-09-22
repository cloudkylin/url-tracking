<template>
  <div>
    <div class="message">
      <h2>网页未找到</h2>
      <p>ERROR CODE - 404</p>
    </div>
    <img src="@/assets/logo.png" alt="LOGO" class="bg-img" />
  </div>
</template>

<script>
export default {
  name: "error-404"
};
</script>

<style scoped>
.message {
  position: absolute;
  top: 30vh;
  left: 20vw;
}
.bg-img {
  position: fixed;
  bottom: 0;
  right: 0;
  opacity: 0.6;
}
</style>
