import LocalStorageKeys from "@/config/localStorageKeys";
import Message from "@/types/message.type";
import { StateCreator } from "zustand";

export interface ReplyMessageSlice {
  replyMessage: Message | null;
  setReplyMessage: (message: Message) => void;
  removeReplyMessage: () => void;
}

export const createReplyMessageSlice: StateCreator<ReplyMessageSlice> = (
  set,
  get,
) => ({
  replyMessage: null,
  setReplyMessage: (message: Message) => {
    set({ replyMessage: message });
  },
  removeReplyMessage: () => {
    set({ replyMessage: null });
  },
});
