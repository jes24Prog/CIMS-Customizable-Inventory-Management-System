
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/context/AuthContext';
import loginBg from '@/assets/loginBackground.jpg';

const IndexPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${loginBg.src})` }}
        data-ai-hint="office background"
      />
      <div className="absolute inset-0 bg-black/50 -z-10" />
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default IndexPage;
