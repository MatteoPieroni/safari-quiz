type SpeechArgs = {
  onResult: (event: SpeechRecognitionEvent) => void;
  onFinished: (event: Event) => void;
};

export class Speech extends SpeechRecognition {
  constructor({ onFinished, onResult }: SpeechArgs) {
    super();

    this.continuous = false;
    this.lang = 'en-UK';
    this.interimResults = false;
    this.maxAlternatives = 1;

    this.onresult = onResult;
    this.onend = onFinished;
  }
}
