import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGraphQLMutation, useGraphQLQuery } from '@/hooks/useGraphQL';
import { 
  LOGIN_USER, 
  LOGIN_WITH_OTP, 
  LOGIN_WITH_PIN, 
  SEND_OTP, 
  REGISTER_STORE,
  GET_DEVICE_USERS,
  FORGOT_PASSWORD,
  RESET_PIN,
  VERIFY_BIOMETRIC,
  CHECK_STORE_EXISTS
} from '@/lib/graphql/auth-queries';
import { 
  LoginInput, 
  OTPLoginInput, 
  PINLoginInput, 
  StoreRegistrationInput,
  AuthResponse,
  User,
  Store,
  DeviceUser
} from '@/lib/graphql/auth-types';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Generate or get device ID
  useEffect(() => {
    let storedDeviceId = localStorage.getItem('device-id');
    if (!storedDeviceId) {
      storedDeviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device-id', storedDeviceId);
    }
    setDeviceId(storedDeviceId);

    // Check for existing auth
    const token = localStorage.getItem('auth-token');
    const user = localStorage.getItem('current-user');
    const store = localStorage.getItem('current-store');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
      if (store) {
        setCurrentStore(JSON.parse(store));
      }
    }
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // GraphQL mutations
  const { mutate: loginUser, loading: loginLoading } = useGraphQLMutation<{
    loginUser: AuthResponse;
  }, { input: LoginInput }>(LOGIN_USER);

  const { mutate: loginWithOTP, loading: otpLoginLoading } = useGraphQLMutation<{
    loginWithOTP: AuthResponse;
  }, { input: OTPLoginInput }>(LOGIN_WITH_OTP);

  const { mutate: loginWithPIN, loading: pinLoginLoading } = useGraphQLMutation<{
    loginWithPIN: AuthResponse;
  }, { input: PINLoginInput }>(LOGIN_WITH_PIN);

  const { mutate: sendOTP, loading: sendingOTP } = useGraphQLMutation<{
    sendOTP: { success: boolean; message: string; otpSent: boolean };
  }, { phone: string }>(SEND_OTP);

  const { mutate: registerStore, loading: registerLoading } = useGraphQLMutation<{
    registerStore: AuthResponse;
  }, { input: StoreRegistrationInput }>(REGISTER_STORE);

  const { mutate: forgotPassword, loading: forgotLoading } = useGraphQLMutation<{
    forgotPassword: { success: boolean; message: string };
  }, { email: string }>(FORGOT_PASSWORD);

  const { mutate: resetPIN, loading: resetPinLoading } = useGraphQLMutation<{
    resetPIN: { success: boolean; message: string };
  }, { input: any }>(RESET_PIN);

  const { mutate: verifyBiometric, loading: biometricLoading } = useGraphQLMutation<{
    verifyBiometric: AuthResponse;
  }, { input: any }>(VERIFY_BIOMETRIC);

  // GraphQL queries
  const { data: deviceUsersData, loading: usersLoading, refetch: refetchUsers } = useGraphQLQuery<{
    deviceUsers: DeviceUser[];
  }>(GET_DEVICE_USERS, {
    variables: { deviceId },
    skip: !deviceId
  });

  const { data: storeExistsData, loading: storeCheckLoading } = useGraphQLQuery<{
    storeExists: { exists: boolean; store?: Store };
  }>(CHECK_STORE_EXISTS, {
    variables: { deviceId },
    skip: !deviceId
  });

  const saveAuthData = (authResponse: AuthResponse) => {
    if (authResponse.success && authResponse.token && authResponse.user) {
      localStorage.setItem('auth-token', authResponse.token);
      localStorage.setItem('current-user', JSON.stringify(authResponse.user));
      
      if (authResponse.store) {
        localStorage.setItem('current-store', JSON.stringify(authResponse.store));
        setCurrentStore(authResponse.store);
      }
      
      setIsAuthenticated(true);
      setCurrentUser(authResponse.user);
    }
  };

  const handleLogin = async (input: LoginInput) => {
    try {
      const result = await loginUser({ 
        input: { ...input, deviceId } 
      });
      
      if (result?.data?.loginUser) {
        saveAuthData(result.data.loginUser);
        
        // Navigate based on role
        if (result.data.loginUser.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.data.loginUser.user?.name}!`
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleOTPLogin = async (input: OTPLoginInput) => {
    try {
      const result = await loginWithOTP({ 
        input: { ...input, deviceId } 
      });
      
      if (result?.data?.loginWithOTP) {
        saveAuthData(result.data.loginWithOTP);
        navigate('/');
        
        toast({
          title: "Login Successful",
          description: `Welcome, ${result.data.loginWithOTP.user?.name}!`
        });
      }
    } catch (error) {
      console.error('OTP login error:', error);
    }
  };

  const handlePINLogin = async (input: PINLoginInput) => {
    try {
      const result = await loginWithPIN({ 
        input: { ...input, deviceId } 
      });
      
      if (result?.data?.loginWithPIN) {
        saveAuthData(result.data.loginWithPIN);
        navigate('/');
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.data.loginWithPIN.user?.name}!`
        });
      }
    } catch (error) {
      console.error('PIN login error:', error);
    }
  };

  const handleSendOTP = async (phone: string) => {
    try {
      const result = await sendOTP({ phone });
      
      if (result?.data?.sendOTP?.success) {
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  };

  const handleStoreRegistration = async (input: StoreRegistrationInput) => {
    try {
      const result = await registerStore({ 
        input: { ...input, deviceId } 
      });
      
      if (result?.data?.registerStore) {
        saveAuthData(result.data.registerStore);
        navigate('/admin');
        
        toast({
          title: "Store Registered",
          description: `Welcome to SPMPOS, ${result.data.registerStore.store?.name}!`
        });
      }
    } catch (error) {
      console.error('Store registration error:', error);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      const result = await forgotPassword({ email });
      
      if (result?.data?.forgotPassword?.success) {
        toast({
          title: "Reset Link Sent",
          description: "Please check your email for password reset instructions."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const handleBiometricLogin = async (userId: string, biometricData: string) => {
    try {
      const result = await verifyBiometric({ 
        input: { userId, biometricData, deviceId } 
      });
      
      if (result?.data?.verifyBiometric) {
        saveAuthData(result.data.verifyBiometric);
        navigate('/');
        
        toast({
          title: "Biometric Login Successful",
          description: `Welcome back, ${result.data.verifyBiometric.user?.name}!`
        });
      }
    } catch (error) {
      console.error('Biometric login error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('current-user');
    localStorage.removeItem('current-store');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentStore(null);
    navigate('/login');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
  };

  const deviceUsers = deviceUsersData?.deviceUsers || [];
  const storeExists = storeExistsData?.storeExists?.exists || false;
  const existingStore = storeExistsData?.storeExists?.store;

  return {
    // State
    isAuthenticated,
    currentUser,
    currentStore,
    deviceId,
    isOnline,
    deviceUsers,
    storeExists,
    existingStore,
    
    // Loading states
    loginLoading,
    otpLoginLoading,
    pinLoginLoading,
    sendingOTP,
    registerLoading,
    forgotLoading,
    resetPinLoading,
    biometricLoading,
    usersLoading,
    storeCheckLoading,
    
    // Actions
    handleLogin,
    handleOTPLogin,
    handlePINLogin,
    handleSendOTP,
    handleStoreRegistration,
    handleForgotPassword,
    handleBiometricLogin,
    logout,
    refetchUsers
  };
}