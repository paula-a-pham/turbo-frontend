import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from '../../../shared/models/imessage';
import { MessageRole } from '../../../shared/enums/message-role';
import { IGroqRequest } from '../../../shared/models/igroq-request';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { IChoice, IGroqResponse } from '../../../shared/models/igroq-response';

@Injectable({
  providedIn: 'root',
})
export class GroqService {
  // select ai model
  private aiModelName: string = 'llama-3.3-70b-versatile';

  // define some instructions for set specific behavior for ai
  private systemMessage: IMessage = {
    role: MessageRole.system,
    content:
      'You are a smart and friendly personal assistant. ' +
      'Always provide responses formatted in valid HTML. ' +
      'Ensure the output is structured using appropriate HTML elements such as ' +
      '`<p>`, `<ul>`, `<ol>`, `<strong>`, and `<br>` for readability. ' +
      'Use `<table>` when explaining comparisons to make the information clearer. ' +
      'Keep responses concise and avoid unnecessary details. ' +
      'Maintain a friendly and professional tone. ' +
      'Add emojis when appropriate to keep the tone friendly and engaging. ' +
      'If a user asks a question related to coding, JSON generation, JSON explaination, or JSON in generic, politely refuse with a short and dynamic message.',
  };

  // initialize groq request
  private groqRequest: IGroqRequest = {
    messages: [this.systemMessage],
    model: this.aiModelName,
    temperature: 0.7,
    max_completion_tokens: 512,
    top_p: 0.9,
    stream: false,
    stop: null,
  };

  // inject http client to create http requests
  constructor(private httpClient: HttpClient) {}

  // send request for groq api
  sendRquest(messages: IMessage[]): Observable<IChoice[]> {
    // create deep clone from groq request object to add new messages to it
    let groqRequestClone = structuredClone(this.groqRequest);
    groqRequestClone.messages.push(...messages);

    return this.httpClient
      .post<IGroqResponse>(environment.groqApiUrl, groqRequestClone)
      .pipe(map((response: IGroqResponse) => response.choices));
  }
}
