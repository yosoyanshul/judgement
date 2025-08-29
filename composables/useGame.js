export const useGame = () => {
  // Calculate scores based on scoring system
  const calculateScore = (bid, actual, scoringSystem) => {
    if (bid !== actual) return 0

    if (scoringSystem === 'traditional') {
      return 10 + actual
    } else {
      // Progressive: 15 for 1, 25 for 2, 35 for 3, etc.
      return actual === 0 ? 10 : 10 + (actual * 10) + 5
    }
  }

  // Check if bid is valid (last bidder restriction)
  const isValidBid = (
    bid, 
    playerId, 
    dealerId, 
    currentBids,
    cardsPerPlayer,
    playerCount
  ) => {
    // Basic validation
    if (bid < 0 || bid > cardsPerPlayer) return false

    // Last bidder restriction: total bids cannot equal total tricks available
    const bidsPlaced = Object.keys(currentBids).length
    const isLastBidder = bidsPlaced === playerCount - 1
    
    if (isLastBidder) {
      const totalBidsWithoutLast = Object.values(currentBids).reduce((sum, b) => sum + b, 0)
      const totalWithThisBid = totalBidsWithoutLast + bid
      
      // The restriction only applies if it's possible to make total equal to tricks
      // If current total is already > tricks, dealer can bid anything (restriction already violated)
      if (totalBidsWithoutLast > cardsPerPlayer) {
        return true // Can bid anything since restriction is impossible to meet
      }
      
      // Otherwise, cannot make total equal to cards per player (number of tricks)
      return totalWithThisBid !== cardsPerPlayer
    }

    return true
  }

  // Generate trump rotation
  const generateTrumpRotation = (totalRounds) => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades']
    // Shuffle first 4, then repeat pattern
    const shuffled = [...suits].sort(() => Math.random() - 0.5)
    const rotation = []
    
    for (let i = 0; i < totalRounds; i++) {
      rotation.push(shuffled[i % 4])
    }
    
    return rotation
  }

  // Create new game
  const createNewGame = (settings) => {
    const players = settings.playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      score: 0,
      isDealer: index === 0
    }))

    const maxCards = Math.floor(52 / players.length)
    const totalRounds = (maxCards * 2) - 1

    // Ensure trump rotation is always generated
    const gameSettings = {
      ...settings,
      trumpRotation: settings.trumpRotation || generateTrumpRotation(totalRounds)
    }

    return {
      id: Date.now().toString(),
      players,
      settings: gameSettings,
      currentRound: 1,
      totalRounds,
      currentPhase: 'bidding',
      rounds: [],
      maxCards,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  // Start new round
  const startNewRound = (game) => {
    const roundNumber = game.currentRound
    const maxCards = game.maxCards
    
    // Calculate cards per player for this round
    // Start with maxCards, go down to 1, then back up to maxCards
    let cardsPerPlayer
    if (roundNumber <= maxCards) {
      cardsPerPlayer = maxCards - roundNumber + 1
    } else {
      cardsPerPlayer = roundNumber - maxCards
    }

    // Rotate dealer
    const currentDealerIndex = game.players.findIndex(p => p.isDealer)
    game.players.forEach(p => p.isDealer = false)
    const nextDealerIndex = (currentDealerIndex + 1) % game.players.length
    game.players[nextDealerIndex].isDealer = true

    const trumpSuit = game.settings.trumpRotation[roundNumber - 1]

    const round = {
      roundNumber,
      cardsPerPlayer,
      trumpSuit,
      dealerId: game.players[nextDealerIndex].id,
      bids: {},
      tricks: [],
      scores: {},
      phase: 'bidding'
    }

    return round
  }

  return {
    calculateScore,
    isValidBid,
    generateTrumpRotation,
    createNewGame,
    startNewRound
  }
}
