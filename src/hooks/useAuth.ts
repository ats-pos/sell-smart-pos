import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/lib/context/AuthContext';


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};