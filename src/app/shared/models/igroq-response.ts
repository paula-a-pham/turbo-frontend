import { IMessage } from './imessage';

export interface IGroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: IChoice[];
  usage: IUsage;
  system_fingerprint: string;
  x_groq: IXGroq;
}

export interface IChoice {
  index: number;
  message: IMessage;
  logprobs: any;
  finish_reason: string;
}

export interface IUsage {
  queue_time: number;
  prompt_tokens: number;
  prompt_time: number;
  completion_tokens: number;
  completion_time: number;
  total_tokens: number;
  total_time: number;
}

export interface IXGroq {
  id: string;
}
