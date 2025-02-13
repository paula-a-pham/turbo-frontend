import { firebaseConfig } from './firebase-config';

export const environment = {
  production: true,
  firebase: firebaseConfig,
  groqApiUrl: 'https://api.groq.com/openai/v1/chat/completions',
};
