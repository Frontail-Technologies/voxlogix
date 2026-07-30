"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { useModuleDetail } from "@/features/master-modules/api/module.queries";
import type { ModuleListItem } from "@/features/master-modules/api/module.types";
import type { ExtractedLogFields } from "@/features/logs/api/ai.types";
import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";

import { CreateLogStepper, type CreateLogStage } from "./create-log-stepper";
import { CreateLogWorkspace } from "./create-log-workspace";
import { SelectEquipmentStep } from "./select-equipment-step";
import { SelectModuleStep } from "./select-module-step";
import { VoiceRecordingStep } from "./voice-recording-step";

const AiProcessingStep = dynamic(() => import("./ai-processing-step").then((mod) => mod.AiProcessingStep), { ssr: false });
const AiReviewStep = dynamic(() => import("./ai-review-step").then((mod) => mod.AiReviewStep), { ssr: false });
const AttachmentsLocationStep = dynamic(() => import("./attachments-location-step").then((mod) => mod.AttachmentsLocationStep), { ssr: false });
const LogSubmittedStep = dynamic(() => import("./log-submitted-step").then((mod) => mod.LogSubmittedStep), { ssr: false });

export type CreateLogFlowConfig = {
  logsListHref: string;
  logDetailHref: (logId: string) => string;
};

const DEFAULT_CONFIG: CreateLogFlowConfig = {
  logsListHref: "/admin/logs",
  logDetailHref: (logId) => `/admin/logs/${logId}`,
};

export function CreateLogFlow({ config = DEFAULT_CONFIG }: { config?: CreateLogFlowConfig }) {
  const [stage, setStage] = useState<CreateLogStage>("select-module");
  const [selectedModule, setSelectedModule] = useState<ModuleListItem | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentListItem | null>(null);
  const [transcript, setTranscript] = useState("");
  const [voiceDurationSeconds, setVoiceDurationSeconds] = useState(0);
  const [voiceAudioBlob, setVoiceAudioBlob] = useState<Blob | null>(null);
  const [extractedFields, setExtractedFields] = useState<ExtractedLogFields>({});
  const [createdLogId, setCreatedLogId] = useState<string | null>(null);

  const moduleDetail = useModuleDetail(selectedModule?.id ?? "");
  const moduleFields = moduleDetail.data?.data?.fields ?? [];
  const isVoiceModule = selectedModule?.voiceEnabled ?? true;

  function handleReset() {
    setStage("select-module");
    setSelectedModule(null);
    setSelectedEquipment(null);
    setTranscript("");
    setVoiceDurationSeconds(0);
    setVoiceAudioBlob(null);
    setExtractedFields({});
    setCreatedLogId(null);
  }

  function emptyFieldsFromModule() {
    const empty: ExtractedLogFields = {};
    for (const field of moduleFields) {
      empty[field.key] = field.type === "Number" ? 0 : "";
    }
    return empty;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <DashboardPageHeader
        title="Create Log"
      />

      <CreateLogWorkspace
        stage={stage}
        selectedModule={selectedModule}
        selectedEquipment={selectedEquipment}
        transcript={transcript}
        voiceDurationSeconds={voiceDurationSeconds}
      >
        <CreateLogStepper stage={stage} voiceEnabled={isVoiceModule} />

        {stage === "select-module" ? (
          <SelectModuleStep
            selectedModuleId={selectedModule?.id ?? null}
            onSelect={(module) => {
              setSelectedModule(module);
              setStage("select-equipment");
            }}
          />
        ) : null}

        {stage === "select-equipment" ? (
          <SelectEquipmentStep
            selected={selectedEquipment}
            onSelect={setSelectedEquipment}
            continueLabel={isVoiceModule ? "Continue to Recording" : "Continue to Details"}
            onContinue={() => {
              if (isVoiceModule) {
                setStage("recording");
                return;
              }

              setTranscript("");
              setVoiceDurationSeconds(0);
              setVoiceAudioBlob(null);
              setExtractedFields(emptyFieldsFromModule());
              setStage("review");
            }}
          />
        ) : null}

        {stage === "recording" && isVoiceModule ? (
          <VoiceRecordingStep
            onComplete={(nextTranscript, durationSeconds, audioBlob) => {
              setTranscript(nextTranscript);
              setVoiceDurationSeconds(durationSeconds);
              setVoiceAudioBlob(audioBlob);
              setStage("processing");
            }}
          />
        ) : null}

        {stage === "processing" && selectedModule && isVoiceModule ? (
          <AiProcessingStep
            transcript={transcript}
            moduleId={selectedModule.id}
            equipmentId={selectedEquipment?.id}
            onComplete={(fields) => {
              setExtractedFields(fields);
              setStage("review");
            }}
            onSkip={() => {
              setExtractedFields(emptyFieldsFromModule());
              setStage("review");
            }}
          />
        ) : null}

        {stage === "review" && selectedEquipment && selectedModule ? (
          moduleDetail.isLoading ? (
            <p className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">Loading module fields...</p>
          ) : (
            <AiReviewStep
              equipment={selectedEquipment}
              moduleFields={moduleFields}
              extractedFields={extractedFields}
              onContinue={(fields) => {
                setExtractedFields(fields);
                setStage("attachments");
              }}
              onBack={() => setStage(isVoiceModule ? "recording" : "select-equipment")}
            />
          )
        ) : null}

        {stage === "attachments" && selectedEquipment && selectedModule ? (
          <AttachmentsLocationStep
            equipment={selectedEquipment}
            moduleId={selectedModule.id}
            moduleType={selectedModule.type}
            transcript={transcript}
            voiceDurationSeconds={voiceDurationSeconds}
            voiceAudioBlob={voiceAudioBlob}
            extractedFields={extractedFields}
            onSubmit={(logId) => {
              setCreatedLogId(logId);
              setStage("submitted");
            }}
            onBack={() => setStage("review")}
          />
        ) : null}

        {stage === "submitted" && selectedEquipment ? (
          <LogSubmittedStep
            equipment={selectedEquipment}
            logId={createdLogId}
            logsListHref={config.logsListHref}
            logDetailHref={config.logDetailHref}
            onCreateAnother={handleReset}
          />
        ) : null}
      </CreateLogWorkspace>
    </div>
  );
}
