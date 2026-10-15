import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  RecordingPresets,
} from 'expo-audio';

export { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync };

export async function ensureRecordingReady() {
  const { granted } = await requestRecordingPermissionsAsync();
  if (!granted) {
    throw new Error('Microphone permission is required to record meetings.');
  }
  await setAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
  });
}
