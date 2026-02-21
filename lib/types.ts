export type Role = "user" | "newface";

export type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  ts: number;
};

export type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
};