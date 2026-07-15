# 构建与打包指南（墨阅 · 现代文学离线阅读）

本应用为纯前端项目，使用 **Vite + React + TypeScript + vite-plugin-pwa**，并通过 **Capacitor** 封装为 Android / iOS 原生安装包。全部功能离线可用，无需服务器。

---

## 0. 环境要求

| 目标 | 所需环境 |
| --- | --- |
| 开发 / Web 构建 / PWA | Node.js 18+（推荐 20+）、npm |
| Android APK | Windows / macOS / Linux + **Android Studio** + Android SDK（API 33+）+ 签名 keystore |
| iOS IPA | **macOS** + **Xcode 15+** + Apple 开发者账号（真机签名必需） |

> ⚠️ 说明：iOS 的 IPA 签名/归档**必须在 macOS + Xcode 上完成**，Windows 无法产出。本项目已生成可一键出包的 Xcode 工程（`ios/`），在 Mac 上按第 3 节操作即可。

---

## 1. 安装依赖与 Web 构建

```bash
# 进入项目目录
cd modern-literature-app

# 安装依赖（国内可用镜像）
npm install --registry=https://registry.npmmirror.com/

# 构建 Web 产物（输出到 dist/，并自动生成 Service Worker → 离线可用）
npm run build

# 本地预览构建结果（验证离线：构建后断网刷新仍可用）
npm run preview
# 浏览器打开 http://localhost:4173 ，F12 → Application → Service Workers 可看到已激活
```

构建成功后 `dist/` 即为一个完整离线 PWA：拷贝到任意静态服务器或直接以 `file://` 打开（HashRouter + 相对路径已适配）均可运行。

---

## 2. Android 打包（APK / AAB）

```bash
# 1) 先构建 Web
npm run build

# 2) 添加 Android 原生工程（仅需一次）
npx cap add android

# 3) 同步 Web 产物到原生工程
npx cap sync android

# 4) 用 Android Studio 打开并出包
npx cap open android
```
在 Android Studio 中：
- **调试包**：`Build → Build Bundle(s) / APK(s) → Build APK(s)`，生成 `android/app/build/outputs/apk/release/app-release.apk`（需先配置签名）。
- **签名**：`Build → Generate Signed Bundle / APK`，使用自己的 keystore。
- 也可以命令行（需已配置 signingConfig）：
  ```bash
  cd android && ./gradlew assembleRelease
  ```
生成的 APK 可直连手机安装，完全离线运行。

> 替换启动图标：将品牌图标放入 `android/app/src/main/res/` 对应密度目录（mipmap-*），覆盖默认 Capacitor 图标。

---

## 3. iOS 打包（IPA，需 macOS）

```bash
# 在 macOS 上执行：
npm install
npm run build
npx cap add ios        # 仅首次
npx cap sync ios
npx cap open ios       # 用 Xcode 打开
```
在 Xcode 中：
1. 选择 `App` target，配置 **Signing & Capabilities**（Team = 你的 Apple 开发者账号，Bundle Identifier 默认 `com.moyue.literature`）。
2. 选择真机或 `Any iOS Device` 作为运行目标。
3. `Product → Archive` → 在 Organizer 中 `Distribute App` → Ad Hoc / App Store 导出 IPA。
4. 真机安装：通过 TestFlight 或 Xcode 直装。

> iOS 的 PWA 离线能力也可不封装：用 Safari 打开 Web 构建产物（或部署到任意静态托管），点击「分享 → 添加到主屏幕」即可获得近似原生的离线入口。

---

## 4. 内容扩展

新增一部公版作品，只需编辑 `src/data/books.ts`，追加一个 `Book` 对象（按现有结构：章节 → 段落数组）。保存后重新 `npm run build` 即可，UI 自动渲染，无需改动其它代码。

---

## 5. 常见问题

| 现象 | 处理 |
| --- | --- |
| `npm run build` 报 TS 错误 | 按提示修复类型；本工程开启 strict，注意未使用变量 |
| Capacitor 同步后白屏 | 确认 `vite.config.ts` 的 `base: './'`；执行 `npx cap sync` 重新同步 |
| 离线刷新页面 404 | 确认使用了 HashRouter（已采用），且 Service Worker 已激活 |
| Android 构建报 JDK 版本 | Capacitor 5 需 JDK 17，请使用 Android Studio 自带的 JDK |
| iOS 真机无法安装 | 必须有 Apple 开发者账号并完成签名；模拟器无需付费账号 |
