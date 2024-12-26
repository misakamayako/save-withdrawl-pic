import path from "node:path"
import fs from "node:fs"

export default async function findFileWithoutExtension(directory: string, filename: string): Promise<string | undefined> {
    // 使用 fs.promises.readdir 来异步读取目录内容
    try {
        const files = await fs.promises.readdir(directory);
        return files.find(file => {
            // 获取文件的基础名称（不包括路径和扩展名）
            const baseName = path.basename(file, path.extname(file));
            // 检查文件名是否匹配
            return baseName === filename;
        });
    } catch (err) {
        console.error('读取目录时出错:', err);
        return undefined;
    }
}

