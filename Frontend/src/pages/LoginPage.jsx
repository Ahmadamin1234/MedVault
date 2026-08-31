import SignupHero from '../components/SignupHero'; // Uses the same left hero component
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="w-screen h-screen flex bg-slate-50 font-sans antialiased overflow-hidden">
      {/* Reused Left Gradient Branding Banner Grid */}
      <SignupHero />
      
      {/* New Interactive Login Panel Column */}
      <LoginForm />
    </div>
  );
}
