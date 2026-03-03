import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code+NewPass, 3: Success
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post(`/api/auth/forgot-password`, { email });
            setStep(2);
            setMessage('A restoration code has been dispatched to your email. Please check your inbox (and spam folder).');
        } catch (err) {
            const serverMsg = err.response?.data?.msg;
            const serverError = err.response?.data?.error;
            const hint = err.response?.data?.hint;

            if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
                setError('Request timed out. The server might be waking up, please try again in a few seconds.');
            } else if (!err.response) {
                setError('Network Error: Unable to reach the security hub. Please check your connection.');
            } else {
                setError(serverMsg || 'Error sending code');
            }

            if (serverError || hint || !err.response) {
                console.error("Authentication Error Details:", {
                    msg: serverMsg,
                    error: serverError,
                    hint: hint,
                    code: err.code,
                    message: err.message
                });
            }
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post(`/api/auth/reset-password`, {
                email,
                code,
                newPassword
            });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid code or error resetting password');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center p-6 relative overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#f4b00b]/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#f4b00b]/5 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <Logo className="w-16 h-16 mb-4" iconOnly={true} />
                    <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Security<span className="text-[#f4b00b]">Recovery</span></h1>
                    <p className="text-white/40 mt-2 font-bold uppercase tracking-widest text-[9px] italic">Access Restoration Hub</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#f4b00b]" />

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="text-xl font-black text-white mb-2">Forgot Password?</h2>
                                <p className="text-white/40 text-xs font-bold leading-relaxed mb-8">Enter your registered email address to initiate the identity verification process.</p>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-[10px] font-black uppercase tracking-wider text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSendCode} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-white focus:outline-none focus:border-[#f4b00b]/50 transition-all font-medium text-sm"
                                                placeholder="commander@scanmyride.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-2xl bg-[#f4b00b] text-black font-black text-sm shadow-[0_10px_20px_rgba(244,176,11,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        {loading ? 'INITIATING...' : 'SEND RESET CODE'}
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <h2 className="text-xl font-black text-white mb-2">Verify Identity</h2>
                                <p className="text-white/40 text-xs font-bold leading-relaxed mb-8">{message}</p>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-[10px] font-black uppercase tracking-wider text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleResetPassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Restoration Code</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                            <input
                                                type="text"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-white focus:outline-none focus:border-[#f4b00b]/50 transition-all font-black text-center tracking-[0.5em]"
                                                placeholder="123456"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">New Password</label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-white focus:outline-none focus:border-[#f4b00b]/50 transition-all font-medium text-sm"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-2xl bg-[#f4b00b] text-black font-black text-sm shadow-[0_10px_20px_rgba(244,176,11,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        {loading ? 'RESETTING...' : 'ESTABLISH NEW KEY'}
                                        <CheckCircle2 size={18} />
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-2xl font-black text-white mb-2">Restoration Complete</h2>
                                <p className="text-white/40 text-sm font-bold leading-relaxed mb-10">Your password has been successfully updated. Your access to the fleet is restored.</p>

                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-4 rounded-2xl bg-white/10 text-white font-black text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                >
                                    PROCEED TO SIGN IN
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {step < 3 && (
                        <div className="mt-8 text-center pt-8 border-t border-white/5">
                            <Link to="/login" className="text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-[#f4b00b] transition-all flex items-center justify-center gap-2">
                                <ArrowLeft size={12} /> Back to Sign In
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center mt-12 text-[9px] text-white/10 font-black uppercase tracking-[0.4em]">Proprietary Scanning Logic</p>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
