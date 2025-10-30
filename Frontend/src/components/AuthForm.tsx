import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ApiClient, { ApiResponse } from '../utils/apiClient';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Chrome } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import StarryBackground from './StarryBackground';

interface FormData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agreeToTerms?: boolean;
}

const AuthForm: React.FC<Record<string, never>> = (): JSX.Element => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { sendPasswordReset } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>();
  const watchPassword = watch("password");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signIn(data.email, data.password);
      } else {
        if (data.password !== data.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        userCredential = await signUp(data.email, data.password, data.firstName!, data.lastName!);
      }

                  // After successful Firebase login/signup, check MongoDB
      const user = userCredential?.user || userCredential; // adapt to your useAuth return
      if (user?.uid && user?.email) {
        try {
          const checkJson = await ApiClient.get<ApiResponse<any>>(`/DB_Routes/auth-user/${user.uid}`);
          if (!checkJson.success) {
            // Not in MongoDB, create user
            await ApiClient.post<ApiResponse<any>>('/DB_Routes/createuser', {
              uid: user.uid,
              email: user.email,
              firstName: user.displayName?.split(' ')[0] || data.firstName || '',
              lastName: user.displayName?.split(' ')[1] || data.lastName || ''
            });
          }
        } catch (err) {
          console.error('Error checking/creating MongoDB user:', err);
        }
      }
      reset();
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

    const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithGoogle();
      const user = result?.user;
      
      if (user?.uid && user?.email) {
        try {
          const checkJson = await ApiClient.get<ApiResponse<any>>(`/DB_Routes/auth-user/${user.uid}`);
          if (!checkJson.success) {
            const names = user.displayName?.split(' ') || ['', ''];
            await ApiClient.post<ApiResponse<any>>('/DB_Routes/createuser', {
              uid: user.uid,
              email: user.email,
              firstName: names[0] || '',
              lastName: names[1] || ''
            });
          }
        } catch (err) {
          console.error('Error checking/creating MongoDB user:', err);
          // Don't surface this error since Firebase auth was successful
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <StarryBackground />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <button className="flex items-center gap-3 mb-8 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to website</span>
            </button>
            <h1 className="text-4xl font-bold mb-2">Eventwala</h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-tight">
              Capturing Moments,<br />
              Creating Memories
            </h2>
            
            {/* Progress dots */}
            <div className="flex gap-2">
              <div className="w-8 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Eventwala</h1>
            <p className="text-slate-400">Capturing Moments, Creating Memories</p>
          </div>

          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-slate-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>

              {isLogin && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
                      if (!email) {
                        setError('Please enter your email to reset password');
                        return;
                      }
                      try {
                        setLoading(true);
                        await sendPasswordReset(email);
                        setError('Password reset email sent. Check your inbox.');
                      } catch (err: any) {
                        setError(err.message || 'Failed to send reset email');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-sm text-purple-400 hover:text-purple-300"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        {...register('firstName', { required: 'First name is required' })}
                        type="text"
                        placeholder="First name"
                        className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border ${
                          errors.firstName ? 'border-red-500' : 'border-slate-700'
                        } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-400">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        {...register('lastName', { required: 'Last name is required' })}
                        type="text"
                        placeholder="Last name"
                        className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border ${
                          errors.lastName ? 'border-red-500' : 'border-slate-700'
                        } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-400">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    placeholder="Email"
                    className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border ${
                      errors.email ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isLogin ? 'Password' : 'Enter your password'}
                    className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border ${
                      errors.password ? 'border-red-500' : 'border-slate-700'
                    } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      {...register('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === watchPassword || 'Passwords do not match'
                      })}
                      type="password"
                      placeholder="Confirm password"
                      className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
                      } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}

              {!isLogin && (
                <div className="flex items-center gap-3">
                  <input
                    {...register('agreeToTerms', { required: 'You must agree to the terms' })}
                    type="checkbox"
                    id="terms"
                    className="w-5 h-5 rounded border-slate-700 bg-slate-800/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <label htmlFor="terms" className="text-slate-300 text-sm">
                    I agree to the{' '}
                    <span className="text-purple-400 hover:text-purple-300 cursor-pointer">
                      Terms & Conditions
                    </span>
                  </label>
                </div>
              )}
              {errors.agreeToTerms && (
                <p className="text-sm text-red-400">{errors.agreeToTerms.message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">
                  Or {isLogin ? 'sign in' : 'register'} with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-3 py-4 px-6 border border-slate-700 hover:border-slate-600 rounded-lg text-white transition-colors disabled:opacity-50"
              >
                <Chrome className="w-5 h-5" />
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;