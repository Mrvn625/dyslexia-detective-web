
import { useState, useEffect } from 'react';
import { getUserProfile } from '@/services/api';
import { UserProfile } from '@/types/user';

interface UseProfileCheckReturn {
  hasProfile: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  userAge: number | null;
}

/**
 * Hook to check if the user has created a profile
 * Used to guard assessment pages that require user data
 */
export const useProfileCheck = (): UseProfileCheckReturn => {
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  
  useEffect(() => {
    const checkUserProfile = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const profile = await getUserProfile(userId);
          if (profile) {
            setHasProfile(true);
            setUserProfile(profile);
            setUserAge(profile.age);
          } else {
            setHasProfile(false);
          }
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserProfile();
  }, []);
  
  return { hasProfile, isLoading, userProfile, userAge };
};
