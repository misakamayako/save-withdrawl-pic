export interface Sender {
    user_id: number;
    nickname: string;
    card?: string;  // 这里假设 `card` 是可选字段，因为你提供的 JSON 没有给出值
    role: string;
    title: string;
}

export type MessageData = ReplyData| ImageData | TextData

export interface ReplyData {
    type:'reply',
    data:{
        id:number
    }
}
export interface ImageData {
    type:'image',
    data:{
        file:string,
        subType:0,
        url:string,
        file_size:number
    }
}
export interface TextData {
    type:'text',
    data:string
}
export  interface MessageInterface {
    self_id: number;
    user_id: number;
    time: number;
    message_id: number;
    real_id: number;
    message_seq: number;
    message_type: string;
    sender: Sender;
    raw_message: string;
    font: number;
    sub_type: string;
    message: MessageData[];
    message_format: string;
    post_type: "message";
    group_id: number;
}
export interface NoticeEvent {
    time: number; // 时间戳
    self_id: number; // 当前机器人 ID
    post_type: "notice"; // 通知类型
    notice_type: string; // 群消息撤回通知
    operator_id: number; // 操作人 ID
    message_id: number; // 被撤回的消息 ID
    group_id: number; // 群组 ID
    user_id: number; // 撤回消息的用户 ID
}

