// Device Management Utilities
export interface DeviceInfo {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  lastSeen: string;
}

export class DeviceManager {
  private static readonly DEVICE_KEY = 'spmpos-device-info';

  static generateDeviceId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `device-${timestamp}-${random}`;
  }

  static getDeviceInfo(): DeviceInfo {
    try {
      const stored = localStorage.getItem(this.DEVICE_KEY);
      if (stored) {
        const info = JSON.parse(stored);
        info.lastSeen = new Date().toISOString();
        this.saveDeviceInfo(info);
        return info;
      }
    } catch (error) {
      console.error('Failed to load device info:', error);
    }

    // Generate new device info
    const info: DeviceInfo = {
      id: this.generateDeviceId(),
      name: this.getDeviceName(),
      type: this.getDeviceType(),
      os: this.getOS(),
      browser: this.getBrowser(),
      lastSeen: new Date().toISOString()
    };

    this.saveDeviceInfo(info);
    return info;
  }

  static saveDeviceInfo(info: DeviceInfo): void {
    try {
      localStorage.setItem(this.DEVICE_KEY, JSON.stringify(info));
    } catch (error) {
      console.error('Failed to save device info:', error);
    }
  }

  private static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile';
    }
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    
    return 'desktop';
  }

  private static getOS(): string {
    const userAgent = navigator.userAgent;
    
    if (/Windows NT/i.test(userAgent)) return 'Windows';
    if (/Mac OS X/i.test(userAgent)) return 'macOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
    
    return 'Unknown';
  }

  private static getBrowser(): string {
    const userAgent = navigator.userAgent;
    
    if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) return 'Chrome';
    if (/Firefox/i.test(userAgent)) return 'Firefox';
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return 'Safari';
    if (/Edge/i.test(userAgent)) return 'Edge';
    if (/Opera/i.test(userAgent)) return 'Opera';
    
    return 'Unknown';
  }

  private static getDeviceName(): string {
    const type = this.getDeviceType();
    const os = this.getOS();
    const browser = this.getBrowser();
    
    return `${type.charAt(0).toUpperCase() + type.slice(1)} (${os} - ${browser})`;
  }

  static isSharedDevice(): boolean {
    // Check if this is likely a shared device (like a store tablet)
    const type = this.getDeviceType();
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Heuristics for shared devices
    return type === 'tablet' || 
           /kiosk|pos|retail/i.test(userAgent) ||
           window.screen.width >= 1024; // Large screens often indicate shared devices
  }

  static shouldAutoLogout(): boolean {
    return this.isSharedDevice();
  }

  static getAutoLogoutTime(): number {
    // Return auto-logout time in minutes
    return this.isSharedDevice() ? 15 : 60; // 15 min for shared, 60 min for personal
  }
}