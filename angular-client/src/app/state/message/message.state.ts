import { Message } from './message.model';

export interface MessageState {
  messages: Map<string, Map<string, Message[]>>;
  isLoading: boolean;
}

export const initialState: MessageState = {
  messages: new Map<string, Map<string, Message[]>>(),
  isLoading: false,
};
