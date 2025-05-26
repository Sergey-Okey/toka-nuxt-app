<template>
  <div id="app">
    <main>
      <Dsa />
      <AppHeader />
    </main>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
#app {
  font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
