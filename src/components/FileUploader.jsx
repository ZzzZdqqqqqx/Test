import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Paper, Typography, CircularProgress } from '@mui/material'

function FileUploader({ title, onUpload, accept, disabled }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0])
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: accept ? {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/rdf+xml': ['.owl', '.rdf']
    } : undefined,
    multiple: false,
    disabled
  })

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 3,
        mt: 2,
        mb: 2,
        border: '2px dashed #ccc',
        cursor: disabled ? 'not-allowed' : 'pointer',
        bgcolor: isDragActive ? '#fafafa' : 'white',
        opacity: disabled ? 0.7 : 1,
        '&:hover': {
          bgcolor: disabled ? 'white' : '#fafafa'
        }
      }}
    >
      <input {...getInputProps()} />
      <Typography align="center">
        {disabled ? (
          <CircularProgress size={20} sx={{ mr: 1 }} />
        ) : isDragActive ? (
          'Drop the file here...'
        ) : (
          `${title} - Drag & drop or click to select`
        )}
      </Typography>
    </Paper>
  )
}

export default FileUploader
