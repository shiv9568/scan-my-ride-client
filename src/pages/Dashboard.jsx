import { useState, useEffect, useContext } from 'react';
import Logo from '../components/Logo';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import {
    Save, LogOut, ExternalLink, Download,
    Smartphone, User, Briefcase, MapPin,
    Droplets, AlertCircle, Eye, EyeOff, LayoutDashboard,
    Instagram, Linkedin, Camera, Car, Plus, Trash2, Palette,
    ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
    const { logout } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);
    const [activeProfileIndex, setActiveProfileIndex] = useState(0);
    const [profile, setProfile] = useState({
        carName: '',
        ownerName: '',
        phoneNumber: '',
        profession: '',
        instagram: '',
        linkedin: '',
        emergencyContact: '',
        bloodGroup: '',
        city: '',
        isPublic: true,
        showPhone: true,
        emergencyMode: false,
        themeColor: '#3b82f6',
        selectedTheme: 'carbon',
        uniqueId: '',
        specs: {
            hp: '',
            torque: '',
            engine: '',
            mods: ''
        },
        youtubeLink: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedCarFile, setSelectedCarFile] = useState(null);
    const [carPreview, setCarPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.29.115:5000';

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/profile/me`);
                if (res.data.length > 0) {
                    setProfiles(res.data);
                    setProfile(res.data[0]);
                }
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, [API_URL]);

    const switchProfile = (index) => {
        setActiveProfileIndex(index);
        const p = profiles[index];
        setProfile(p);
        if (p.profileImage) {
            setPreview(`${API_URL}/${p.profileImage}`);
        } else {
            setPreview(null);
        }
        if (p.carImage) {
            setCarPreview(`${API_URL}/${p.carImage}`);
        } else {
            setCarPreview(null);
        }
    };

    const addNewCar = () => {
        const newProfile = {
            carName: '',
            ownerName: '',
            phoneNumber: '',
            profession: '',
            instagram: '',
            linkedin: '',
            emergencyContact: '',
            bloodGroup: '',
            city: '',
            isPublic: true,
            showPhone: true,
            emergencyMode: false,
            themeColor: '#3b82f6',
            selectedTheme: 'carbon',
            uniqueId: '',
            specs: { hp: '', torque: '', engine: '', mods: '' },
            youtubeLink: ''
        };
        setProfile(newProfile);
        setActiveProfileIndex(-1); // Indicator for new car
        setPreview(null);
        setCarPreview(null);
        setSelectedFile(null);
        setSelectedCarFile(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSpecChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            specs: {
                ...prev.specs,
                [name]: value
            }
        }));
    };

    const handleCarFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedCarFile(file);
            setCarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            if (profile[key] !== null) {
                if (key === 'specs') {
                    formData.append(key, JSON.stringify(profile[key]));
                } else {
                    formData.append(key, profile[key]);
                }
            }
        });

        if (profile._id) {
            formData.append('id', profile._id);
        }

        if (selectedFile) {
            formData.append('profileImage', selectedFile);
        }
        if (selectedCarFile) {
            formData.append('carImage', selectedCarFile);
        }

        try {
            const res = await axios.post(`${API_URL}/api/profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Refresh profiles list
            const refreshRes = await axios.get(`${API_URL}/api/profile/me`);
            setProfiles(refreshRes.data);

            // Find the updated profile in the new list
            const updatedIndex = refreshRes.data.findIndex(p => p.uniqueId === res.data.uniqueId);
            setActiveProfileIndex(updatedIndex);
            setProfile(refreshRes.data[updatedIndex]);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    const downloadQR = () => {
        const svg = document.getElementById("qr-code-svg");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `ScanMyRide-QR-${profile.uniqueId}.png`;
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
        </div>
    );

    const publicUrl = `${window.location.origin}/p/${profile.uniqueId}`;

    return (
        <div className="min-h-screen bg-black text-white pb-12">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 glass border-b border-white/5 px-4 sm:px-6 py-4 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Logo className="w-10 h-10" />
                    <div className="hidden xs:block">
                        <span className="text-[8px] sm:text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Control Center</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={addNewCar}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-brand text-black hover:scale-105 transition-all font-black text-sm shadow-[0_0_20px_rgba(244,176,11,0.3)]"
                        title="Add Vehicle"
                    >
                        <Plus size={18} /> <span className="hidden sm:inline">Add Vehicle</span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-white/5 font-bold text-sm"
                        title="Logout"
                    >
                        <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: QR & Preview */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-center relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-brand shadow-[0_0_15px_rgba(244,176,11,0.5)]"></div>
                            <h3 className="text-xl font-black mb-8 tracking-tight">YOUR SMART <span className="text-brand">IDENTITY</span></h3>

                            <div className="bg-white p-4 sm:p-6 rounded-3xl inline-block mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform group-hover:scale-105 duration-500">
                                {profile.uniqueId ? (
                                    <QRCode
                                        id="qr-code-svg"
                                        value={publicUrl}
                                        size={220}
                                        fgColor="#000000"
                                        level="H"
                                    />
                                ) : (
                                    <div className="w-[220px] h-[220px] bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm font-bold px-10 text-center">
                                        Complete profile to generate QR
                                    </div>
                                )}
                            </div>

                            {profile.uniqueId && (
                                <div className="space-y-4">
                                    <button
                                        onClick={downloadQR}
                                        className="w-full py-4 rounded-2xl bg-brand text-black font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_20px_-10px_rgba(244,176,11,0.5)]"
                                    >
                                        <Download size={20} /> DOWNLOAD QR
                                    </button>
                                    <a
                                        href={publicUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-4 rounded-2xl bg-white/5 text-white hover:bg-white/10 font-black flex items-center justify-center gap-2 transition-all border border-white/10"
                                    >
                                        <ExternalLink size={20} /> PREVIEW PAGE
                                    </a>
                                </div>
                            )}
                        </motion.div>

                        <div className="glass-card rounded-[2.5rem] p-8 border-l-4 border-l-brand">
                            <h3 className="text-xs font-black text-brand uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Car size={14} /> My Fleet ({profiles.length})
                            </h3>
                            <div className="space-y-3">
                                {profiles.map((p, idx) => (
                                    <button
                                        key={p._id}
                                        onClick={() => switchProfile(idx)}
                                        className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${activeProfileIndex === idx ? 'bg-brand/10 border-brand/50 text-brand' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                {p.carImage ? (
                                                    <img src={`${API_URL}/${p.carImage}`} className="w-full h-full object-cover" alt="" />
                                                ) : <Car size={18} />}
                                            </div>
                                            <div className="text-left">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="font-black text-xs uppercase truncate w-24 sm:w-32">{p.carName || 'Unamed Car'}</div>
                                                    {p.isVerified && <ShieldCheck size={12} className="text-brand fill-current" />}
                                                </div>
                                                <div className="text-[10px] font-bold opacity-60 uppercase">{p.uniqueId}</div>
                                            </div>
                                        </div>
                                        {activeProfileIndex === idx && <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>}
                                    </button>
                                ))}
                                {profiles.length === 0 && (
                                    <div className="text-center py-6 text-zinc-500 text-[10px] font-black uppercase italic">
                                        No vehicles in fleet
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="glass-card rounded-[2.5rem] p-8 border-l-4 border-l-zinc-800">
                            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Device Analytics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                                    <div className="text-2xl font-black text-white mb-1 tracking-tighter">{profile.scanCount || 0}</div>
                                    <div className="text-[8px] text-zinc-500 font-black uppercase tracking-wider">Total Scans</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                                    <div className="text-[10px] font-black text-green-500 flex items-center gap-1 mb-1 uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Online
                                    </div>
                                    <div className="text-[8px] text-zinc-500 font-black uppercase tracking-wider">System</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-8">
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSubmit}
                            className="glass-card rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 space-y-8 sm:space-y-12"
                        >
                            {/* Images Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-8 sm:mb-10">
                                {/* Profile Image */}
                                <div className="flex flex-col items-center relative">
                                    <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-zinc-800 bg-zinc-900 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:border-brand">
                                        {preview ? (
                                            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                                                <Camera size={40} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Camera className="text-brand" size={32} />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                    </div>
                                    <div className="mt-4 flex flex-col items-center">
                                        <span className="text-sm font-black text-brand uppercase tracking-widest">Avatar</span>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 italic">Public Profile Photo</span>
                                    </div>
                                </div>

                                {/* Car Banner Image */}
                                <div className="flex flex-col items-center relative">
                                    <div className="relative group w-full h-40 rounded-3xl overflow-hidden border-4 border-zinc-800 bg-zinc-900 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:border-brand">
                                        {carPreview ? (
                                            <img src={carPreview} alt="Car Banner" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-900">
                                                <Car size={40} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Camera className="text-brand" size={32} />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCarFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                    </div>
                                    <div className="mt-4 flex flex-col items-center">
                                        <span className="text-sm font-black text-brand uppercase tracking-widest">Car Banner</span>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 italic">Background Image</span>
                                    </div>
                                </div>
                            </div>

                            {/* Identity Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                                        <User size={18} className="text-brand" />
                                    </div>
                                    <h2 className="text-lg font-black uppercase tracking-widest">Car & Owner Identity</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Car Identification</label>
                                        <input
                                            name="carName"
                                            value={profile.carName}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                                            placeholder="e.g. Matte Black Mustang"
                                            required
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Owner Name</label>
                                        <input
                                            name="ownerName"
                                            value={profile.ownerName}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Emergency Contact</label>
                                        <input
                                            name="phoneNumber"
                                            value={profile.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Profession</label>
                                        <input
                                            name="profession"
                                            value={profile.profession}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 focus:ring-4 focus:ring-brand/10 outline-none transition-all font-medium"
                                            placeholder="Business Owner"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Additional Info */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                                        <MapPin size={18} className="text-zinc-400" />
                                    </div>
                                    <h2 className="text-lg font-black uppercase tracking-widest text-zinc-300">Socials & Health</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Instagram Profile</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">@</div>
                                            <input
                                                name="instagram"
                                                value={profile.instagram}
                                                onChange={handleChange}
                                                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 pl-10 text-white focus:border-brand/50 focus:bg-zinc-900 transition-all font-medium"
                                                placeholder="handle"
                                            />
                                        </div>
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">LinkedIn ID</label>
                                        <input
                                            name="linkedin"
                                            value={profile.linkedin}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 transition-all font-medium"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            value={profile.bloodGroup}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 transition-all font-black uppercase appearance-none"
                                        >
                                            <option value="">Select Group</option>
                                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand transition-colors">Home City</label>
                                        <input
                                            name="city"
                                            value={profile.city}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 transition-all font-medium"
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Performance Specs */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                                        <Palette size={18} className="text-brand" />
                                    </div>
                                    <h2 className="text-lg font-black uppercase tracking-widest text-zinc-300">Performance & Mods</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-950/30 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5">
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Engine Type</label>
                                        <input
                                            name="engine"
                                            value={profile.specs?.engine}
                                            onChange={handleSpecChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 transition-all font-medium"
                                            placeholder="e.g. 2.0L Turbo I4"
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Horsepower (HP)</label>
                                        <input
                                            name="hp"
                                            value={profile.specs?.hp}
                                            onChange={handleSpecChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 transition-all font-medium"
                                            placeholder="e.g. 450"
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Torque (NM)</label>
                                        <input
                                            name="torque"
                                            value={profile.specs?.torque}
                                            onChange={handleSpecChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 transition-all font-medium"
                                            placeholder="e.g. 520"
                                        />
                                    </div>
                                    <div className="group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Build Video (YouTube/Reel)</label>
                                        <input
                                            name="youtubeLink"
                                            value={profile.youtubeLink}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 transition-all font-medium"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                    <div className="md:col-span-2 group space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Modifications List</label>
                                        <textarea
                                            name="mods"
                                            value={profile.specs?.mods}
                                            onChange={handleSpecChange}
                                            rows="3"
                                            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-brand/50 focus:bg-zinc-900 transition-all font-medium resize-none"
                                            placeholder="Stage 2 ECU, Custom Exhaust, Ohlins Suspension..."
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Pro Theme Engine */}
                            <section className="bg-zinc-950/50 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-brand/20 shadow-[0_0_40px_rgba(244,176,11,0.05)]">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                                            <Palette size={20} className="text-brand" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black uppercase tracking-widest text-white">PRO THEME <span className="text-brand">ENGINE</span></h2>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase">Personalize your public profile aesthetic</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-brand text-black text-[10px] font-black uppercase tracking-widest">PRO UNLOCKED</div>
                                </div>

                                <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                                    {[
                                        { id: 'carbon', name: 'CARBON', colors: ['#000', '#f4b00b'] },
                                        { id: 'neon', name: 'NEON', colors: ['#050505', '#00f2ff'] },
                                        { id: 'cyber', name: 'CYBER', colors: ['#0a0a0f', '#ff0055'] },
                                        { id: 'minimal', name: 'MINIMAL', colors: ['#0f0f0f', '#fff'] },
                                        { id: 'spec', name: 'SPEC', colors: ['#050505', '#ea580c'] }
                                    ].map(theme => (
                                        <button
                                            key={theme.id}
                                            type="button"
                                            onClick={() => setProfile(prev => ({ ...prev, selectedTheme: theme.id }))}
                                            className={`relative group p-4 rounded-2xl border transition-all ${profile.selectedTheme === theme.id ? 'border-brand bg-brand/10' : 'border-white/5 bg-zinc-900/50 hover:bg-zinc-900'}`}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-full h-12 rounded-lg flex gap-1 p-1" style={{ backgroundColor: theme.colors[0] }}>
                                                    <div className="w-1/3 h-full rounded-sm" style={{ backgroundColor: theme.colors[1] }}></div>
                                                    <div className="flex-1 h-full rounded-sm bg-white/5"></div>
                                                </div>
                                                <span className={`text-[10px] font-black tracking-widest ${profile.selectedTheme === theme.id ? 'text-brand' : 'text-zinc-500'}`}>{theme.name}</span>
                                            </div>
                                            {profile.selectedTheme === theme.id && <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black rounded-full"></div></div>}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Visibility Toggles */}
                            <section className="bg-zinc-950/50 p-6 sm:p-8 rounded-[2rem] border border-white/5">
                                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-8 text-center italic">Privacy & Security Guard</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 cursor-pointer transition-all group overflow-hidden relative">
                                        {profile.isPublic && <div className="absolute top-0 left-0 w-1 h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>}
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profile.isPublic ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                                {profile.isPublic ? <Eye size={20} /> : <EyeOff size={20} />}
                                            </div>
                                            <div>
                                                <span className="font-black text-sm block uppercase tracking-wider">Public Accessibility</span>
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase">{profile.isPublic ? 'Everyone can see' : 'QR Is Disabled'}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="isPublic"
                                            checked={profile.isPublic}
                                            onChange={handleChange}
                                            className="w-6 h-6 rounded-lg accent-brand"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 cursor-pointer transition-all group overflow-hidden relative">
                                        {profile.emergencyMode && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>}
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profile.emergencyMode ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                                <AlertCircle size={20} className={profile.emergencyMode ? "animate-pulse" : ""} />
                                            </div>
                                            <div>
                                                <span className="font-black text-sm block uppercase tracking-wider text-red-400">SOS Mode</span>
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase">{profile.emergencyMode ? 'High Alert Active' : 'Normal Standby'}</span>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="emergencyMode"
                                            checked={profile.emergencyMode}
                                            onChange={handleChange}
                                            className="w-6 h-6 rounded-lg accent-red-500"
                                        />
                                    </label>
                                </div>
                            </section>

                            {/* Sticky Footer for Actions */}
                            <div className="flex items-center justify-between pt-10 border-t border-white/5 mt-4">
                                <div className="hidden sm:block">
                                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Last Modified</div>
                                    <div className="text-sm font-bold text-zinc-300">{profile.lastScanned ? new Date(profile.lastScanned).toLocaleDateString() : 'New Device'}</div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`px-12 py-5 rounded-[1.5rem] font-black text-xl flex items-center gap-3 transition-all active:scale-95 shadow-2xl ${success ? 'bg-green-500 text-white translate-y-[-2px]' : 'bg-brand text-black hover:scale-[1.02] hover:shadow-brand/20'}`}
                                >
                                    {saving ? 'UPDATING...' : success ? 'ALL SAVED!' : 'UPDATE PROFILE'}
                                    {!saving && !success && <Save size={24} />}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
