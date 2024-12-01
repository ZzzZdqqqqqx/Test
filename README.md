# OWL Annotation Web Application

A web-based tool for annotating text documents using OWL ontologies. This application performs fuzzy matching between text content and ontology entities, providing similarity scores for matches.

## Features

- Upload and parse OWL ontology files
- Support for PDF and text file annotation
- Fuzzy matching algorithm for entity recognition
- Similarity scoring system
- Export results to CSV
- Real-time preview of annotations

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open http://localhost:3000 in your browser

## Usage

1. **Upload OWL File**: Click or drag-and-drop your OWL ontology file
2. **Upload Text**: Upload a PDF or text file to annotate
3. **Run Annotation**: Click "Run Annotation" to process the files
4. **View Results**: See matches in the results table
5. **Export**: Download results as CSV file

## Scoring System

The annotation scoring system uses Fuse.js for fuzzy string matching with the following characteristics:

### Score Calculation

- Scores range from 0 to 1 (1 being a perfect match)
- The scoring algorithm considers:
  - Character matching
  - Position of matches
  - Length of matched sequences
  - Word boundaries

### Threshold Settings

- Default threshold: 0.4
- Matches below threshold are discarded
- Higher threshold = stricter matching
- Lower threshold = more lenient matching

### Score Interpretation

- 1.0: Perfect match
- 0.8 - 0.99: Very strong match
- 0.6 - 0.79: Strong match
- 0.4 - 0.59: Moderate match
- < 0.4: Weak match (filtered out)

## Technical Details

### Annotation Process

1. **Text Processing**:
   - Text is split into words and phrases
   - Phrases up to 3 words are generated
   - Special characters are normalized

2. **Matching Algorithm**:
   - Each phrase is compared against ontology entities
   - Fuse.js performs fuzzy matching
   - Best matches above threshold are kept

3. **Score Calculation**:
   ```javascript
   finalScore = 1 - fuseScore
   ```
   where `fuseScore` is the distance-based score from Fuse.js

### Configuration

Default Fuse.js settings:
```javascript
{
  keys: ['label'],
  includeScore: true,
  threshold: 0.4,
  // Lower threshold means more matches but potentially lower quality
}
```

## Limitations

- Only supports XML-formatted OWL files
- PDF text extraction may vary based on PDF structure
- Maximum phrase length of 3 words
- Memory limitations for very large files

## Export Format

CSV output includes:
- Term: Matched text from document
- Entity: Matched entity from ontology
- Score: Similarity score (0-1)

## Error Handling

The application includes comprehensive error handling for:
- Invalid file formats
- Parse errors
- Memory limitations
- Network issues

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License
