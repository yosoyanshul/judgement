<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Global app configuration
useHead({
  title: 'Judgement Card Game',
  meta: [
    { name: 'description', content: 'Play the classic Judgement card game online with friends' }
  ]
})
</script>
