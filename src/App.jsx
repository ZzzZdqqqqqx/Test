import React, { useState } from 'react'
import { Container, Paper, Typography, Button, Alert, Snackbar } from '@mui/material'
import FileUploader from './components/FileUploader'
import AnnotationResults from './components/AnnotationResults'
import { processOWLFile } from './utils/owlProcessor'
import { performAnnotation } from './utils/annotationProcessor'
import { extractTextFromPDF } from './utils/pdfProcessor'

function App() {
  const [owlData, setOwlData] = useState(null)
  const [textToAnnotate, setTextToAnnotate] = useState(null)
  const [annotations, setAnnotations] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleOWLUpload = async (file) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Processing OWL file:', file.name)
      const data = await processOWLFile(file)
      console.log('Processed OWL entities:', data.length)
      setOwlData(data)
    } catch (err) {
      console.error('Error processing OWL file:', err)
      setError('Failed to process OWL file: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTextUpload = async (file) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Processing file:', file.name)
      
      let text
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file)
      } else {
        text = await file.text()
      }
      
      console.log('Extracted text length:', text.length)
      setTextToAnnotate(text)
    } catch (err) {
      console.error('Error processing file:', err)
      setError('Failed to process file: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const runAnnotation = () => {
    try {
      setError(null)
      if (!owlData || !textToAnnotate) {
        setError('Please upload both OWL and text files first')
        return
      }
      
      console.log('Running annotation...')
      const results = performAnnotation(textToAnnotate, owlData)
      console.log('Annotation results:', results.length)
      setAnnotations(results)
    } catch (err) {
      console.error('Error during annotation:', err)
      setError('Failed to perform annotation: ' + err.message)
    }
  }

  const exportToCSV = () => {
    try {
      if (!annotations.length) {
        setError('No annotations to export')
        return
      }

      const csvContent = "data:text/csv;charset=utf-8," + 
        "Term,Entity,Score\n" +
        annotations.map(a => `"${a.term}","${a.entity}",${a.score}`).join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "annotations.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error exporting CSV:', err)
      setError('Failed to export CSV: ' + err.message)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          OWL Annotation Tool
        </Typography>
        
        <FileUploader 
          title="Upload OWL File" 
          onUpload={handleOWLUpload} 
          accept=".owl,.rdf"
          disabled={loading}
        />
        
        <FileUploader 
          title="Upload Text to Annotate" 
          onUpload={handleTextUpload} 
          accept=".txt,.pdf"
          disabled={loading}
        />

        <Button 
          variant="contained" 
          onClick={runAnnotation}
          disabled={!owlData || !textToAnnotate || loading}
          sx={{ mt: 2, mr: 2 }}
        >
          Run Annotation
        </Button>

        <Button 
          variant="outlined" 
          onClick={exportToCSV}
          disabled={!annotations.length || loading}
          sx={{ mt: 2 }}
        >
          Export to CSV
        </Button>

        {loading && (
          <Typography sx={{ mt: 2 }} color="primary">
            Processing...
          </Typography>
        )}

        <AnnotationResults annotations={annotations} />

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  )
}

export default App
