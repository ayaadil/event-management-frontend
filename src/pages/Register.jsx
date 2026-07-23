// src/pages/Register.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await registerUser(values);
      navigate('/home');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-[#241040] text-center mb-1">
        create your <span className="text-[#BA2A92]">account</span>
      </h1>
      <p className="text-[#4a3a66]/70 text-center mb-8">
        join Evently and discover amazing events happening around you.
      </p>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-2">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="flex items-center gap-3 bg-[#241040] rounded-full px-5 py-3.5 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
            <User size={18} className="text-purple-300" />
            <input
              type="text"
              placeholder="full name:"
              className="bg-transparent flex-1 text-white placeholder:text-purple-200/50 outline-none text-sm"
              {...register('name')}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1 ml-2">{errors.name.message}</p>}
        </div>

        <div>
          <div className="flex items-center gap-3 bg-[#241040] rounded-full px-5 py-3.5 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
            <Mail size={18} className="text-purple-300" />
            <input
              type="email"
              placeholder="enter your email:"
              className="bg-transparent flex-1 text-white placeholder:text-purple-200/50 outline-none text-sm"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center gap-3 bg-[#241040] rounded-full px-5 py-3.5 focus-within:ring-2 focus-within:ring-purple-400 transition-all">
            <Lock size={18} className="text-purple-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="password:"
              className="bg-transparent flex-1 text-white placeholder:text-purple-200/50 outline-none text-sm"
              {...register('password')}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-purple-300">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 font-medium text-white transition-all disabled:opacity-60"
          style={{ background: 'linear-gradient(90deg, #8B3FE0 0%, #4B2170 100%)' }}
        >
          <UserPlus size={18} />
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center text-[#4a3a66]/70 text-sm mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#BA2A92] font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}