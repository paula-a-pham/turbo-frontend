import { firebaseConfig } from './firebase-config';
import { testGroqApiKey } from './groq-api-keys';

export const environment = {
  production: true,
  firebase: firebaseConfig,
  groqApiUrl: 'https://api.groq.com/openai/v1/chat/completions',
  groqApiKey: testGroqApiKey,
};
