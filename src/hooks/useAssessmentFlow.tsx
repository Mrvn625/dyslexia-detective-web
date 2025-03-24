
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AssessmentStep {
  path: string;
  label: string;
  completed: boolean;
}

export const useAssessmentFlow = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<AssessmentStep[]>([
    { path: '/user-profile', label: 'Create Profile', completed: false },
    { path: '/checklist', label: 'Complete Checklist', completed: false },
    { path: '/handwriting-analysis', label: 'Handwriting Analysis', completed: false },
    { path: '/cognitive-tests', label: 'Cognitive Tests', completed: false },
    { path: '/results', label: 'View Results', completed: false },
    { path: '/report', label: 'Get Report', completed: false },
  ]);

  useEffect(() => {
    // Check which steps have been completed
    const userProfile = localStorage.getItem('userProfile');
    const hasProfile = userProfile !== null;
    
    const checklistResult = localStorage.getItem('checklistResult');
    const hasChecklistResult = checklistResult !== null;
    
    const handwritingResult = localStorage.getItem('handwritingResult');
    const hasHandwritingResult = handwritingResult !== null;
    
    const testResults = localStorage.getItem('testResults');
    const hasTestResults = testResults !== null;
    
    const updatedSteps = [...steps];
    
    if (hasProfile) {
      updatedSteps[0].completed = true;
    }
    
    if (hasChecklistResult) {
      updatedSteps[1].completed = true;
    }
    
    if (hasHandwritingResult) {
      updatedSteps[2].completed = true;
    }
    
    if (hasTestResults) {
      updatedSteps[3].completed = true;
    }
    
    setSteps(updatedSteps);
    
    // Determine current step
    let nextIncompleteIndex = updatedSteps.findIndex(step => !step.completed);
    if (nextIncompleteIndex === -1) {
      nextIncompleteIndex = updatedSteps.length - 1;
    }
    
    setCurrentStepIndex(nextIncompleteIndex);
  }, []);

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      navigate(steps[nextIndex].path);
      setCurrentStepIndex(nextIndex);
    }
  };

  const getPreviousStep = () => {
    return currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
  };

  const getNextStep = () => {
    return currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;
  };

  const getCurrentStep = () => {
    return steps[currentStepIndex];
  };

  const markCurrentStepComplete = () => {
    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex].completed = true;
    setSteps(updatedSteps);
  };

  return {
    steps,
    currentStepIndex,
    goToNextStep,
    getPreviousStep,
    getNextStep,
    getCurrentStep,
    markCurrentStepComplete
  };
};
