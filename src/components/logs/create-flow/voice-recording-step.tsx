"use client";

import { useEffect, useRef, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { CardContent, CardHeader, CardTitle, DashboardCard } from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const WAVEFORM_HEIGHTS = [
  30, 55, 40, 70, 45, 85, 35, 60, 50, 75, 40, 65, 30, 55, 45, 80, 35, 60, 50,
  70, 40, 55, 30, 65,
];

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const globalWindow = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return globalWindow.SpeechRecognition ?? globalWindow.webkitSpeechRecognition ?? null;
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

type VoiceRecordingStepProps = {
  onComplete: (transcript: string, durationSeconds: number, audioBlob: Blob | null) => void;
};

export function VoiceRecordingStep({ onComplete }: VoiceRecordingStepProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [hasSpeechSupport, setHasSpeechSupport] = useState(() => getSpeechRecognitionConstructor() !== null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [manualText, setManualText] = useState("");

  const intervalRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const transcript = `${finalTranscript} ${interimTranscript}`.trim();

  async function startAudioCapture() {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
    } catch {
      mediaRecorderRef.current = null;
    }
  }

  function stopAudioCapture(): Promise<Blob | null> {
    const recorder = mediaRecorderRef.current;
    const stream = mediaStreamRef.current;

    if (!recorder || recorder.state === "inactive") {
      stream?.getTracks().forEach((track) => track.stop());
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      recorder.onstop = () => {
        stream?.getTracks().forEach((track) => track.stop());
        const blob = audioChunksRef.current.length
          ? new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" })
          : null;
        mediaRecorderRef.current = null;
        mediaStreamRef.current = null;
        resolve(blob);
      };
      recorder.stop();
    });
  }

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function handleStart() {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();

    if (!SpeechRecognitionCtor) {
      setHasSpeechSupport(false);
      return;
    }

    setElapsedSeconds(0);
    setFinalTranscript("");
    setInterimTranscript("");
    setPermissionDenied(false);

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let finalChunk = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) {
          finalChunk += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalChunk) {
        setFinalTranscript((current) => `${current} ${finalChunk}`.trim());
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setPermissionDenied(true);
        setIsRecording(false);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsRecording(true);
      void startAudioCapture();
    } catch {
      setPermissionDenied(true);
      setIsRecording(false);
    }
  }

  async function handleStop() {
    recognitionRef.current?.stop();
    setIsRecording(false);
    const audioBlob = await stopAudioCapture();
    onComplete(transcript, elapsedSeconds, audioBlob);
  }

  function handleManualContinue() {
    if (!manualText.trim()) return;
    onComplete(manualText.trim(), 0, null);
  }

  if (!hasSpeechSupport) {
    return (
      <DashboardCard>
        <CardHeader className="border-b border-border/70 px-4 py-3 sm:px-5">
          <CardTitle>Type Your Log</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Voice recognition is not supported in this browser. Type the activity instead and AI will still extract the details.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-4 py-5 sm:px-5">
          <Textarea
            value={manualText}
            onChange={(event) => setManualText(event.target.value)}
            placeholder="Describe what happened, where it happened, priority, and action taken..."
            className="min-h-40 rounded-xl bg-secondary/70 leading-6"
          />
          <Button
            type="button"
            size="lg"
            className="w-full rounded-xl sm:w-auto"
            disabled={!manualText.trim()}
            onClick={handleManualContinue}
          >
            Continue
            <AppIcon name="caret-right" className="size-4" />
          </Button>
        </CardContent>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <CardHeader className="border-b border-border/70 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Record Voice Log</CardTitle>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5">
            <span className={cn("size-2 rounded-full", isRecording ? "animate-pulse bg-red-500" : "bg-muted-foreground/50")} />
            <span className="text-xs font-medium text-muted-foreground">
              {isRecording ? "Listening" : "Ready"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 py-4 sm:px-5">
        <div className="rounded-2xl border border-border bg-gradient-to-b from-secondary/60 to-background p-4 sm:p-5">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={isRecording ? handleStop : handleStart}
              className={cn(
                "relative flex size-24 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-all sm:size-28",
                isRecording
                  ? "bg-destructive shadow-destructive/30"
                  : "bg-primary shadow-primary/30 hover:scale-[1.03]",
              )}
            >
              <span
                className={cn(
                  "absolute inset-[-10px] rounded-full border",
                  isRecording ? "animate-ping border-destructive/40" : "border-primary/25",
                )}
              />
              <span
                className={cn(
                  "absolute inset-[-22px] rounded-full border",
                  isRecording ? "animate-pulse border-destructive/20" : "border-primary/10",
                )}
              />
              <AppIcon name="voice" className="relative size-10 sm:size-12" />
            </button>

            <div className="text-center">
              <p className="font-mono text-2xl font-semibold tracking-wide text-foreground">
                {formatTimer(elapsedSeconds)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isRecording ? "Tap the mic to stop and process" : "Tap the mic to start recording"}
              </p>
            </div>

            <div className="flex h-14 w-full max-w-xl items-center justify-center gap-1 rounded-xl border border-border bg-card/70 px-4">
              {WAVEFORM_HEIGHTS.map((height, index) => (
                <span
                  key={index}
                  className={cn(
                    "w-1 flex-1 rounded-full bg-primary/65 transition-all duration-300",
                    isRecording ? "animate-pulse" : "opacity-35",
                  )}
                  style={{
                    height: `${isRecording ? height : 12}%`,
                    animationDelay: `${index * 60}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="rounded-xl border border-border bg-background p-3">
            <div className="mb-2 flex items-center gap-2">
              <AppIcon name="logs" className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Live Transcript</h3>
            </div>
            {transcript ? (
              <p className="min-h-14 max-h-28 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-foreground">
                <span>{finalTranscript}</span>{" "}
                <span className="text-muted-foreground">{interimTranscript}</span>
              </p>
            ) : (
              <p className="min-h-14 text-sm leading-6 text-muted-foreground">
                Example: EQP-111 has a hydraulic leak near the boom, high priority, stopped operation and informed maintenance.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AppIcon name="ai" className="size-4 text-primary" />
              Good Capture
            </div>
            <ul className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground">
              <li>Equipment code or name</li>
              <li>Issue or activity observed</li>
              <li>Priority or safety impact</li>
              <li>Action taken or next step</li>
            </ul>
          </div>
        </div>

        {permissionDenied ? (
          <div className="space-y-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Microphone access was denied. Allow microphone permission and try again, or type your log below.
            </p>
            <Textarea
              value={manualText}
              onChange={(event) => setManualText(event.target.value)}
              placeholder="Or type the issue here..."
              className="min-h-28 rounded-xl bg-background"
            />
            <Button
              type="button"
              className="w-full rounded-xl sm:w-auto"
              disabled={!manualText.trim()}
              onClick={handleManualContinue}
            >
              Continue
              <AppIcon name="caret-right" className="size-4" />
            </Button>
          </div>
        ) : null}
      </CardContent>
    </DashboardCard>
  );
}
