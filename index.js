export default {
  name: "AudioRecorder",
  data() {
    return {
      isRecording: false,
      mediaRecorder: null,
      recordedChunks: [],
      audioUrl: null,
    };
  },
  methods: {
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = this.onStop;
        this.mediaRecorder.start();
        this.isRecording = true;
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    },
    stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
      }
    },
    onStop() {
      const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
      this.audioUrl = URL.createObjectURL(blob);
    },
  },
  template: `
    <div>
      <button @click="startRecording" :disabled="isRecording">🎙️ Start</button>
      <button @click="stopRecording" :disabled="!isRecording">🛑 Stop</button>
      <audio v-if="audioUrl" :src="audioUrl" controls></audio>
    </div>
  `,
};