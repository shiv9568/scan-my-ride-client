import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, ArrowLeft, Shield, Trash2, Search, Car, QrCode, AlertTriangle, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [data, setData] = useState({ count: 0, totalProfiles: 0, totalScans: 0, users: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteModal, setDeleteModal] = useState(null); // userId to delete
    const [deleting, setDeleting] = useState(false);

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

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (userId) => {
        setDeleting(true);
        try {
            await api.delete(`/api/admin/users/${userId}`);
            setData(prev => ({
                ...prev,
                count: prev.count - 1,
                users: prev.users.filter(u => u._id !== userId)
            }));
            setDeleteModal(null);
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to delete user');
        }
        setDeleting(false);
    };

    const filtered = data.users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-[3px] border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-600/50">Loading</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen" style={{ background: '#FFFDF5', fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>

            {/* ── Delete Confirmation Modal ── */}
            <AnimatePresence>
                {deleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={() => !deleting && setDeleteModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-red-100"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                                <AlertTriangle className="text-red-500" size={28} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete User?</h3>
                            <p className="text-sm text-gray-400 text-center mb-2 font-medium">
                                This will permanently delete <strong className="text-gray-700">{data.users.find(u => u._id === deleteModal)?.name}</strong> and all their profiles.
                            </p>
                            <p className="text-xs text-red-400 text-center mb-6 font-bold">⚠ This action cannot be undone</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal(null)}
                                    disabled={deleting}
                                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteModal)}
                                    disabled={deleting}
                                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-sm uppercase tracking-wider hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <><Trash2 size={14} /> Delete</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto px-5 py-8 md:px-10 md:py-12">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/30">
                            <Shield className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Panel</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.25em]">ScanMyRide Command Center</p>
                        </div>
                    </div>
                    <Link to="/dashboard"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all text-xs font-black uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} /> Dashboard
                    </Link>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 p-12 rounded-3xl text-center">
                        <Shield size={48} className="mx-auto mb-4 text-red-300" />
                        <h2 className="text-xl font-black text-red-600 mb-2">Access Denied</h2>
                        <p className="text-sm font-medium text-red-400">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-8">

                        {/* ── Stats Cards ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'Total Users', value: data.count, icon: Users, color: '#F59E0B', bg: '#FFF8E1' },
                                { label: 'Total Vehicles', value: data.totalProfiles, icon: Car, color: '#8B5CF6', bg: '#F3E8FF' },
                                { label: 'QR Scans', value: data.totalScans, icon: QrCode, color: '#10B981', bg: '#ECFDF5' },
                            ].map((s, i) => (
                                <motion.div
                                    key={s.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="rounded-2xl p-6 border"
                                    style={{ backgroundColor: s.bg, borderColor: s.color + '20' }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: s.color + 'AA' }}>{s.label}</span>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + '15' }}>
                                            <s.icon size={16} style={{ color: s.color }} />
                                        </div>
                                    </div>
                                    <div className="text-4xl font-black tracking-tight" style={{ color: s.color }}>{s.value}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* ── Search ── */}
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                            />
                        </div>

                        {/* ── Users List ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm"
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                    <Users size={16} className="text-amber-500" /> Users
                                </h3>
                                <span className="text-xs font-bold text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {filtered.map((user, idx) => (
                                    <motion.div
                                        key={user._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 + idx * 0.03 }}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-amber-50/50 transition-colors group"
                                    >
                                        {/* Avatar */}
                                        <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 group-hover:border-amber-300 transition-colors">
                                            {user.photo ? (
                                                <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <User size={18} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-gray-900 text-sm truncate">{user.name}</span>
                                                {user.role === 'admin' && (
                                                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-white text-[8px] font-black uppercase tracking-wider">Admin</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-[11px] text-gray-400 font-medium truncate">{user.email || '—'}</span>
                                                <span className="text-[10px] text-gray-300">•</span>
                                                <span className="text-[10px] text-gray-400 font-bold">{user.profileCount || 0} car{user.profileCount !== 1 ? 's' : ''}</span>
                                                <span className="text-[10px] text-gray-300">•</span>
                                                <span className="text-[10px] text-gray-400 font-bold">{user.totalScans || 0} scans</span>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="hidden sm:block text-xs text-gray-400 font-medium flex-shrink-0">
                                            {new Date(user.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>

                                        {/* Delete Button */}
                                        {user.role !== 'admin' ? (
                                            <button
                                                onClick={() => setDeleteModal(user._id)}
                                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                                title="Delete user"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        ) : (
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Shield size={15} className="text-amber-400" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {filtered.length === 0 && (
                                    <div className="px-6 py-16 text-center">
                                        <User size={32} className="mx-auto mb-3 text-gray-200" />
                                        <p className="text-sm font-bold text-gray-300">No users found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                )}

                {/* ── Footer ── */}
                <div className="mt-12 text-center">
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">ScanMyRide Admin · {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
