// Offline Mode Utilities
export interface OfflineData {
  users: any[];
  credentials: Record<string, any>;
  lastSync: string;
}

export class OfflineManager {
  private static readonly STORAGE_KEY = 'spmpos-offline-data';

  static saveOfflineData(data: Partial<OfflineData>): void {
    try {
      const existing = this.getOfflineData();
      const updated = { ...existing, ...data, lastSync: new Date().toISOString() };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  static getOfflineData(): OfflineData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : { users: [], credentials: {}, lastSync: '' };
    } catch (error) {
      console.error('Failed to load offline data:', error);
      return { users: [], credentials: {}, lastSync: '' };
    }
  }

  static saveUserCredentials(userId: string, credentials: any): void {
    const data = this.getOfflineData();
    data.credentials[userId] = credentials;
    this.saveOfflineData(data);
  }

  static getUserCredentials(userId: string): any | null {
    const data = this.getOfflineData();
    return data.credentials[userId] || null;
  }

  static validateOfflineLogin(email: string, password: string): any | null {
    const data = this.getOfflineData();
    
    // Find user by email
    const user = data.users.find(u => u.email === email);
    if (!user) return null;

    // Check stored credentials
    const credentials = data.credentials[user.id];
    if (!credentials) return null;

    // Simple password hash comparison (in real app, use proper hashing)
    const hashedPassword = btoa(password); // Base64 encoding for demo
    if (credentials.passwordHash === hashedPassword) {
      return user;
    }

    return null;
  }

  static validateOfflinePIN(userId: string, pin: string): boolean {
    const credentials = this.getUserCredentials(userId);
    if (!credentials) return false;

    return credentials.pin === pin;
  }

  static clearOfflineData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static isDataStale(maxAgeHours: number = 24): boolean {
    const data = this.getOfflineData();
    if (!data.lastSync) return true;

    const lastSync = new Date(data.lastSync);
    const now = new Date();
    const ageHours = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);

    return ageHours > maxAgeHours;
  }
}