import { AppIcon } from "@/components/common/app-icon";

const WAVEFORM_HEIGHTS = [
  8, 14, 10, 20, 26, 16, 22, 30, 18, 24, 12, 20, 28, 16, 22, 10, 18, 26, 14, 20, 24, 12, 16, 22, 10, 14, 20,
  8,
];

export function VoiceCaptureVisual() {
  return (
    <div className="landing-voice-card">
      <div className="flex items-center justify-between">
        <span className="landing-voice-card-label">
          <span className="landing-voice-card-dot" aria-hidden="true" />
          Live Voice Log
        </span>
        <span className="landing-voice-duration">0:18</span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <span className="landing-voice-mic">
          <AppIcon name="voice" size={20} weight="fill" />
        </span>
        <div className="landing-waveform" aria-hidden="true">
          {WAVEFORM_HEIGHTS.map((height, index) => (
            <span
              key={index}
              className="landing-waveform-bar"
              style={{ height: `${height}px`, animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      </div>

      <p className="landing-voice-transcript">
        &ldquo;We replaced the bearing on Compressor C-201 after abnormal noise. Machine is running normally
        now.&rdquo;
      </p>
    </div>
  );
}
