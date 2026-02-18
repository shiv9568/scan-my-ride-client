import { useState, useEffect } from 'react';
import api from '../api/axios';
import Logo from '../components/Logo';
import { motion } from 'framer-motion';
import { Users, User, ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

import { API_URL } from '../api/axios';

const AdminDashboard = () => {
    const [data, setData] = useState({ count: 0, totalProfiles: 0, totalScans: 0, users: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/api/admin/users');
                setData(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.msg || 'Error fetching users');
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand/20 flex items-center justify-center border border-brand/20">
                            <Shield className="text-brand" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter">Command <span className="text-brand">Center</span></h1>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active System Operators</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white transition-all text-sm font-black uppercase tracking-widest">
                            <ArrowLeft size={16} /> Exit Admin
                        </Link>
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-12 rounded-[3rem] text-red-500 text-center">
                        <Shield size={64} className="mx-auto mb-6 opacity-20" />
                        <h2 className="text-2xl font-black uppercase mb-3 tracking-tighter">Unauthorized Access</h2>
                        <p className="text-sm font-bold opacity-60 uppercase tracking-[0.2em]">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-brand/30 transition-all"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand/10 transition-colors"></div>
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Total System Users</h3>
                                <div className="text-5xl font-black text-white tracking-tighter">{data.count}</div>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Registered Accounts</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-purple-500/30 transition-all"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors"></div>
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Total Vehicles</h3>
                                <div className="text-5xl font-black text-white tracking-tighter">{data.totalProfiles}</div>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Live Fleet</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition-all"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Total Site Scans</h3>
                                <div className="text-5xl font-black text-white tracking-tighter">{data.totalScans}</div>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-[8px] font-black text-zinc-600 uppercase">Total Interactions</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Users Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-950 border border-white/5 rounded-[3rem] overflow-hidden"
                        >
                            <div className="px-10 py-8 border-b border-white/5 bg-zinc-900/20">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <Users size={18} className="text-brand" /> Registered Members
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Profile</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Full Name</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Joined Date</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02]">
                                        {data.users.map((user, idx) => (
                                            <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-10 py-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 overflow-hidden border border-white/5 group-hover:border-brand/30 transition-all p-[1px]">
                                                        {user.photo ? (
                                                            <img
                                                                src={user.photo.startsWith('http') ? user.photo : `${API_URL}/${user.photo}`}
                                                                alt={user.name}
                                                                className="w-full h-full object-cover rounded-[0.9rem]"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                                                                <User size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="font-black text-lg uppercase tracking-tight text-white group-hover:text-brand transition-colors">{user.name}</div>
                                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">LID: {idx + 100}</div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="text-zinc-400 font-bold text-sm">{new Date(user.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20">Active</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {data.users.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-10 py-20 text-center">
                                                    <div className="text-zinc-500 font-black uppercase tracking-widest text-xs italic">No system operators found</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
