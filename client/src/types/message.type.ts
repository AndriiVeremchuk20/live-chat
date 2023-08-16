import AppUser from "./user.type";

interface Message {
  id: string;
  text: string;
  chat_id: string;
  isRead: boolean;
  sender_id: string;
  sender?: AppUser;
  reciver_id: string;
  receiver?: AppUser;
  created_at: string;
}

export default Message;

// for example
//
//created_at"2023-07-31T13:55:31.284Z"
//id"clkqxndjq0003sbps7rtf32t0"
//reciver_id "UVjjSD9ehVgvHb1b7904NoZnrbB3"
//sender_id"AwfixhhDuZSf0WVkE5skmXjI4F62"
//text"emmm, ok :-|"
