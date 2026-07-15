import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moyue.literature',
  appName: '墨阅',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
