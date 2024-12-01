export async function processOWLFile(file) {
  try {
    const text = await file.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(text, 'text/xml')
    
    // Handle parsing errors
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error('Invalid XML format')
    }

    const entities = []
    
    // Extract classes and their labels
    const classes = xmlDoc.getElementsByTagName('owl:Class')
    for (const cls of classes) {
      const about = cls.getAttribute('rdf:about')
      const labels = cls.getElementsByTagName('rdfs:label')
      
      if (labels.length > 0) {
        entities.push({
          uri: about,
          label: labels[0].textContent
        })
      } else {
        // If no label, use the last part of the URI
        const label = about ? about.split(/[/#]/).pop() : ''
        if (label) {
          entities.push({
            uri: about,
            label: label
          })
        }
      }
    }

    // Extract named individuals
    const individuals = xmlDoc.getElementsByTagName('owl:NamedIndividual')
    for (const individual of individuals) {
      const about = individual.getAttribute('rdf:about')
      const labels = individual.getElementsByTagName('rdfs:label')
      
      if (labels.length > 0) {
        entities.push({
          uri: about,
          label: labels[0].textContent
        })
      } else {
        const label = about ? about.split(/[/#]/).pop() : ''
        if (label) {
          entities.push({
            uri: about,
            label: label
          })
        }
      }
    }

    // Extract properties
    const properties = [
      ...Array.from(xmlDoc.getElementsByTagName('owl:ObjectProperty')),
      ...Array.from(xmlDoc.getElementsByTagName('owl:DatatypeProperty'))
    ]
    
    for (const prop of properties) {
      const about = prop.getAttribute('rdf:about')
      const labels = prop.getElementsByTagName('rdfs:label')
      
      if (labels.length > 0) {
        entities.push({
          uri: about,
          label: labels[0].textContent
        })
      } else {
        const label = about ? about.split(/[/#]/).pop() : ''
        if (label) {
          entities.push({
            uri: about,
            label: label
          })
        }
      }
    }

    console.log('Parsed entities:', entities.length)
    return entities

  } catch (error) {
    console.error('Error processing OWL file:', error)
    throw new Error(`Failed to process OWL file: ${error.message}`)
  }
}
