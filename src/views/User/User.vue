<script setup>

</script>

<template>
  <main>
    <RouterView :key="$route.fullPath"></RouterView>
  </main>
  
</template>


<style scoped>
   main {
      width: 600px;
      margin: 200px auto;
    }  

</style>

