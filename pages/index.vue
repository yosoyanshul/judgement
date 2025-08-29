<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors">
    <div class="container mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <header class="text-center mb-6 sm:mb-8 relative">
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tight">
          🎮 Judgement Card Game
        </h1>
        <p class="text-sm sm:text-lg text-gray-500 dark:text-gray-400 mt-2">
          Predict your tricks, master the trump, and claim victory!
        </p>
        <!-- Control Buttons -->
        <div v-if="game" class="absolute top-0 right-0 mt-1 sm:mt-2 space-x-1 sm:space-x-2">
          <button 
            @click="toggleDarkMode" 
            class="bg-purple-500 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg hover:bg-purple-600 transition-colors shadow-md text-sm sm:text-base"
          >
            {{ isDarkMode ? '☀️' : '🌙' }}
          </button>
          <button 
            @click="handleNewGame" 
            class="bg-blue-500 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-md text-sm sm:text-base"
          >
            New Game
          </button>
        </div>
        <div v-else class="absolute top-0 right-0 mt-1 sm:mt-2">
          <button 
            @click="toggleDarkMode" 
            class="bg-purple-500 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg hover:bg-purple-600 transition-colors shadow-md text-sm sm:text-base"
          >
            {{ isDarkMode ? '☀️' : '🌙' }}
          </button>
        </div>
      </header>

      <!-- Game Results -->
      <div v-if="gameState === 'completed'" class="mb-8">
        <GameResults :game="game!" @new-game="handleNewGame" />
      </div>

      <!-- Main Content Area -->
      <main class="max-w-4xl mx-auto">
        <!-- Game Setup -->
        <transition name="fade" mode="out-in">
          <div v-if="gameState === 'setup'" key="setup">
            <GameSetup @start-game="handleStartGame" />
          </div>

          <!-- Game Board -->
          <div v-else-if="gameState === 'playing'" key="playing">
            <GameBoard 
              :game="game!" 
              @bid-submitted="handleBidSubmitted" 
              @round-completed="handleRoundCompleted"
              @game-completed="handleGameCompleted"
            />
          </div>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game, GameSettings } from '~/types/game'
import { useGame } from '~/composables/useGame'

const { createNewGame, startNewRound } = useGame()
const game = ref<Game | null>(null)
const isDarkMode = ref(false)

// Game state management
const gameState = computed(() => {
  if (!game.value) return 'setup'
  if (game.value.isCompleted) return 'completed'
  return 'playing'
})

// --- Dark Mode ---
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// --- Event Handlers ---

const handleStartGame = (settings: GameSettings) => {
  console.log('Starting game with settings:', settings)
  const newGame = createNewGame(settings)
  
  // Start the first round
  const firstRound = startNewRound(newGame)
  newGame.rounds.push(firstRound)
  
  game.value = newGame
  console.log('Game created:', newGame)
  saveGameToCache()
}

const handleBidSubmitted = ({ playerId, bid }: { playerId: string, bid: number }) => {
  console.log('Bid submitted:', playerId, bid)
  if (!game.value) return

  const currentRound = game.value.rounds[game.value.currentRound - 1]
  if (!currentRound || currentRound.phase !== 'bidding') return

  // Record the bid
  currentRound.bids[playerId] = bid

  // Check if all players have bid
  const allPlayersHaveBid = game.value.players.length === Object.keys(currentRound.bids).length
  if (allPlayersHaveBid) {
    // Transition to playing phase
    setTimeout(() => {
      currentRound.phase = 'playing'
      console.log('All bids received, transitioning to playing phase')
      saveGameToCache()
    }, 500)
  }

  saveGameToCache()
}

const handleRoundCompleted = () => {
  console.log('Round completed')
  if (!game.value) return

  // Check if this was the last round
  if (game.value.currentRound >= game.value.totalRounds) {
    game.value.isCompleted = true
    console.log('Game completed!')
  } else {
    // Start next round
    game.value.currentRound++
    
    // Rotate dealer
    const currentDealerIndex = game.value.players.findIndex(p => p.isDealer)
    game.value.players[currentDealerIndex].isDealer = false
    const nextDealerIndex = (currentDealerIndex + 1) % game.value.players.length
    game.value.players[nextDealerIndex].isDealer = true
    
    // Create new round
    const newRound = startNewRound(game.value)
    game.value.rounds.push(newRound)
    
    console.log(`Starting round ${game.value.currentRound}`)
  }

  saveGameToCache()
}

const handleGameCompleted = () => {
  console.log('Game completed!')
  if (!game.value) return
  
  game.value.isCompleted = true
  saveGameToCache()
}

const handleNewGame = () => {
  if (confirm('Are you sure you want to start a new game? Your current progress will be lost.')) {
    game.value = null
    clearGameCache()
  }
}

// --- Cache Management ---

const saveGameToCache = () => {
  if (game.value) {
    localStorage.setItem('judgement-game', JSON.stringify(game.value))
  }
}

const clearGameCache = () => {
  localStorage.removeItem('judgement-game')
}

const loadGameFromCache = () => {
  const cachedGame = localStorage.getItem('judgement-game')
  if (cachedGame) {
    try {
      game.value = JSON.parse(cachedGame)
      console.log('Loaded game from cache:', game.value)
    } catch (e) {
      console.error("Failed to load game from cache.", e)
      clearGameCache()
    }
  }
}

const loadDarkModePreference = () => {
  const darkModePreference = localStorage.getItem('darkMode')
  if (darkModePreference === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
}

// Load game and preferences when the component is mounted
onMounted(() => {
  loadGameFromCache()
  loadDarkModePreference()
})
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
