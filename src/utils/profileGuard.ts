
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useProfileGuard = (redirectTo = '/user-profile') => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // Check for profile in localStorage
        const userProfile = localStorage.getItem('userProfile');
        
        if (!userProfile) {
          toast({
            title: "Profile Required",
            description: "Please create a profile to continue",
          });
          navigate(redirectTo);
          return;
        }
        
        // Validate the profile data has the minimum required fields
        try {
          const profile = JSON.parse(userProfile);
          if (!profile.name || !profile.age) {
            toast({
              title: "Complete Your Profile",
              description: "Please complete your profile information",
            });
            navigate(redirectTo);
            return;
          }
          
          // Store user ID in localStorage if not already there (for API purposes)
          if (profile.name && !localStorage.getItem('userId')) {
            // Create a simple user ID based on name (in a real app, this would come from backend)
            localStorage.setItem('userId', btoa(profile.name));
          }
          
          setHasProfile(true);
        } catch (error) {
          console.error("Error parsing profile:", error);
          toast({
            title: "Profile Error",
            description: "There was an error with your profile data.",
          });
          navigate(redirectTo);
          return;
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        toast({
          title: "Error",
          description: "There was an error checking your profile.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserProfile();
  }, [navigate, toast, redirectTo]);

  return { isLoading, hasProfile };
};
