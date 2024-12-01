import Fuse from 'fuse.js'

export function performAnnotation(text, owlData) {
  // Split text into words and phrases
  const words = text.split(/\s+/)
  const phrases = generatePhrases(words, 3) // Generate phrases up to 3 words

  // Configure Fuse.js for fuzzy matching
  const fuse = new Fuse(owlData, {
    keys: ['label'],
    includeScore: true,
    threshold: 0.4
  })

  // Perform matching and collect results
  const annotations = []
  const seen = new Set()

  phrases.forEach(phrase => {
    if (seen.has(phrase)) return
    
    const results = fuse.search(phrase)
    if (results.length > 0) {
      const bestMatch = results[0]
      annotations.push({
        term: phrase,
        entity: bestMatch.item.label,
        score: 1 - bestMatch.score
      })
      seen.add(phrase)
    }
  })

  return annotations
}

function generatePhrases(words, maxLength) {
  const phrases = []
  for (let i = 0; i < words.length; i++) {
    for (let j = 1; j <= maxLength && i + j <= words.length; j++) {
      phrases.push(words.slice(i, i + j).join(' '))
    }
  }
  return phrases
}
