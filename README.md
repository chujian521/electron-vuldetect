# Vuldectect界面

基于EE框架：
- github：https://github.com/wallace5303/electron-egg

EE文档：
- EE: https://www.yuque.com/u34495/mivcfg/cpbwyx


### 开发测试
```
启动前端
cd frontend && npm run serve

进入【根目录】启动后端
npm run dev
```
### 预发布
```
前端build
cd frontend && npm run build

进入【根目录】移动前端资源
npm run rd


测试
npm run start 

# 准备，设置国内镜像
npm config set electron_mirror=https://registry.npmmirror.com/-/binary/electron/
npm config set electron_builder_binaries_mirror=https://registry.npmmirror.com/-/binary/electron-builder-binaries/

打包
npm run build-w-64
```


*防止安装时杀毒软件报警:* 打包后将./out/win-unpacked以及./out/win-unpacked/resources/extraResources/LogicDetector/ms-playwright/firefox-1304下的d3dcompiler_47.dll删除(一共两个)

按照[这篇文章](https://segmentfault.com/a/1190000041318873)的方式将./out/win-unpacked文件夹中的内容重打包

### extraResource 必须资源结构
```
+LogicDetector
    +ms-playwright
        +chromium // 未使用
        +firefox-1304
    +nnmodel
    +payloads
    +repair
    -LogicDetector.exe
    -online.exe
+SourceCodeDetector
    +jre   //jre 1.8当中lib jar包
    -SourceCodeDetector.exe
    -jvdetector.exe  //使用Jsmooth工具打包
    -config.properties
```