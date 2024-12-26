import sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose()
interface Record{
    groupId:number,
    id:number,
    replyId?:number
}
// 创建或打开数据库
const db = new sqlite3.Database('record.db', (err:any) => {
    if (err) {
        console.error('打开数据库失败:', err.message);
    } else {
        console.log('成功连接到 SQLite 数据库。');
    }
});

// 创建表
db.serialize(() => {
    // 创建第一个表 messages
    db.run(`
        CREATE TABLE IF NOT EXISTS messages (
        groupId INTEGER NOT NULL,
        id INTEGER NOT NULL,
        replyId INTEGER
        )
    `, (err:any) => {
        if (err) {
            console.error('创建表 messages 失败:', err.message);
        } else {
            console.log('表 messages 创建成功或已存在。');
        }
    });

    // 创建第二个表 files
    db.run(`
    CREATE TABLE IF NOT EXISTS files (
      filename TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `, (err:any) => {
        if (err) {
            console.error('创建表 files 失败:', err.message);
        } else {
            console.log('表 files 创建成功或已存在。');
        }
    });
});
export function insertMessage(groupId:number,id:number,reply:number){
    db.serialize(() => {
        // 插入 messages 表数据
        const insertMessage = db.prepare(`
            INSERT INTO messages (groupId,id ,replyId ) VALUES (?, ?, ?)
        `);
        insertMessage.run(groupId,id,reply);
        insertMessage.finalize();
    })
}
export function findMessageById(groupId:number,id:number){
    return new Promise<Record>((resolve,reject) => {
        db.serialize(()=>{
            db.get("select * from messages where id = ? and groupId = ?",[id,groupId],(err:any,row:Record)=>{
                if(err){
                    console.log(`查询id,groupId=${id},${groupId}时，${err.message}`)
                    reject()
                } else {
                    resolve(row)
                }
            })
        })
    })
}

