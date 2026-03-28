import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mitsuboshi.baystarsdrill',
  appName: 'Baystars Drill',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
