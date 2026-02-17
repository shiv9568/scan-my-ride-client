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
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <Logo className="w-24 h-24 mb-6" iconOnly={true} />
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">JOIN THE <span className="text-brand">FLEET</span></h1>
                    <p className="text-zinc-500 mt-3 font-bold uppercase tracking-widest text-xs italic">Establish Your Digital Identity</p>
                </div>

                <div className="glass-card rounded-[3rem] p-10 border-t border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-brand/30"></div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-wider text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3 group">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Pilot Full Name</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white focus:outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/5 transition-all font-medium"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3 group">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Commander Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white focus:outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/5 transition-all font-medium"
                                    placeholder="commander@scanmyride.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3 group">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Secure Secret Key</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white focus:outline-none focus:border-brand/50 focus:ring-4 focus:ring-brand/5 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 mt-6 rounded-[1.5rem] bg-brand text-black font-black text-xl shadow-[0_15px_30px_-10px_rgba(244,176,11,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                        >
                            ESTABLISH ACCOUNT
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-10 text-center border-t border-white/5 pt-10">
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest leading-loose">
                            Already registered? <br />
                            <Link to="/login" className="text-brand hover:text-white transition-colors">Commander Login</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
