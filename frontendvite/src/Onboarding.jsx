import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Onb1 from './Onb1';
import Onb2 from './Onb2';
import Onb3 from './Onb3';
import Onb4 from './Onb4';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // Track current onboarding step

  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // On last step, mark onboarding as complete and navigate to dashboard
      localStorage.setItem('isFirstTimeUser', 'false');
      navigate('/dashboard');
    }
  };
  
  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const steps = [
    <Onb1 nextStep={nextStep} />,
    <Onb2 nextStep={nextStep} previousStep={previousStep}/>,
    <Onb3 nextStep={nextStep} previousStep={previousStep}/>,
    <Onb4 previousStep={previousStep}/>
  ];

  return (
    
        <div>
            {steps[currentStep]}
        </div>
       
  );
};

export default Onboarding;
