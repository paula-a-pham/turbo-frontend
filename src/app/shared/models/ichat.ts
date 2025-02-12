import { Timestamp } from '@angular/fire/firestore';
import { IMessage } from './imessage';
import { IConversation } from './iconversation';

export interface IChatBase {
  id?: string;
  name?: string;
}
export interface IChat extends IChatBase {
  userId: string;
  systemMessage: IMessage;
  conversations: IConversation[];
  creationDate: Timestamp;
  lastUpdate: Timestamp;
}

export interface IChatUpdateDto extends IChatBase {
  userId?: string;
  systemMessage?: IMessage;
  conversations?: IConversation[];
  creationDate?: Timestamp;
  lastUpdate?: Timestamp;
}
