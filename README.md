# feiyi-remotion-video

《非遗正在发送中》12 秒横版信息可视化动画 Remotion 项目。

## 项目信息

- 技术栈：Remotion + React + TypeScript
- Composition：`FeiyiSendingVideo`
- 尺寸：1920 × 1080
- 帧率：30 fps
- 时长：12 秒（360 帧）
- 风格：宣纸肌理、朱砂红、靛蓝、米白、墨黑、鎏金线条

## 安装依赖

```bash
npm install
```

> 当前环境的 npm registry 可能会返回 403；在可访问 npm registry 的本地或 CI 环境中执行即可安装。

## 预览

```bash
npm run dev
```

启动 Remotion Studio 后，在浏览器里选择 `FeiyiSendingVideo` 预览动画。

## 导出 MP4

```bash
npm run render
```

导出的文件路径为：`out/feiyi-sending-video.mp4`。

## GitHub Actions 自动渲染

仓库包含手动触发的 GitHub Actions 工作流 `Render Remotion MP4`，可在 Actions 页面通过 `workflow_dispatch` 运行。
工作流会使用 Node.js 20 安装依赖、执行 `npm run render`，并检查 `out/feiyi-sending-video.mp4` 是否生成。
如果默认 npm registry 安装失败，工作流会自动切换到 `https://registry.npmmirror.com` 重试。

渲染成功后，工作流会将 MP4 作为 artifact 上传，名称为 `feiyi-sending-video-mp4`。
