可以将群内被撤回的图片自动上传到oss，并回复二维码，需要在文件夹下新建`secret.yml`文件提供oss配置，示例如下
```yaml
id: 你的accessTokenKey
secret: 你的accessTokenSecret
region: 你的oss地区
bucket: 你的oss bucket
```
build之后再运行`pnpm run run`就行了