<template>
  <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-8 transition-all duration-500">
    <!-- Step 1: Number of Players -->
    <div v-if="step === 1">
      <h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">
        How many players?
      </h2>
      <div class="flex justify-center items-center space-x-4">
        <input
          type="number"
          v-model.number="numberOfPlayers"
          min="2"
          max="10"
          class="text-center text-xl sm:text-2xl font-bold w-24 sm:w-32 p-2 sm:p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          @keyup.enter="goToNextStep"
        />
      </div>
      <div class="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
        2-10 players supported
      </div>
      <div class="text-center mt-4 sm:mt-6">
        <button
          @click="goToNextStep"
          class="bg-blue-600 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg hover:bg-blue-700 transition-colors text-lg sm:text-xl"
        >
          Next
        </button>
      </div>
      <p v-if="error" class="text-red-500 dark:text-red-400 text-center mt-4 text-sm sm:text-base">{{ error }}</p>
    </div>

    <!-- Step 2: Player Names & Game Mode -->
    <div v-if="step === 2">
      <h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">
        Player Details & Game Mode
      </h2>
      
      <!-- Player Names -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div v-for="(player, index) in settings.playerNames" :key="index">
          <label :for="`player-${index}`" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Player {{ index + 1 }} Name
          </label>
          <input
            :id="`player-${index}`"
            type="text"
            v-model="settings.playerNames[index]"
            class="w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
            :placeholder="`Enter name for Player ${index + 1}`"
          />
        </div>
      </div>

      <!-- Scoring Mode -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-700 mb-3">Choose Scoring Mode</h3>
        <div class="flex space-x-4 rounded-lg bg-gray-100 p-2">
          <button
            @click="settings.scoringSystem = 'traditional'"
            :class="['w-full text-center font-semibold py-3 rounded-md transition-colors', settings.scoringSystem === 'traditional' ? 'bg-blue-600 text-white shadow' : 'hover:bg-gray-200']"
          >
            Traditional (10 + Tricks)
          </button>
          <button
            @click="settings.scoringSystem = 'progressive'"
            :class="['w-full text-center font-semibold py-3 rounded-md transition-colors', settings.scoringSystem === 'progressive' ? 'bg-blue-600 text-white shadow' : 'hover:bg-gray-200']"
          >
            Progressive (15, 25, 35...)
          </button>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <button
          @click="step = 1"
          class="text-gray-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          @click="startGame"
          class="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors text-xl"
        >
          Start Game
        </button>
      </div>
      <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameSettings } from '~/types/game'

const emit = defineEmits(['startGame'])

const step = ref(1)
const numberOfPlayers = ref(4)
const error = ref('')

const settings = reactive<GameSettings>({
  playerNames: [],
  scoringSystem: 'traditional'
})

const goToNextStep = () => {
  error.value = ''
  if (numberOfPlayers.value < 2 || numberOfPlayers.value > 10) {
    error.value = 'Please enter a number of players between 2 and 10.'
    return
  }
  // Populate player names array with default names
  settings.playerNames = Array.from({ length: numberOfPlayers.value }, (_, i) => `Player ${i + 1}`)
  step.value = 2
}

const startGame = () => {
  error.value = ''
  if (settings.playerNames.some(name => !name.trim())) {
    error.value = 'All players must have a name.'
    return
  }
  emit('startGame', { ...settings })
}
</script>
