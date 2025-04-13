import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/profile-setup');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/profile-setup');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-photo/starfield-deep-space-many-light-years-far-from-earth_112293-501.jpg?semt=ais_hybrid&w=740')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent"></div>
      
      {/* Sign Up Form */}
      <div className="relative w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-black/20 shadow-[0_0_40px_rgba(8,_112,_184,_0.7)] border border-white/10">
        <h2 className="text-4xl font-bold text-center mb-8 text-white bg-clip-text">Create an Account</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            </div>

            <div className="relative group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>

            <div className="relative group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 
                focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 
                transition-all duration-300 group-hover:border-white/20"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 group-focus-within:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold 
            transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(79,_70,_229,_0.5)] active:scale-[0.98]
            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black/20 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/20 text-white/60">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-4 px-6 rounded-full 
            hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 focus:ring-offset-2 focus:ring-offset-black/20 
            disabled:opacity-50 transition-all duration-300"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5"
            />
            Google
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 