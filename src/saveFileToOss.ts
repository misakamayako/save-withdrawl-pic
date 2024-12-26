import path from "node:path";
import fs from "node:fs";
import yaml from "js-yaml"
import OSS from 'ali-oss';
import dayjs from 'dayjs'
const configFile = fs.readFileSync(path.resolve(process.cwd(), 'secret.yml'),'utf-8')
const config = yaml.load(configFile) as Record<string, string>

// 配置 OSS 客户端
const client = new OSS({
    region: config.region,
    accessKeyId: config.id,
    accessKeySecret: config.secret,
    bucket: config.bucket
});

export default async function saveFileToOss(filePath: string): Promise<string> {
    try {
        // 上传文件到 OSS
        const formattedDate = dayjs().format('DDMMYY');
        const result = await client.put(
            `${formattedDate}/${filePath}`,
            path.resolve(process.cwd(), 'temp', filePath),
            {
                headers: {
                    "content-disposition": 'inline'
                }
            }
        );
        const signatureUrl = client.signatureUrl(new URL(result.url).pathname, {
            expires: 3 * 24 * 3600,
            response: {
                "content-type":"image/jpg"
            }
        })
        console.log('文件上传成功！');
        console.log('文件 URL:', result.url);
        return signatureUrl
    } catch (error) {
        console.error('文件上传失败:', error);
        return ""
    }
}

