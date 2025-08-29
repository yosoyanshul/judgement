export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: Suit
  value: CardValue
  displayValue: string
}

export interface Player {
  id: string
  name: string
  score: number
  isDealer: boolean
  currentBid?: number
  tricksWon?: number
  cards?: Card[]
}

export interface Trick {
  id: string
  cards: Array<{
    playerId: string
    card: Card
  }>
  winnerId: string
  leadSuit: Suit
}

export interface Round {
  roundNumber: number
  cardsPerPlayer: number
  trumpSuit: Suit | null
  dealerId: string
  bids: Record<string, number>
  tricks: Trick[]
  scores: Record<string, number>
  phase: 'bidding' | 'playing' | 'completed'
}

export interface GameSettings {
  playerNames: string[]
  scoringSystem: 'traditional' | 'progressive'
  maxRounds?: number
  trumpRotation?: Suit[]
}

export interface Game {
  id: string
  players: Player[]
  settings: GameSettings & { trumpRotation: Suit[] }
  currentRound: number
  totalRounds: number
  currentPhase: 'bidding' | 'playing' | 'completed'
  rounds: Round[]
  maxCards: number
  winner?: Player
  isCompleted?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GameState {
  currentPlayer: string
  currentTrick?: Trick
  lastTrickWinner?: string
  isGameOver: boolean
}

// Scoring systems
export type ScoringSystem = {
  traditional: (bid: number, actual: number) => number
  progressive: (bid: number, actual: number) => number
}

// Card utilities
export interface CardDeck {
  cards: Card[]
  dealt: Card[]
  remaining: Card[]
}

// UI State
export interface UIState {
  selectedCard?: Card
  showScores: boolean
  currentView: 'game' | 'scores' | 'settings'
}
