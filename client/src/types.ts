export interface InstructionStep {
    order: number;
    timestamp: string;
    instruction: string;
  }
  
 export interface Transcription {
    steps: InstructionStep[];
  }
  