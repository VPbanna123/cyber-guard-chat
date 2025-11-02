
// export default Signup;
import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/helper';
import Loader from '../common/Loader';

const Signup = ({ onToggle }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
    setLoading(false);

    if (!result.success) {
      setErrors({ submit: result.message });
    }
  };

  return (
    <div className="relative w-full">
      {/* Glassmorphism Container */}
      <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-pink-500/30 to-rose-500/30 backdrop-blur-sm px-5 sm:px-7 py-4 sm:py-5 border-b border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Join Us Today!</h2>
            <p className="text-white/80 text-xs sm:text-sm">Create your account and get started</p>
          </div>
        </div>

        {/* Form Content - Scrollable on mobile if needed */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 max-h-[calc(100vh-280px)] sm:max-h-none overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Username Field */}
            <div>
              <label className="block text-white font-semibold mb-1.5 text-sm">Username</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                <div className="relative flex items-center">
                  <User className="absolute left-4 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-2.5 bg-white/20 backdrop-blur-md border-2 ${
                      errors.username ? 'border-red-400' : 'border-white/30 focus:border-white/50'
                    } rounded-xl text-white placeholder-white/50 focus:outline-none transition-all`}
                    placeholder="johndoe"
                  />
                </div>
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-300 bg-red-500/20 px-3 py-1 rounded-lg">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white font-semibold mb-1.5 text-sm">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-5 h-5 text-white/60" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-2.5 bg-white/20 backdrop-blur-md border-2 ${
                      errors.email ? 'border-red-400' : 'border-white/30 focus:border-white/50'
                    } rounded-xl text-white placeholder-white/50 focus:outline-none transition-all`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-300 bg-red-500/20 px-3 py-1 rounded-lg">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white font-semibold mb-1.5 text-sm">Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-white/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-2.5 bg-white/20 backdrop-blur-md border-2 ${
                      errors.password ? 'border-red-400' : 'border-white/30 focus:border-white/50'
                    } rounded-xl text-white placeholder-white/50 focus:outline-none transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-300 bg-red-500/20 px-3 py-1 rounded-lg">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-white font-semibold mb-1.5 text-sm">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-white/60" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-2.5 bg-white/20 backdrop-blur-md border-2 ${
                      errors.confirmPassword ? 'border-red-400' : 'border-white/30 focus:border-white/50'
                    } rounded-xl text-white placeholder-white/50 focus:outline-none transition-all`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-white/60 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-300 bg-red-500/20 px-3 py-1 rounded-lg">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="p-2.5 bg-red-500/20 border border-red-400/50 rounded-xl">
                <p className="text-red-200 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-2.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-2"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? <Loader size="sm" /> : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-white/60 text-xs">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Toggle to Login */}
          <div className="text-center pb-1">
            <p className="text-white/80 text-sm">
              Already have an account?{' '}
              <button 
                onClick={onToggle} 
                className="text-white font-bold hover:underline underline-offset-4 transition-all"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Signup;
