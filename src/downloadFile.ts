import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import path from 'path';
const outputDirectory = path.resolve('./temp'); // 保存到当前目录下的 temp 文件夹
async function downloadFile(url:string, name:string) {
    try {
        // 发起请求，获取文件的流
        const response = await axios({
            method: 'get',
            url,
            responseType: 'arraybuffer', // 获取二进制数据
        });

        // 提取文件的前几字节用于判断类型
        const buffer = Buffer.from(response.data);
        const fileType = await fileTypeFromBuffer(buffer);

        // 如果无法识别类型，默认使用 'bin'
        const extension = fileType ? fileType.ext : 'bin';
        console.log(`Detected file extension: ${extension}`);

        // 生成文件名并保存
        const fileName = `${name}.${extension}`;
        const filePath = path.join(outputDirectory, fileName);

        fs.writeFileSync(filePath, buffer);
        console.log(`File saved at: ${filePath}`);
    } catch (error:any) {
        console.error('Error downloading or saving the file:', error.message);
    }
}
// 确保输出目录存在
if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}
export default downloadFile
