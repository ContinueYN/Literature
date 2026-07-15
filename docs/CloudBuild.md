# 云端出包指南：用 Codemagic 一次拿到 Android APK + iOS IPA

本指南让你**不用自己装 Android Studio、不用买 Mac**,把代码推到 GitHub 后,在 Codemagic 点一下,云端机器帮你把两个安装包都编译出来。

> ✅ 仅「构建时」联网上传源码;编译出的 App 本身**完全离线、零联网**,不违背"不用服务器"的要求。
> ⚠️ 本机 Windows 物理上无法编译 iOS(苹果限制),所以 iOS 这一步必须由云端 Mac 完成。

---

## 重要前提:iOS 真机安装必须签名(苹果硬性规定)

和安卓不同,iPhone 上**没有"免签名直接装"**。要在真机安装 IPA,必须满足以下之一:

- **苹果开发者账号($99/年)+ Ad-Hoc 分发**:本配置用的就是这种方式。还需在 [Apple Developer 后台](https://developer.apple.com/account/)把你要装的 iPhone 的 **UDID** 登记进描述文件。
- 或 **TestFlight**(同样要 $99 账号,走审核/内测分发)。
- 或 **免费 Apple ID 开发签名**:仅 7 天有效期、设备受限,不适合长期自用。

> 安卓 APK 没有这个限制,debug 包直接装。所以"双端"里安卓一定成,iOS 取决于你是否愿意开 $99 开发者账号并配置签名。

---

## 步骤(一次性配置,之后一键出包)

### 1. 把代码推到 GitHub
1. 在 GitHub 新建一个**私有或公开**仓库(比如 `moyue-literature`)。
2. 在本机工程目录初始化并提交(以下命令在 `modern-literature-app` 目录执行):
   ```bat
   git init
   git add .
   git commit -m "init: 墨阅离线阅读 App"
   git remote add origin https://github.com/你的用户名/moyue-literature.git
   git branch -M main
   git push -u origin main
   ```
   > 我不会替你执行 push(涉及你的账号密码);你复制命令跑一下即可。`.gitignore` 已配好,不会上传 node_modules 等大文件。

### 2. 连接 Codemagic
1. 打开 https://codemagic.io ,用 GitHub 账号登录并授权。
2. `Add application` → 选中刚才的仓库 → 选 `Android + iOS App (Capacitor)` 类型(或 Generic)→ 下一步。
3. Codemagic 会自动识别仓库根目录的 `codemagic.yaml`。

### 3.(仅 iOS)配置 Apple 签名
1. 在 Codemagic 左侧 `Teams / Personal` → `Integrations` → `Apple Developer Portal`,按提示连接你的 **Apple 开发者账号**($99/年)。
2. 连接后,Codemagic 会自动拉取/生成证书与描述文件;`codemagic.yaml` 里的 `ios_signing` 即生效。
3. 在 Apple Developer 后台把目标 iPhone 的 UDID 加到 Ad-Hoc 描述文件(设备注册)。

### 4. 触发构建
- **方式 A(自动)**:push 到 `main` 分支即自动构建 Android + iOS 两个 workflow。
- **方式 B(手动)**:在 Codemagic 该应用页点 `Start new build`,分别选 `android-build` / `ios-build` 运行。
- 构建完成后,页面直接提供 **APK / IPA 下载链接**,也会发邮件(配置里留了 `user@example.com`,记得改成你自己的邮箱)。

### 5. 装到手机
- **安卓**:下载 `app-debug.apk`,数据线/微信发到手机,允许"未知来源"安装即可。
- **iOS**:下载 `*.ipa`,通过 Ad-Hoc 方式安装(可用 [Apple Configurator]、或 Codemagic 配合的分发链接、或爱思助手等工具侧载到已登记 UDID 的设备)。

---

## 备选:GitHub Actions(完全免费,但配置更手工)
若不想用 Codemagic,也可改用 GitHub Actions:
- Android 用 `ubuntu` runner + `gradlew assembleDebug`;
- iOS 用 `macos` runner + `npx cap sync ios` + `xcodebuild`,签名证书存到仓库 Secrets。

Codemagic 对 Capacitor 支持最顺手,新手推荐它。需要的话我可以再补一份 `github-actions` 工作流文件。

---

## 一句话流程
建 GitHub 仓库 → `git push` → Codemagic 连仓库 →(iOS)连 Apple 开发者账号 → 点构建 → 下载 APK/IPA → 装手机。
