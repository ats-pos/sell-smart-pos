
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1bdcda830743442bbbcc39a0cfd81125',
  appName: 'sell-smart-pos',
  webDir: 'dist',
  server: {
    url: "https://1bdcda83-0743-442b-bbcc-39a0cfd81125.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#3b82f6",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff"
    },
    StatusBar: {
      style: 'DEFAULT'
    }
  }
};

export default config;
