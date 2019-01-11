# eros热更新服务
> 无需数据库，不支持增量包

判断app版本一致&js版本不一致时返回全量包，编译好的文件直接上传到dist目录即可

需要配置eros.native.json为

```
{
    ...
    'bundleUpdate': 'http://xxx.com:3001/app/check'
    ...
}
```

