# 安卓出包指南：生成可直接安装的 debug.apk

目标：把「墨阅」打包成一个 `.apk` 安装包，用数据线/微信发到安卓手机，点开就能装，**完全离线、无需签名**。

> ⚠️ 关键前提：本项目安卓工程基于 **AGP 8.0 + Gradle 8.0.2**，**必须用 JDK 17**。
> 你电脑当前的系统 Java 是 25，**不能直接命令行 `gradlew` 构建**（会报 JDK 不兼容）。
> 最省事的办法是用 **Android Studio**（自带 JDK 17，并会自动下载 Android SDK），按下面的 GUI 步骤走即可，完全不用碰命令行。

---

## 方式一（推荐）：Android Studio 图形界面，几步出包

1. **安装 Android Studio**
   到 https://developer.android.com/studio 下载安装。首次启动时，向导会提示「Install Android SDK」，勾选默认项一路下一步即可（需要联网一次，约几百 MB~1GB）。

2. **打开安卓工程**
   启动 Android Studio → `File` → `Open` → 选择文件夹：
   ```
   E:\Temp\Literature\modern-literature-app\android
   ```
   （选 `android` 这个文件夹，不是外层 `modern-literature-app`）

3. **等待同步**
   打开后 Android Studio 会自动「Sync Project with Gradle Files」：下载 Gradle 8.0.2 及依赖（首次需联网）。底部状态栏显示「BUILD SUCCESSFUL / synced」即可。

4. **构建 APK**
   顶部菜单 `Build` → `Build APK(s)`（注意不是 `Generate Signed Bundle / APK`，debug 包不需要签名）。
   等右下角弹出「APK(s) generated」通知，点通知里的 **locate** 直接打开文件所在文件夹。

5. **拿到安装包**
   文件路径：
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```
   文件名是 `app-debug.apk`，这就是你要的离线安装包。

6. **装到手机**
   - 用数据线复制 / 微信文件传输助手 / 网盘，把 `app-debug.apk` 发到安卓手机；
   - 手机上点开该文件，按提示允许「未知来源」安装（设置里开一下对应来源的权限）；
   - 安装完成，桌面出现「墨阅」图标，**断网也能读**。

---

## 方式二：命令行（仅当你已配好 JDK 17 + Android SDK）

适合不想装 Android Studio 的情况，但配置更繁琐，自行取舍。

```bat
rem 1) 先确保用的是 JDK 17（不要用系统 Java 25）
set JAVA_HOME=C:\Path\To\jdk-17
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk

rem 2) 同步最新 Web 资源（如已跑过可跳过）
npx cap sync android

rem 3) 构建 debug 包
cd android
gradlew.bat assembleDebug
```

产物同样在 `android\app\build\outputs\apk\debug\app-debug.apk`。

---

## 常见问题

- **构建报错 `Unsupported class file major version` / 提到 Java 21/25**：说明用了系统 Java 25。改用 Android Studio（自带 JDK 17）即可，或把 `JAVA_HOME` 指到 JDK 17。
- **首次 Sync 很慢 / 卡住**：需要联网下载 Gradle 与 SDK 依赖，属正常，耐心等或挂代理。
- **想发到应用商店**：需要 `Generate Signed Bundle / APK` 用正式签名（keystore）打包 release 版，本指南的 debug 包仅供自用/内部分享。
- **iOS**：本项目无法在 Windows 出 IPA，必须 macOS + Xcode。iPhone 用户请走 PWA「添加到主屏幕」方案（见 BuildGuide.md）。

---

## 一句话流程
装 Android Studio → 打开 `android` 文件夹 → 等同步 → `Build ▸ Build APK(s)` → 取 `app-debug.apk` → 发手机安装。
