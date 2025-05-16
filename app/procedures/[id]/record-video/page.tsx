"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Video, Mic, MicOff, Camera, CameraOff, Play, Pause, Square, Trash, Upload } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Icons } from "@/components/icons"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function RecordVideoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("record")
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      stopMediaTracks()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }

  const setupCamera = async () => {
    try {
      stopMediaTracks()

      const constraints = {
        audio: isAudioEnabled,
        video: isVideoEnabled ? { width: 1280, height: 720 } : false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      return true
    } catch (err) {
      console.error("Error accessing media devices:", err)
      toast({
        title: "Camera access error",
        description: "Could not access your camera or microphone. Please check permissions.",
        variant: "destructive",
      })
      return false
    }
  }

  // Helper function to check if a MIME type is supported
  const getSupportedMimeType = () => {
    const types = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm;codecs=h264,opus",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
      "video/mp4",
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return null
  }

  const startRecording = async () => {
    const success = await setupCamera()
    if (!success || !streamRef.current) return

    chunksRef.current = []

    try {
      // Get a supported MIME type
      const supportedMimeType = getSupportedMimeType()

      if (!supportedMimeType) {
        throw new Error("No supported video recording format found in this browser")
      }

      const options = { mimeType: supportedMimeType }
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options)

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        // Determine the correct MIME type for the Blob
        const blobMimeType = supportedMimeType.split(";")[0] // Get just the main part (video/webm or video/mp4)
        const blob = new Blob(chunksRef.current, { type: blobMimeType })
        setRecordedBlob(blob)
        setActiveTab("preview")

        // Reset recording state
        setIsRecording(false)
        setIsPaused(false)
        setRecordingTime(0)
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }

      mediaRecorderRef.current.start(1000) // Collect data every second
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Error starting recording:", err)
      toast({
        title: "Recording error",
        description: err instanceof Error ? err.message : "Could not start recording. Please try again.",
        variant: "destructive",
      })
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      stopMediaTracks()
    }
  }

  const discardRecording = () => {
    setRecordedBlob(null)
    setActiveTab("record")
  }

  const saveRecording = async () => {
    if (!recordedBlob) return

    setIsUploading(true)

    try {
      // In a real app, this would upload the video to a server
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Video saved successfully",
        description: "Your video has been uploaded and attached to the procedure.",
      })

      // Redirect back to the procedure edit page
      router.push(`/procedures/${params.id}/edit`)
    } catch (err) {
      console.error("Error saving recording:", err)
      toast({
        title: "Upload error",
        description: "Could not upload the video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleVideo = async () => {
    setIsVideoEnabled(!isVideoEnabled)
    if (isRecording) {
      toast({
        title: "Camera settings changed",
        description: "Changes will apply when you start a new recording.",
      })
    }
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    if (isRecording) {
      toast({
        title: "Microphone settings changed",
        description: "Changes will apply when you start a new recording.",
      })
    }
  }

  return (
    <DashboardShell>
      <Breadcrumb
        items={[
          { title: "Procedures", href: "/procedures" },
          { title: "Procedure", href: `/procedures/${params.id}` },
          { title: "Record Video", href: `/procedures/${params.id}/record-video` },
        ]}
        className="mb-2"
      />
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <DashboardHeader
          heading="Record Procedure Video"
          text="Create an explanation video for patients about this procedure."
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Video Recording</CardTitle>
            <CardDescription>
              Record a video explaining the procedure to patients. Keep it clear, concise, and informative.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="record" disabled={isRecording || isProcessing}>
                  Record
                </TabsTrigger>
                <TabsTrigger value="preview" disabled={!recordedBlob || isRecording}>
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="record" className="space-y-4 pt-4">
                <div className="aspect-video bg-black rounded-md overflow-hidden relative">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full"></video>

                  {isRecording && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md flex items-center">
                      <div className="h-3 w-3 rounded-full bg-white mr-2 animate-pulse"></div>
                      {isPaused ? "Paused" : "Recording"} - {formatTime(recordingTime)}
                    </div>
                  )}

                  {!isRecording && !streamRef.current && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Video className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-lg font-medium">Ready to record</p>
                        <p className="text-sm opacity-80">Click the Start Recording button below to begin</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="icon" onClick={toggleVideo} disabled={isRecording && !isPaused}>
                    {isVideoEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={toggleAudio} disabled={isRecording && !isPaused}>
                    {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  {!isRecording ? (
                    <Button onClick={startRecording} disabled={isProcessing}>
                      <Video className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                  ) : (
                    <>
                      {isPaused ? (
                        <Button onClick={resumeRecording}>
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      ) : (
                        <Button onClick={pauseRecording}>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </Button>
                      )}
                      <Button variant="destructive" onClick={stopRecording}>
                        <Square className="mr-2 h-4 w-4" />
                        Stop
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4 pt-4">
                {recordedBlob && (
                  <>
                    <div className="aspect-video bg-black rounded-md overflow-hidden">
                      <video src={URL.createObjectURL(recordedBlob)} controls className="w-full h-full"></video>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                      <Button variant="outline" onClick={discardRecording} disabled={isUploading}>
                        <Trash className="mr-2 h-4 w-4" />
                        Discard
                      </Button>
                      <Button onClick={saveRecording} disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Save & Upload
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 items-start">
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium">Recording Tips:</h4>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Speak clearly and at a moderate pace</li>
                <li>Explain the procedure in simple, non-technical language</li>
                <li>Cover the purpose, process, risks, and recovery</li>
                <li>Keep the video under 5 minutes for better patient engagement</li>
                <li>Ensure good lighting and minimal background noise</li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}
