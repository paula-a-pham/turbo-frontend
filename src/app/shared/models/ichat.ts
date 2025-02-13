import { Timestamp } from '@angular/fire/firestore';
import { IMessage } from './imessage';

export interface IChatBase {
  id?: string;
  name?: string;
}
export interface IChat extends IChatBase {
  messages: IMessage[];
  userId: string;
  creationDate: Timestamp;
  lastUpdate: Timestamp;
}

export interface IChatUpdateDto extends IChatBase {
  messages?: IMessage[];
  lastUpdate?: Timestamp;
}
