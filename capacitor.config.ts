import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tesseract.app',
  appName: 'tesseract',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    hostname: 'localhost',
    iosScheme: 'https',
    androidScheme: 'https'
  }
};

export default config;
