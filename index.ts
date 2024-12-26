import {WebSocketServer} from 'ws';
import fs from 'node:fs'
import path from 'node:path'
import type {MessageData, MessageInterface, NoticeEvent} from "./types.d.ts";
import downloadFile from "./src/downloadFile.ts";
import {findMessageById, insertMessage} from "./src/dbServer.ts";
import saveFileToOss from "./src/saveFileToOss.ts";
import findFileWithoutExtension from "./src/findFile.ts";
import QRCodeService from "./src/QRCodeService.ts";


const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}
const port = 9961
// 创建 WebSocket 服务器，监听 8080 端口
const wss = new WebSocketServer({port});

// 监听连接事件
wss.on('connection', (ws) => {
    console.log('A client connected');

    // 监听消息事件，接收客户端发送的数据
    ws.on('message', async (message) => {
        const td = new TextDecoder()
        const raw = td.decode(message as ArrayBuffer)
        const m = JSON.parse(raw) as MessageInterface | NoticeEvent
        if (m.post_type === "message") {
            if (m.message_type === 'group') {
                const detail = m.message as MessageData[]
                if (detail[0].type === "reply") {
                    if (detail.length === 2) {
                        const replyId = detail[0].data.id
                        if (detail[1].type === 'image') {
                            const fileURL = detail[1].data.url
                            downloadFile(fileURL, replyId.toString())
                        }
                    }
                    insertMessage(m.group_id, m.message_id, detail[0].data.id)
                }
            }
        } else {
            if (m.notice_type === 'group_recall') {
                const recallId = m.message_id
                try {
                    const message = await findMessageById(m.group_id, recallId)
                    if (message.replyId) {
                        const file = await findFileWithoutExtension('temp',message.replyId.toString())
                        if(file){
                            const ossURL = await saveFileToOss(file)
                            const img = (await QRCodeService(ossURL)).replace('data:image/png;base64,','')
                            console.log('回复消息')
                            const replyMessage = {
                                "action": "send_group_msg",
                                "params": {
                                    group_id: m.group_id,
                                    message: `[CQ:reply,id=${message.replyId}]文件已转存至\n[CQ:image,file=base64://${img},type=show,id=40000]\n有效期三天,不要直接使用手机QQ扫描，打不开的`,
                                    auto_escape: false
                                },
                            }
                            ws.send(JSON.stringify(replyMessage))
                        }

                    }
                } catch (e) {
                    console.log('不是回复的')
                }
            }
        }
        console.log('Received message:', raw);
    });

    // 监听关闭事件
    ws.on('close', () => {
        console.log('A client disconnected');
    });

    // 监听错误事件
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});
console.log(`WebSocket server is running on ws://localhost:${port}`);