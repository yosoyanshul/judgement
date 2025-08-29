<template>
  <div class="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold text-gray-800 mb-4">
        🎉 Game Complete!
      </h2>
      <p class="text-lg text-gray-600">
        Congratulations to all players on a great game!
      </p>
    </div>

    <!-- Winner Announcement -->
    <div v-if="winner" class="text-center mb-8">
      <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6 mb-4">
        <h3 class="text-2xl font-bold mb-2">🏆 Winner</h3>
        <div class="text-3xl font-bold">{{ winner.name }}</div>
        <div class="text-xl">{{ winner.score }} points</div>
      </div>
    </div>

    <!-- Final Scoreboard -->
    <div class="mb-8">
      <h3 class="text-2xl font-semibold text-center mb-6">Final Standings</h3>
      
      <div class="space-y-3">
        <div
          v-for="(player, index) in sortedPlayers"
          :key="player.id"
          class="flex items-center justify-between p-4 rounded-lg border-2"
          :class="[
            index === 0 ? 'border-yellow-400 bg-yellow-50' :
            index === 1 ? 'border-gray-400 bg-gray-50' :
            index === 2 ? 'border-orange-400 bg-orange-50' :
            'border-gray-200 bg-gray-50'
          ]"
        >
          <div class="flex items-center space-x-4">
            <div class="text-2xl font-bold text-gray-600">
              #{{ index + 1 }}
            </div>
            <div>
              <div class="text-lg font-semibold">{{ player.name }}</div>
              <div class="text-sm text-gray-600">
                {{ getPlayerStats(player.id) }}
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-600">
              {{ player.score }}
            </div>
            <div class="text-sm text-gray-600">points</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Statistics -->
    <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="text-center p-4 bg-blue-50 rounded-lg">
        <div class="text-2xl font-bold text-blue-600">{{ game?.totalRounds }}</div>
        <div class="text-sm text-gray-600">Rounds Played</div>
      </div>
      
      <div class="text-center p-4 bg-green-50 rounded-lg">
        <div class="text-2xl font-bold text-green-600">{{ totalTricks }}</div>
        <div class="text-sm text-gray-600">Total Tricks</div>
      </div>
      
      <div class="text-center p-4 bg-purple-50 rounded-lg">
        <div class="text-2xl font-bold text-purple-600">{{ gameTime }}</div>
        <div class="text-sm text-gray-600">Game Duration</div>
      </div>
    </div>

    <!-- Round by Round Results -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Round by Round Results</h3>
      
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-200 rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left">Round</th>
              <th class="px-4 py-2 text-left">Cards</th>
              <th class="px-4 py-2 text-left">Trump</th>
              <th v-for="player in game?.players" :key="player.id" class="px-4 py-2 text-center">
                {{ player.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="round in game?.rounds" :key="round.roundNumber" class="border-t">
              <td class="px-4 py-2 font-medium">{{ round.roundNumber }}</td>
              <td class="px-4 py-2">{{ round.cardsPerPlayer }}</td>
              <td class="px-4 py-2">
                <span class="capitalize">{{ round.trumpSuit }}</span>
                <span :class="getTrumpColor(round.trumpSuit)">{{ getTrumpSymbol(round.trumpSuit) }}</span>
              </td>
              <td v-for="player in game?.players" :key="player.id" class="px-4 py-2 text-center">
                <div class="text-sm">
                  <div>{{ round.bids[player.id] }}/{{ getPlayerTricksInRound(player.id, round) }}</div>
                  <div class="font-bold" :class="round.scores[player.id] > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ round.scores[player.id] || 0 }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        @click="$emit('new-game')"
        class="px-8 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-colors"
      >
        🎮 New Game
      </button>
      
      <button
        @click="exportResults"
        class="px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-colors"
      >
        📊 Export Results
      </button>
      
      <button
        @click="$emit('continue-game')"
        class="px-8 py-3 bg-gray-500 text-white text-lg font-semibold rounded-lg hover:bg-gray-600 transition-colors"
      >
        📋 View Game
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game, Player, Round } from '~/types/game'

const props = defineProps<{
  game: Game | null
}>()

defineEmits<{
  newGame: []
  continueGame: []
}>()

// Computed properties
const sortedPlayers = computed((): Player[] => {
  if (!props.game) return []
  return [...props.game.players].sort((a, b) => b.score - a.score)
})

const winner = computed((): Player | null => {
  return sortedPlayers.value[0] || null
})

const totalTricks = computed((): number => {
  if (!props.game) return 0
  return props.game.rounds.reduce((total, round) => total + round.cardsPerPlayer, 0)
})

const gameTime = computed((): string => {
  if (!props.game) return '0m'
  const start = new Date(props.game.createdAt)
  const end = new Date(props.game.updatedAt)
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
  return `${diff}m`
})

// Methods
const getPlayerStats = (playerId: string): string => {
  if (!props.game) return ''
  
  let correctBids = 0
  let totalRounds = 0
  
  props.game.rounds.forEach(round => {
    if (round.bids[playerId] !== undefined) {
      totalRounds++
      const bid = round.bids[playerId]
      const actual = getPlayerTricksInRound(playerId, round)
      if (bid === actual) correctBids++
    }
  })
  
  const accuracy = totalRounds > 0 ? Math.round((correctBids / totalRounds) * 100) : 0
  return `${correctBids}/${totalRounds} bids correct (${accuracy}%)`
}

const getPlayerTricksInRound = (playerId: string, round: Round): number => {
  return round.tricks.reduce((count, trick) => {
    return count + (trick.winnerId === playerId ? 1 : 0)
  }, 0)
}

const getTrumpSymbol = (suit: string | null): string => {
  if (!suit) return ''
  const symbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }
  return symbols[suit as keyof typeof symbols] || ''
}

const getTrumpColor = (suit: string | null): string => {
  if (!suit) return ''
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black'
}

const exportResults = () => {
  if (!props.game) return
  
  const results = {
    gameId: props.game.id,
    players: props.game.players.map(p => ({
      name: p.name,
      finalScore: p.score,
      stats: getPlayerStats(p.id)
    })),
    rounds: props.game.rounds.map(round => ({
      round: round.roundNumber,
      cards: round.cardsPerPlayer,
      trump: round.trumpSuit,
      results: props.game!.players.map(p => ({
        player: p.name,
        bid: round.bids[p.id],
        won: getPlayerTricksInRound(p.id, round),
        score: round.scores[p.id]
      }))
    })),
    winner: winner.value?.name,
    gameTime: gameTime.value,
    createdAt: props.game.createdAt
  }
  
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `judgement-game-${props.game.id}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
