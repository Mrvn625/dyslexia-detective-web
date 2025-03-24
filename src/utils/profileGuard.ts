
import { getUserProfile, validateUserProfile } from '@/services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useProfileGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserProfile = async () => {
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        toast({
          title: "Profile Required",
          description: "Please create a profile before accessing this page",
          variant: "destructive",
        });
        navigate('/profile');
        return;
      }
      
      try {
        const validation = await validateUserProfile(userId);
        
        if (!validation.exists || !validation.profileCompleted) {
          toast({
            title: "Profile Required",
            description: "Please complete your profile before accessing this page",
            variant: "destructive",
          });
          navigate('/profile');
          return;
        }
        
        setHasProfile(true);
      } catch (error) {
        console.error("Error validating profile:", error);
        toast({
          title: "Error",
          description: "There was an error checking your profile. Please try again.",
          variant: "destructive",
        });
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserProfile();
  }, [navigate, toast]);

  return { isLoading, hasProfile };
};
