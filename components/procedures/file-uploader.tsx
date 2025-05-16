"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface FileUploaderProps {
  accept: string
  maxSize: number // in MB
  onFileChange: (file: File | null) => void
}

export function FileUploader({ accept, maxSize, onFileChange }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (!selectedFile) {
      setFile(null)
      onFileChange(null)
      return
    }

    // Check file size
    const fileSizeInMB = selectedFile.size / (1024 * 1024)
    if (fileSizeInMB > maxSize) {
      setError(`File size exceeds the maximum limit of ${maxSize}MB.`)
      setFile(null)
      onFileChange(null)
      return
    }

    // Check file type
    if (
      accept !== "*" &&
      !accept.split(",").some((type) => {
        if (type.startsWith(".")) {
          // Check file extension
          return selectedFile.name.toLowerCase().endsWith(type.toLowerCase())
        } else {
          // Check MIME type
          return type.includes("*") ? selectedFile.type.startsWith(type.split("*")[0]) : selectedFile.type === type
        }
      })
    ) {
      setError(`Invalid file type. Please upload a ${accept} file.`)
      setFile(null)
      onFileChange(null)
      return
    }

    setError(null)
    setFile(selectedFile)
    onFileChange(selectedFile)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <input type="file" accept={accept} onChange={handleFileChange} ref={fileInputRef} className="hidden" />

      {!file ? (
        <Button type="button" variant="outline" onClick={handleButtonClick} className="w-full py-8 border-dashed">
          <Upload className="mr-2 h-4 w-4" />
          Choose File
        </Button>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-md">
          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
          <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)}MB</p>}
    </div>
  )
}
