import { IMessage } from './imessage';

export interface IGroqRequest {
  messages: IMessage[];
  model: string;
  temperature: number;
  max_completion_tokens: number;
  top_p: number;
  stream: boolean;
  stop: string | null;
}
