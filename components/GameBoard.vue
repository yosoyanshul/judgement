<template>
  <div class="game-board min-h-screen bg-gradient-to-br from-green-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 p-3 sm:p-6">
    <!-- Round Header -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
            Round {{ currentRound.roundNumber }} of {{ game.totalRounds }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-lg">
            {{ currentRound.cardsPerPlayer }} cards per player
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div class="text-center sm:text-right">
            <div class="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">Trump Suit</div>
            <div class="text-2xl sm:text-4xl font-bold flex items-center justify-center sm:justify-end" :class="trumpColor">
              <span class="mr-2 capitalize">{{ currentRound.trumpSuit }}</span>
              <span>{{ trumpSymbol }}</span>
            </div>
          </div>
          <button
            @click="showScores = !showScores"
            class="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            {{ showScores ? 'Hide' : 'Show' }} Scores
          </button>
        </div>
      </div>
    </div>

    <!-- Scores Panel -->
    <div v-if="showScores" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 class="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-white">Current Scores</h3>
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div v-for="player in game.players" :key="player.id" class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate">{{ player.name }}</div>
          <div class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{{ player.score }}</div>
        </div>
      </div>
    </div>

    <!-- Bidding Phase -->
    <div v-if="currentRound.phase === 'bidding'">
      <!-- Players Grid with Bid Status -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div
          v-for="player in game.players"
          :key="player.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 text-center transition-all duration-300"
          :class="{
            'ring-4 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900': player.id === currentPlayerForBid?.id,
            'bg-green-50 dark:bg-green-900 ring-2 ring-green-300': currentRound.bids[player.id] !== undefined,
            'opacity-75': currentRound.bids[player.id] === undefined && player.id !== currentPlayerForBid?.id
          }"
        >
          <div class="flex items-center justify-center mb-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg">
              {{ player.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          
          <h3 class="font-bold text-base sm:text-lg mb-2 text-gray-800 dark:text-white truncate">{{ player.name }}</h3>
          
          <div v-if="player.isDealer" class="text-xs bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full mb-2">
            Dealer
          </div>
          
          <div v-if="currentRound.bids[player.id] !== undefined" class="text-center">
            <div class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {{ currentRound.bids[player.id] }}
            </div>
            <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Bid Placed</div>
          </div>
          
          <div v-else-if="player.id === currentPlayerForBid?.id" class="text-center">
            <div class="text-sm sm:text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-2">Your Turn!</div>
            <div v-if="currentPlayerForBid?.isLastBidder" class="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
              (Last Bidder)
            </div>
            <button
              @click="showBidModal = true"
              class="bg-yellow-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-yellow-600 transition-colors font-bold text-sm sm:text-lg"
            >
              Place Bid
            </button>
          </div>
          
          <div v-else class="text-center">
            <div class="text-gray-400 dark:text-gray-500 text-sm sm:text-lg">Waiting...</div>
          </div>
        </div>
      </div>

      <!-- Bidding Progress -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-white">Bidding Progress</h3>
        <div class="flex items-center">
          <div class="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 sm:h-4">
            <div 
              class="bg-blue-500 h-3 sm:h-4 rounded-full transition-all duration-500"
              :style="{ width: `${(Object.keys(currentRound.bids).length / game.players.length) * 100}%` }"
            ></div>
          </div>
          <span class="ml-3 sm:ml-4 font-bold text-gray-800 dark:text-white text-sm sm:text-base">
            {{ Object.keys(currentRound.bids).length }} / {{ game.players.length }}
          </span>
        </div>
      </div>
    </div>

    <!-- Playing Phase -->
    <div v-else-if="currentRound.phase === 'playing'" class="space-y-4 sm:space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8">
        <h3 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white text-center">
          Play Round {{ currentRound.roundNumber }} with Real Cards
        </h3>
        
        <div class="text-center mb-6 sm:mb-8">
          <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 sm:p-6">
            <h4 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
              Round Information
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div>
                <div class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{{ currentRound.cardsPerPlayer }}</div>
                <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Cards per Player</div>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-bold" :class="trumpColor">
                  {{ currentRound.trumpSuit ? trumpSymbol : 'No Trump' }}
                </div>
                <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Trump Suit</div>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{{ dealerName }}</div>
                <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Dealer</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Bids Display -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h4 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center text-gray-800 dark:text-white">Current Bids</h4>
          <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div v-for="player in game.players" :key="player.id" class="text-center p-3 bg-white dark:bg-gray-600 rounded-lg">
              <div class="font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate">{{ player.name }}</div>
              <div class="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{{ currentRound.bids[player.id] }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-300">bid</div>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="text-center text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
          <p class="text-base sm:text-lg mb-2">🃏 Play all {{ currentRound.cardsPerPlayer }} tricks with your real cards</p>
          <p class="text-sm">Keep track of who wins each trick, then record the results below when finished</p>
        </div>

        <!-- Record Final Results Button -->
        <div class="text-center">
          <button
            @click="showResultsModal = true"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors"
          >
            Record Round Results
          </button>
        </div>
      </div>
    </div>

    <!-- Results Recording Modal -->
    <div v-if="showResultsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showResultsModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <h3 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800 dark:text-white">
          Record Results - Round {{ currentRound.roundNumber }}
        </h3>
        
        <p class="text-center text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
          Did each player make their bid exactly?
        </p>
        
        <div class="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <div v-for="player in game.players" :key="player.id" class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg dark:border-gray-600 space-y-3 sm:space-y-0">
            <div class="flex items-center w-full sm:w-auto">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg mr-3 sm:mr-4 flex-shrink-0">
                {{ player.name.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <div class="font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate">{{ player.name }}</div>
                <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Bid: {{ currentRound.bids[player.id] }} tricks</div>
              </div>
            </div>
            
            <div class="flex space-x-2 w-full sm:w-auto">
              <button
                @click="setPlayerResult(player.id, true)"
                :class="[
                  'flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base',
                  playerResults[player.id] === true 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-800'
                ]"
              >
                ✓ Won
              </button>
              <button
                @click="setPlayerResult(player.id, false)"
                :class="[
                  'flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base',
                  playerResults[player.id] === false 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800'
                ]"
              >
                ✗ Lost
              </button>
            </div>
          </div>
        </div>

        <!-- Validation Message -->
        <div v-if="!allPlayersSelected" class="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 rounded-lg p-3 mb-4">
          <p class="text-yellow-800 dark:text-yellow-200 text-center text-sm sm:text-base">
            ⚠️ Please select Won or Lost for all players
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 sm:gap-3">
          <button
            @click="showResultsModal = false"
            class="flex-1 py-2 sm:py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-semibold text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            @click="submitResults"
            :disabled="!allPlayersSelected"
            class="flex-1 py-2 sm:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold text-sm sm:text-base"
          >
            Confirm Results
          </button>
        </div>
      </div>
    </div>

    <!-- Bidding Modal -->
    <div v-if="showBidModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showBidModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-8 max-w-md w-full" @click.stop>
        <div class="text-center">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-lg sm:text-2xl font-bold">{{ currentPlayerForBid?.name.charAt(0).toUpperCase() }}</span>
          </div>
          
          <h3 class="text-xl sm:text-2xl font-bold mb-2 text-gray-800 dark:text-white">{{ currentPlayerForBid?.name }}'s Turn</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">How many tricks do you think you'll win?</p>
          
          <div v-if="currentPlayerForBid?.isLastBidder && currentBidTotal < currentRound.cardsPerPlayer" class="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 rounded-lg p-3 mb-4">
            <p class="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Last Bidder Restriction:</strong> Total bids cannot equal {{ currentRound.cardsPerPlayer }}
              <br>Current total: {{ currentBidTotal }} + your bid ≠ {{ currentRound.cardsPerPlayer }}
              <br>You cannot bid: <strong>{{ forbiddenBid }}</strong>
            </p>
          </div>
          
          <div v-else-if="currentPlayerForBid?.isLastBidder && currentBidTotal > currentRound.cardsPerPlayer" class="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-600 rounded-lg p-3 mb-4">
            <p class="text-xs sm:text-sm text-green-800 dark:text-green-200">
              <strong>No Restriction:</strong> Previous bids already exceed {{ currentRound.cardsPerPlayer }}
              <br>Current total: {{ currentBidTotal }} - You can bid any amount!
            </p>
          </div>
          
          <!-- Bid Buttons -->
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4 sm:mb-6">
            <button
              v-for="bid in possibleBids"
              :key="bid"
              @click="selectBid(bid)"
              :disabled="!isBidAllowed(bid)"
              class="h-12 sm:h-16 text-lg sm:text-xl font-bold rounded-lg transition-all duration-200"
              :class="[
                selectedBid === bid ? 'bg-blue-500 text-white ring-4 ring-blue-300' : 'bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white',
                !isBidAllowed(bid) ? 'opacity-50 cursor-not-allowed bg-red-100 dark:bg-red-900' : ''
              ]"
              :title="!isBidAllowed(bid) ? `Cannot bid ${bid}` : `Bid ${bid}`"
            >
              {{ bid }}
            </button>
          </div>
          
          <!-- Debug info (smaller on mobile) -->
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-4 hidden sm:block">
            Debug: Current total: {{ currentBidTotal }}, Cards: {{ currentRound.cardsPerPlayer }}, 
            Forbidden: {{ forbiddenBid }}, Is last: {{ currentPlayerForBid?.isLastBidder }}
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2 sm:gap-3">
            <button
              @click="showBidModal = false"
              class="flex-1 py-2 sm:py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-semibold text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              @click="submitBid"
              :disabled="selectedBid === null || !isBidAllowed(selectedBid)"
              class="flex-1 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-semibold text-sm sm:text-base"
            >
              Confirm Bid
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Round Completed -->
    <div v-else-if="currentRound.phase === 'completed'" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
      <h3 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Round {{ currentRound.roundNumber }} Complete!
      </h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="player in game.players" :key="player.id" class="text-center p-4 rounded-lg"
             :class="playerResults[player.id] === true ? 
               'bg-green-100 dark:bg-green-900 border-2 border-green-300 dark:border-green-600' : 
               'bg-red-100 dark:bg-red-900 border-2 border-red-300 dark:border-red-600'">
          <div class="font-semibold text-gray-800 dark:text-white">{{ player.name }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Bid: {{ currentRound.bids[player.id] }}
          </div>
          <div class="text-xl font-bold mt-2" 
               :class="playerResults[player.id] === true ? 
                 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ playerResults[player.id] === true ? '✓ Made Bid' : '✗ Failed Bid' }}
          </div>
        </div>
      </div>

      <button
        @click="nextRound"
        class="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-colors"
      >
        {{ isLastRound ? 'Finish Game' : 'Next Round' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUpdated } from 'vue'
import type { Game, Player } from '~/types/game'
import { useGame } from '~/composables/useGame'

const props = defineProps<{
  game: Game
}>()

const emit = defineEmits(['bid-submitted', 'round-completed', 'game-completed'])

const { isValidBid, calculateScore } = useGame()
const showBidModal = ref(false)
const selectedBid = ref<number | null>(null)
const showScores = ref(false)
const showResultsModal = ref(false)

// Playing phase state
const playerResults = ref<Record<string, boolean | null>>({})
const lastRoundNumber = ref(0)

// Reset player results when round changes
const resetPlayerResults = () => {
  playerResults.value = {}
  props.game.players.forEach(player => {
    playerResults.value[player.id] = null
  })
}

// Check for round changes and reset results
const checkRoundChange = () => {
  const currentRoundNum = currentRound.value.roundNumber
  if (lastRoundNumber.value !== currentRoundNum) {
    lastRoundNumber.value = currentRoundNum
    resetPlayerResults()
  }
}

onMounted(() => {
  checkRoundChange()
})

onUpdated(() => {
  checkRoundChange()
})

const currentRound = computed(() => {
  return props.game.rounds[props.game.currentRound - 1]
})

const dealerName = computed(() => {
  const dealer = props.game.players.find(p => p.id === currentRound.value.dealerId)
  return dealer?.name || 'Unknown'
})

const allPlayersSelected = computed(() => {
  return props.game.players.every(player => playerResults.value[player.id] !== undefined && playerResults.value[player.id] !== null)
})

const biddingOrder = computed((): Player[] => {
  const players = props.game.players
  const dealerIndex = players.findIndex(p => p.id === currentRound.value.dealerId)
  if (dealerIndex === -1) return players

  const orderedPlayers: Player[] = []
  // Start with player after dealer, then include dealer as last
  for (let i = 1; i < players.length; i++) {
    orderedPlayers.push(players[(dealerIndex + i) % players.length])
  }
  // Add dealer as the last bidder
  orderedPlayers.push(players[dealerIndex])
  
  return orderedPlayers
})

const currentPlayerForBid = computed((): Player & { isLastBidder?: boolean } | undefined => {
  if (currentRound.value.phase !== 'bidding') return undefined
  
  const bidsPlaced = Object.keys(currentRound.value.bids).length
  if (bidsPlaced >= biddingOrder.value.length) return undefined

  const player = biddingOrder.value[bidsPlaced]
  return {
    ...player,
    isLastBidder: bidsPlaced === biddingOrder.value.length - 1
  }
})

const currentBidTotal = computed(() => {
  return Object.values(currentRound.value.bids).reduce((sum, bid) => sum + bid, 0)
})

const forbiddenBid = computed(() => {
  if (!currentPlayerForBid.value?.isLastBidder) return null
  return currentRound.value.cardsPerPlayer - currentBidTotal.value
})

const possibleBids = computed(() => {
  return Array.from({ length: currentRound.value.cardsPerPlayer + 1 }, (_, i) => i)
})

const isLastRound = computed(() => {
  return currentRound.value.roundNumber === props.game.totalRounds
})

const isBidAllowed = (bid: number): boolean => {
  if (!currentPlayerForBid.value) return false
  return isValidBid(
    bid,
    currentPlayerForBid.value.id,
    currentRound.value.dealerId,
    currentRound.value.bids,
    currentRound.value.cardsPerPlayer,
    props.game.players.length
  )
}

const selectBid = (bid: number) => {
  if (isBidAllowed(bid)) {
    selectedBid.value = bid
  }
}

const submitBid = () => {
  if (selectedBid.value === null || !currentPlayerForBid.value || !isBidAllowed(selectedBid.value)) return
  
  emit('bid-submitted', { 
    playerId: currentPlayerForBid.value.id, 
    bid: selectedBid.value 
  })
  
  selectedBid.value = null
  showBidModal.value = false
}

const initializePlayingPhase = () => {
  // Reset playing state
  playerResults.value = {}
  props.game.players.forEach(player => {
    playerResults.value[player.id] = null
  })
}

const setPlayerResult = (playerId: string, won: boolean) => {
  playerResults.value[playerId] = won
}

const submitResults = () => {
  if (!allPlayersSelected.value) return
  
  completeRound()
  showResultsModal.value = false
}

const completeRound = () => {
  currentRound.value.phase = 'completed'
  
  // Calculate scores based on won/lost results
  props.game.players.forEach(player => {
    const bid = currentRound.value.bids[player.id] || 0
    const won = playerResults.value[player.id]
    
    let roundScore = 0
    if (won) {
      // Player made their bid exactly - use the proper scoring function
      roundScore = calculateScore(bid, bid, props.game.settings.scoringSystem)
    } else {
      // Player failed their bid
      roundScore = 0
    }
    
    player.score += roundScore
  })
  
  emit('round-completed')
}

const nextRound = () => {
  if (isLastRound.value) {
    emit('game-completed')
  } else {
    // Will be handled by parent component
    emit('round-completed')
  }
}

// Trump suit display
const trumpSymbol = computed(() => {
  const suit = currentRound.value.trumpSuit
  if (!suit) return 'N/A'
  const symbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }
  return symbols[suit]
})

const trumpColor = computed(() => {
  const suit = currentRound.value.trumpSuit
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'
})
</script>

<style scoped>
.game-board {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
