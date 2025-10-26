
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// This is a re-export for convenience and to follow the custom hook pattern.
// The actual implementation is in AuthContext.tsx to avoid circular dependencies.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
