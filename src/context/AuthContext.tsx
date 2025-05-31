
"use client";

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, type AuthError } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>; // Renamed from signOut
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // User is signed in. onAuthStateChanged will handle UI updates.
      // AuthPage.tsx's useEffect will handle redirection if the user lands there while already signed in or after successful sign-in.
    } catch (error) {
      const authError = error as AuthError;
      console.error("Google Sign-In Error Code:", authError.code);
      console.error("Google Sign-In Error Message:", authError.message);

      let description = authError.message || "An unexpected error occurred during sign-in.";
      if (authError.code === 'auth/popup-closed-by-user') {
        description = 'Sign-in popup was closed before completing. Please try again.';
      } else if (authError.code === 'auth/cancelled-popup-request') {
        description = 'Sign-in request was cancelled. Please try again.';
      } else if (authError.code === 'auth/operation-not-allowed') {
        description = 'Google Sign-In is not enabled for this project. Please contact support.';
      } else if (authError.code === 'auth/popup-blocked') {
        description = 'Sign-in popup was blocked by your browser. Please disable your popup blocker and try again.';
      }
      
      toast({
        title: "Sign-In Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => { // Renamed from signOut
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null.
      // Header and other components will react to user being null.
      // router.push('/'); // Optional: redirect to home, or let components decide
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error signing out:", authError.code, authError.message);
      toast({
        title: "Sign-Out Failed",
        description: authError.message || "An unexpected error occurred during sign-out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

