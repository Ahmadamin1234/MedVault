import React from 'react';
import SignupHero from '../components/SignupHero';
import SignupForm from '../components/SignupForm';

export default function SignupPage() {
  return (
    <div className="w-screen h-screen flex bg-slate-50 font-sans antialiased overflow-hidden">
      {/* Split Hero Column Panel Layout */}
      <SignupHero />
      
      {/* Form Interaction Field Column Layout */}
      <SignupForm />
    </div>
  );
}
