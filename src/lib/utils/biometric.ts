// Biometric Authentication Utilities
export interface BiometricOptions {
  challenge: Uint8Array;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: Uint8Array;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: "public-key";
    alg: number;
  }>;
  authenticatorSelection?: {
    authenticatorAttachment?: "platform" | "cross-platform";
    userVerification?: "required" | "preferred" | "discouraged";
  };
  timeout?: number;
}

export class BiometricAuth {
  static isSupported(): boolean {
    return !!(navigator.credentials && window.PublicKeyCredential);
  }

  static async isAvailable(): Promise<boolean> {
    if (!this.isSupported()) return false;
    
    try {
      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  static async register(userId: string, userName: string, userDisplayName: string): Promise<string | null> {
    if (!this.isSupported()) {
      throw new Error('Biometric authentication not supported');
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const options: BiometricOptions = {
        challenge,
        rp: {
          name: "SPM-POS",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: userDisplayName,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
      };

      const credential = await navigator.credentials.create({
        publicKey: options
      }) as PublicKeyCredential;

      if (credential) {
        // Store credential ID for future authentication
        const credentialId = Array.from(new Uint8Array(credential.rawId))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        localStorage.setItem(`biometric-${userId}`, credentialId);
        return credentialId;
      }

      return null;
    } catch (error) {
      console.error('Biometric registration failed:', error);
      throw error;
    }
  }

  static async authenticate(userId: string): Promise<string | null> {
    if (!this.isSupported()) {
      throw new Error('Biometric authentication not supported');
    }

    try {
      const storedCredentialId = localStorage.getItem(`biometric-${userId}`);
      if (!storedCredentialId) {
        throw new Error('No biometric credentials found for user');
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Convert hex string back to Uint8Array
      const credentialId = new Uint8Array(
        storedCredentialId.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
      );

      const options = {
        challenge,
        allowCredentials: [{
          type: "public-key" as const,
          id: credentialId,
        }],
        userVerification: "required" as const,
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({
        publicKey: options
      }) as PublicKeyCredential;

      if (assertion) {
        // In a real implementation, you would verify the assertion on the server
        // For demo purposes, we'll return a success token
        return `biometric-auth-${userId}-${Date.now()}`;
      }

      return null;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      throw error;
    }
  }

  static async isRegistered(userId: string): Promise<boolean> {
    const credentialId = localStorage.getItem(`biometric-${userId}`);
    return !!credentialId;
  }

  static async unregister(userId: string): Promise<void> {
    localStorage.removeItem(`biometric-${userId}`);
  }
}