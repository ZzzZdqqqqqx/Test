import React from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography 
} from '@mui/material'

function AnnotationResults({ annotations }) {
  if (!annotations.length) {
    return null
  }

  return (
    <div style={{ marginTop: 20 }}>
      <Typography variant="h6" gutterBottom>
        Annotation Results
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Term</TableCell>
              <TableCell>Entity</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {annotations.map((annotation, index) => (
              <TableRow key={index}>
                <TableCell>{annotation.term}</TableCell>
                <TableCell>{annotation.entity}</TableCell>
                <TableCell>{annotation.score.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default AnnotationResults
