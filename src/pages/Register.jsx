import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Try a different email.');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/8 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <Logo className="w-24 h-24 mb-6" iconOnly={true} />
                    <h1 className="text-4xl font-black text-[var(--text-color)] tracking-tight uppercase leading-none">JOIN THE <span className="text-brand">FLEET</span></h1>
                    <p className="text-[var(--text-color)] opacity-50 mt-3 font-bold uppercase tracking-widest text-xs italic">Establish Your Digital Identity</p>
                </div>

                <div className="glass-card rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-brand" />

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-wider text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3 group">
                            <label className="text-[10px] font-black text-[var(--text-color)] opacity-50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand group-focus-within:opacity-100 transition-colors">Pilot Full Name</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-color)] opacity-40 group-focus-within:text-brand group-focus-within:opacity-100 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl py-5 pl-14 pr-5 text-[var(--text-color)] focus:outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all font-medium"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3 group">
                            <label className="text-[10px] font-black text-[var(--text-color)] opacity-50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand group-focus-within:opacity-100 transition-colors">Commander Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-color)] opacity-40 group-focus-within:text-brand group-focus-within:opacity-100 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl py-5 pl-14 pr-5 text-[var(--text-color)] focus:outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all font-medium"
                                    placeholder="commander@scanmyride.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3 group">
                            <label className="text-[10px] font-black text-[var(--text-color)] opacity-50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand group-focus-within:opacity-100 transition-colors">Secure Secret Key</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-color)] opacity-40 group-focus-within:text-brand group-focus-within:opacity-100 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[var(--input-bg)] border border-[var(--card-border)] rounded-2xl py-5 pl-14 pr-5 text-[var(--text-color)] focus:outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/10 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 mt-6 rounded-[1.5rem] bg-brand text-black font-black text-xl shadow-[0_15px_30px_-10px_rgba(244,176,11,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                        >
                            ESTABLISH ACCOUNT
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-brand/10 pt-10">
                        <p className="text-[var(--text-color)] opacity-50 font-bold text-xs uppercase tracking-widest leading-loose">
                            Already registered? <br />
                            <Link to="/login" className="text-brand hover:brightness-110 transition-colors opacity-100">Commander Login</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
