# 墨阅 · 现代文学离线阅读

一款**纯前端、离线可用、零联网**的现代文学精品阅读应用。下载即用，无需服务器、无需登录、不收集任何数据。可经 Capacitor 封装为 Android（APK）与 iOS（IPA）安装包。

## 特性
- 📚 **书库**：按作者 / 体裁（小说·散文·诗歌·戏剧）浏览，全文搜索书名与正文。
- 📖 **阅读器**：章节目录、字号 / 行距 / 字体 / 主题（日间·护眼·夜间）/ 宽度调节、阅读进度自动续读、一键书签。
- 🔖 **书签**：收藏精彩段落，按书管理，点击即回原处。
- ⚙️ **设置**：阅读偏好全局生效，公版与隐私说明。
- 🔌 **完全离线**：内容随包内置，Service Worker 预缓存，断网照常阅读。

## 技术栈
Vite · React 18 · TypeScript · react-router-dom（HashRouter）· vite-plugin-pwa（Workbox）· Capacitor 5（Android / iOS）。

## 快速开始
```bash
npm install --registry=https://registry.npmmirror.com/
npm run build      # 产物在 dist/，已含 Service Worker
npm run preview    # 本地预览（可断网验证）
```

## 打包为原生安装包
详见 [`docs/BuildGuide.md`](./docs/BuildGuide.md)：
- Android APK：需 Android Studio + SDK，`npx cap add android && npx cap sync && npx cap open android`。
- iOS IPA：需 macOS + Xcode + 开发者账号，`npx cap add ios && npx cap sync && npx cap open ios`。

## 目录结构
```
modern-literature-app/
├── docs/                 # 产品/技术/架构/构建文档
├── public/               # 图标、favicon
├── src/
│   ├── data/books.ts     # 公版现代文学结构化数据（随包内置）
│   ├── store/            # 设置 / 书签 / 进度 Context
│   ├── lib/              # localStorage 封装、全文搜索
│   ├── components/       # 书卡、底栏、章节抽屉、设置控件
│   ├── pages/            # 书库 / 详情 / 阅读器 / 书签 / 设置
│   ├── index.css         # 主题变量与全部样式
│   └── main.tsx / App.tsx
├── capacitor.config.ts   # 原生封装配置
└── vite.config.ts        # 构建 + PWA 配置
```

## 内容说明
内置作品均为**公版**（作者逝世逾五十年）中国现代文学经典，涵盖鲁迅、朱自清、徐志摩、老舍、胡适、闻一多、周作人、郁达夫、许地山等。仅作离线阅读与学习之用。
