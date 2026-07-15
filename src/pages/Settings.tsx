import SettingsControls from '../components/SettingsControls';
import { useSettings } from '../store/SettingsContext';

export default function Settings() {
  const { reset } = useSettings();
  return (
    <div className="page">
      <header className="page-head">
        <h1 className="app-name small">设置</h1>
      </header>

      <section className="settings-section">
        <h2 className="section-title">阅读偏好</h2>
        <SettingsControls />
      </section>

      <section className="settings-section">
        <h2 className="section-title">关于</h2>
        <div className="about">
          <div className="about-logo">墨阅</div>
          <div className="about-name">墨阅 · 现代文学离线阅读</div>
          <div className="about-version">版本 1.0.0</div>
          <p className="about-text">
            一款纯前端、离线可用、零联网的现代文学阅读应用。全部作品均为公版（作者逝世逾五十年）经典，
            文本随安装包内置，无需联网、无需登录、不收集任何数据。
          </p>
          <p className="about-text">
            书签与阅读进度仅保存在本机，卸载应用即清除。可经 Capacitor 封装为 Android（APK）与
            iOS（IPA）安装包。
          </p>
        </div>
        <button className="reset-btn" onClick={reset}>
          恢复默认阅读设置
        </button>
      </section>
    </div>
  );
}
