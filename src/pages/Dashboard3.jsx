import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import Logo from '../components/Logo';
import { AuthContext } from '../context/AuthContext';
import api, { API_URL } from '../api/axios';
import StylishQR from '../components/StylishQR';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import WelcomeFlow from './WelcomeFlow';
import {
    LogOut, ExternalLink, Download, User, Car, Plus,
    QrCode, Settings, ShieldCheck, Eye, EyeOff,
    AlertCircle, Save, Camera, Check, ChevronDown,
    Zap, LayoutDashboard, Palette, Instagram, Linkedin,
    Droplets, MapPin, ScanLine, X, CheckCircle2, XCircle, Info, Download as DownloadIcon
} from 'lucide-react';

/* ── tiny helpers ── */

// Compress images client-side for mobile (phones take 5-15MB photos)
const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
        // If already small, skip compression
        if (file.size < 1024 * 1024) { resolve(file); return; }
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
                }, 'image/jpeg', quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

const CAR_BRANDS = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Volkswagen', 'Hyundai', 'Kia', 'Skoda', 'Tata', 'Mahindra', 'Maruti Suzuki', 'Suzuki', 'Nissan', 'Renault', 'Jeep', 'Lamborghini', 'Ferrari', 'Porsche', 'Chevrolet', 'Dodge', 'Tesla', 'Volvo', 'Lexus', 'Subaru', 'Mitsubishi', 'Mazda', 'Fiat', 'Peugeot', 'Citroen', 'Bentley', 'Rolls Royce', 'Maserati', 'Bugatti', 'Land Rover', 'Mini', 'Infiniti', 'Acura', 'Genesis', 'Isuzu', 'Cadillac', 'Lincoln', 'Chrysler', 'Ram', 'Alfa Romeo', 'Seat'];

const GlassCard = ({ children, className = '' }) => (
    <div className={`bg-white/5 backdrop-blur-md border border-white/8 rounded-3xl ${className}`}>
        {children}
    </div>
);

/* ──────────── RESPONSIVE QR PREVIEW BOX ────────────
   StylishQR renders at a fixed pixel size (300px sticker, 600px banner,
   500px carImage). This wrapper measures the available container width
   via ResizeObserver and applies a CSS scale so the QR always fits
   perfectly — no clipping — on any screen size.
─────────────────────────────────────────────────────── */
const QR_NATURAL_WIDTH = { sticker: 300, banner: 600, carImage: 500 };
const QR_NATURAL_HEIGHT = { sticker: 400, banner: 240, carImage: 350 };

const QRPreviewBox = ({ children, variant = 'sticker', padding = 24 }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const naturalW = QR_NATURAL_WIDTH[variant] || 300;
        const update = () => {
            const available = el.clientWidth - padding * 2;
            setScale(Math.min(1, available / naturalW));
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [variant, padding]);

    const naturalW = QR_NATURAL_WIDTH[variant] || 300;
    const naturalH = QR_NATURAL_HEIGHT[variant] || 400;

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: `${naturalH * scale + padding * 2}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
                flexShrink: 0,
            }}>
                {children}
            </div>
        </div>
    );
};


/* ─────────── TOAST SYSTEM ─────────── */
const TOAST_VARIANTS = {
    success: {
        icon: CheckCircle2,
        bg: 'bg-[#0f1a0f] border-green-500/40',
        iconColor: 'text-green-400',
        bar: 'bg-green-500',
        title: 'text-green-300',
    },
    error: {
        icon: XCircle,
        bg: 'bg-[#1a0f0f] border-red-500/40',
        iconColor: 'text-red-400',
        bar: 'bg-red-500',
        title: 'text-red-300',
    },
    info: {
        icon: Info,
        bg: 'bg-[#0f0f1a] border-violet-500/40',
        iconColor: 'text-violet-400',
        bar: 'bg-violet-500',
        title: 'text-violet-300',
    },
};

const Toast = ({ toast, onRemove }) => {
    const v = TOAST_VARIANTS[toast.type] || TOAST_VARIANTS.info;
    const Icon = v.icon;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`relative flex items-start gap-3 w-full max-w-sm px-4 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden ${v.bg}`}
            style={{ fontFamily: 'Outfit, sans-serif' }}
        >
            {/* progress bar */}
            <motion.div
                className={`absolute bottom-0 left-0 h-[2px] ${v.bar}`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
            />
            <Icon size={18} className={`${v.iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
                <p className={`font-black text-sm leading-tight ${v.title}`}>{toast.title}</p>
                {toast.message && (
                    <p className="text-white/45 text-[11px] font-medium mt-0.5 leading-snug">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-white/25 hover:text-white/60 hover:bg-white/8 transition-all mt-0.5"
            >
                <X size={13} />
            </button>
        </motion.div>
    );
};

const ToastContainer = ({ toasts, onRemove }) => (
    /*
      Desktop  → top-right corner (top-5 right-5)
      Mobile   → top-center (top-4), safe below status bar, never overlaps bottom nav
    */
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:top-5 sm:right-5 z-[9999] flex flex-col gap-2.5 w-[calc(100vw-2rem)] sm:w-auto pointer-events-none">
        <AnimatePresence mode="sync">
            {toasts.map(t => (
                <div key={t.id} className="pointer-events-auto">
                    <Toast toast={t} onRemove={onRemove} />
                </div>
            ))}
        </AnimatePresence>
    </div>
);

function useToast() {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const remove = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const show = useCallback((type, title, message = '', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev.slice(-4), { id, type, title, message, duration }]);
        timers.current[id] = setTimeout(() => remove(id), duration);
    }, [remove]);

    return { toasts, show, remove };
}

const inp = "w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white focus:border-brand/60 focus:ring-2 focus:ring-brand/20 outline-none transition-all font-medium text-sm placeholder:text-white/20";
const lbl = "block text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5";

const TABS = [
    { id: 'home', icon: LayoutDashboard, label: 'Home' },
    { id: 'identity', icon: User, label: 'Identity' },
    { id: 'socials', icon: Instagram, label: 'Socials' },
    { id: 'theme', icon: Palette, label: 'Theme' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

/* ────── Profile type display helpers ────── */
const PROFILE_TYPE_META = {
    car: { label: 'My Vehicle', short: 'Vehicle', emoji: '🚗' },
    business: { label: 'Brand / Business', short: 'Brand', emoji: '📢' },
    portfolio: { label: 'Portfolio', short: 'Portfolio', emoji: '💼' },
};

/* ─────────── MAIN COMPONENT ─────────── */
const Dashboard3 = () => {
    const { logout, user } = useContext(AuthContext);
    const { toasts, show: showToast, remove: removeToast } = useToast();
    const [activeTab, setActiveTab] = useState('home');
    const [profiles, setProfiles] = useState([]);
    const [activeProfileIndex, setActiveProfileIndex] = useState(0);
    const [showFleet, setShowFleet] = useState(false);
    // Welcome flow: show once per user session (keyed by user id)
    const [showWelcome, setShowWelcome] = useState(false);
    const [profile, setProfile] = useState({
        carName: '', ownerName: '', phoneNumber: '', profession: '',
        instagram: '', linkedin: '', emergencyContact: '', bloodGroup: '',
        city: '', isPublic: true, showPhone: true, emergencyMode: false,
        uniqueId: '', themeColor: '#f4b00b', selectedTheme: 'carbon',
        uiMode: 'dark', fontStyle: 'font-outfit', profileType: 'car',
        resumeLink: '', workDetails: '', youtubeLink: '', carCompany: '',
        specs: { hp: '', torque: '', engine: '', mods: '' },
        qrVariant: 'sticker'
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedCarFile, setSelectedCarFile] = useState(null);
    const [carPreview, setCarPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [success, setSuccess] = useState(false);

    const publicUrl = `${(import.meta.env.VITE_FRONTEND_URL || window.location.origin).replace(/\/$/, "")}/p/${profile.uniqueId}`;

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/api/profile/me');
                if (res.data.length > 0) {
                    setProfiles(res.data);
                    const lastId = localStorage.getItem('lastProfileId');
                    const idx = Math.max(0, res.data.findIndex(p => p.uniqueId === lastId));
                    setActiveProfileIndex(idx);
                    const p = res.data[idx];
                    setProfile({ ...p, customQrLogo: p.customQrLogo || '', qrVariant: p.qrVariant || 'sticker' });
                    if (p.profileImage) setPreview((p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`);
                    if (p.carImage) setCarPreview((p.carImage.startsWith('http') || p.carImage.startsWith('data:')) ? p.carImage : `${API_URL}/${p.carImage}`);
                    // User already has a profile — no welcome needed
                    setShowWelcome(false);
                } else {
                    // Brand new user — check if they've already seen welcome
                    const welcomeKey = `smr_welcomed_${user?._id || 'guest'}`;
                    if (!localStorage.getItem(welcomeKey)) {
                        setShowWelcome(true);
                    } else {
                        // Seen welcome but no profiles yet — go to identity tab
                        setActiveTab('identity');
                    }
                }
                setLoading(false);
            } catch { setLoading(false); }
        };
        fetch();
    }, [user]);

    const switchProfile = (i) => {
        setActiveProfileIndex(i);
        const p = profiles[i];
        setProfile({ ...p, customQrLogo: p.customQrLogo || '', qrVariant: p.qrVariant || 'sticker' });
        localStorage.setItem('lastProfileId', p.uniqueId);
        setPreview(p.profileImage ? ((p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`) : null);
        setCarPreview(p.carImage ? ((p.carImage.startsWith('http') || p.carImage.startsWith('data:')) ? p.carImage : `${API_URL}/${p.carImage}`) : null);
        setShowFleet(false);
    };

    const addNewCar = () => {
        setProfile({
            carName: '', ownerName: '', phoneNumber: '', profession: '',
            instagram: '', linkedin: '', emergencyContact: '', bloodGroup: '',
            city: '', isPublic: true, showPhone: true, emergencyMode: false,
            themeColor: '#f4b00b', selectedTheme: 'carbon', uiMode: 'dark',
            fontStyle: 'font-outfit', profileType: 'car', resumeLink: '',
            workDetails: '', youtubeLink: '', carCompany: '',
            specs: { hp: '', torque: '', engine: '', mods: '' },
            uniqueId: '', qrVariant: 'sticker'
        });
        setActiveProfileIndex(-1); setPreview(null); setCarPreview(null); setSelectedFile(null); setSelectedCarFile(null);
        setShowFleet(false); setActiveTab('identity');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setSaving(true);
        const isNew = !profile._id;
        const fd = new FormData();

        Object.keys(profile).forEach(k => {
            if (['customQrLogo', 'profileImage', 'carImage', '_id', '__v', 'user', 'uniqueId', 'scanCount', 'lastScanned', 'guestbook', 'notifications'].includes(k)) return;
            if (k === 'specs') fd.append('specs', JSON.stringify(profile.specs));
            else if (profile[k] !== null && profile[k] !== undefined) fd.append(k, profile[k]);
        });

        if (profile._id) fd.append('id', profile._id);
        if (selectedFile) fd.append('profileImage', selectedFile);
        if (selectedCarFile) fd.append('carImage', selectedCarFile);

        try {
            const res = await api.post('/api/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

            // Use the response directly to update local state
            const updatedProfile = {
                ...res.data,
                qrVariant: res.data.qrVariant || 'sticker', // Safeguard default
                customQrLogo: res.data.customQrLogo || ''
            };

            setProfile(updatedProfile);
            localStorage.setItem('lastProfileId', updatedProfile.uniqueId);

            // Update the profiles array efficiently
            setProfiles(prev => {
                const idx = prev.findIndex(p => p.uniqueId === updatedProfile.uniqueId);
                if (idx !== -1) {
                    const newArr = [...prev];
                    newArr[idx] = updatedProfile;
                    return newArr;
                }
                return [...prev, updatedProfile];
            });

            if (isNew) {
                localStorage.setItem('lastProfileId', updatedProfile.uniqueId);
                // The profile is already in the 'profiles' array via setProfiles above.
                // We should find its index in the newly updated state.
                setProfiles(prev => {
                    const newIdx = prev.findIndex(p => p.uniqueId === updatedProfile.uniqueId);
                    if (newIdx !== -1) setActiveProfileIndex(newIdx);
                    return prev;
                });
            }

            setSuccess(true); setTimeout(() => setSuccess(false), 3000);
            showToast(
                'success',
                isNew ? 'Profile Created!' : 'Profile Saved!',
                isNew
                    ? `"${res.data.carName || 'New profile'}" is live and ready.`
                    : `Changes saved to "${res.data.carName || 'your profile'}".`
            );
        } catch (err) {
            console.error(err);
            const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');
            const errMsg = isTimeout
                ? 'The server is taking a moment to wake up. Please wait 10 seconds and try again.'
                : err.response?.data?.msg || 'Something went wrong. Please try again.';

            showToast('error', isTimeout ? 'Server Waking Up...' : 'Save Failed', errMsg);
        }
        setSaving(false);
    };

    // Atomic: select a QR variant and immediately persist it
    // This avoids the React async-state race condition where clicking
    // a variant and then 'Save' could save the old variant value.
    const saveQrVariant = async (variantId) => {
        if (!profile._id || saving) return;

        // 1. Optimistic Update
        const oldVariant = profile.qrVariant;
        setProfile(prev => ({ ...prev, qrVariant: variantId }));
        setSaving(true);

        const fd = new FormData();
        const current = { ...profile, qrVariant: variantId };

        Object.keys(current).forEach(k => {
            if (['customQrLogo', 'profileImage', 'carImage', '_id', '__v', 'user', 'uniqueId', 'scanCount', 'lastScanned', 'guestbook', 'notifications'].includes(k)) return;
            if (k === 'specs') fd.append('specs', JSON.stringify(current.specs));
            else if (current[k] !== null && current[k] !== undefined) fd.append(k, current[k]);
        });
        fd.append('id', profile._id);

        try {
            const res = await api.post('/api/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

            // Ensure we update localStorage so re-fetches don't reset index
            localStorage.setItem('lastProfileId', res.data.uniqueId);

            const savedVariant = res.data.qrVariant || 'sticker';

            // Patch ONLY the qrVariant in local state — don't overwrite the full profile
            // (overwriting can cause profileImage/carImage to flicker from base64 re-parses)
            setProfile(prev => prev._id === res.data._id
                ? { ...prev, qrVariant: savedVariant }
                : prev
            );

            setProfiles(prev => {
                const idx = prev.findIndex(p => p._id === res.data._id);
                if (idx !== -1) {
                    const arr = [...prev];
                    arr[idx] = { ...arr[idx], qrVariant: savedVariant };
                    return arr;
                }
                return prev;
            });

            showToast('success', 'Design Saved!', `QR style set to "${variantId === 'carImage' ? 'Photo' : variantId === 'banner' ? 'Industrial' : 'Sticker'}".`);
        } catch (err) {
            console.error(err);
            // ⚠️ Do NOT revert the visual selection — keep the optimistic update.
            // The user can see what they selected and retry if needed.

            const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');
            const isOffline = err.message?.includes('Network Error') || !navigator.onLine;

            const title = isOffline ? 'No Internet' : isTimeout ? 'Server Waking Up...' : 'Save Failed';
            const msg = isOffline
                ? 'You appear to be offline. Template selected locally — save again when connected.'
                : isTimeout
                    ? 'Server took too long to respond. Please try saving again in a moment.'
                    : 'Could not save QR design. Please try again.';

            showToast('error', title, msg);
        } finally {
            setSaving(false);
        }
    };


    const downloadQR = async () => {
        const node = document.getElementById('d3-sticker-dl');
        if (!node) return;
        setDownloading(true);
        showToast('info', 'Generating QR Sticker…', 'Your high-res sticker is being prepared.');

        // ── Utility: convert any URL to an inline data URI ──────────────────────
        const urlToDataUri = async (src) => {
            if (!src || src.startsWith('data:') || src.startsWith('blob:')) return src;
            try {
                // Primary: fetch with CORS to get raw bytes as data URI
                const resp = await fetch(src, { mode: 'cors', cache: 'no-cache' });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const blob = await resp.blob();
                return await new Promise(res => {
                    const r = new FileReader();
                    r.onloadend = () => res(r.result);
                    r.readAsDataURL(blob);
                });
            } catch {
                // Fallback: draw via <img crossOrigin> → canvas → dataURL
                try {
                    return await new Promise((res, rej) => {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => {
                            const c = document.createElement('canvas');
                            c.width = img.naturalWidth || 500;
                            c.height = img.naturalHeight || 350;
                            c.getContext('2d').drawImage(img, 0, 0);
                            res(c.toDataURL('image/jpeg', 0.92));
                        };
                        img.onerror = rej;
                        img.src = src + (src.includes('?') ? '&' : '?') + '_cb=' + Date.now();
                    });
                } catch {
                    // Last resort: 1x1 transparent pixel so canvas doesn't get tainted
                    return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                }
            }
        };

        // ── Utility: wait for an <img> to fully load its current src ──────────
        const waitForImg = (img) => new Promise(resolve => {
            if (img.complete && img.naturalHeight !== 0) return resolve();
            img.onload = resolve;
            img.onerror = resolve;
        });

        // Give the hidden node a moment to mount and layout (important on mobile)
        await new Promise(r => setTimeout(r, 800));

        try {
            // ── Step 1: Inline all <img> srcs as data URIs ──────────────────────
            const imgs = Array.from(node.querySelectorAll('img'));
            const originals = imgs.map(img => ({ el: img, src: img.src, style: img.getAttribute('style') }));

            const dataUris = await Promise.all(imgs.map(img => urlToDataUri(img.src)));

            // Swap srcs + wait for img.decode() — guarantees GPU-level paint
            await Promise.all(imgs.map(async (img, i) => {
                img.src = dataUris[i];
                try {
                    if (typeof img.decode === 'function') await img.decode();
                    else await waitForImg(img);
                } catch (_) {
                    await waitForImg(img);
                }
            }));

            // ── Step 2: Inline any CSS background-image URLs ─────────────────────
            // Defensive: catches any element using background-image instead of <img>
            const bgOriginals = [];
            const allEls = Array.from(node.querySelectorAll('*'));
            await Promise.all(allEls.map(async (el) => {
                const computed = window.getComputedStyle(el);
                const bg = computed.backgroundImage;
                if (bg && bg !== 'none') {
                    const match = bg.match(/url\(["']?(https?[^"')]+)["']?\)/);
                    if (match && match[1]) {
                        const dataUri = await urlToDataUri(match[1]);
                        bgOriginals.push({ el, orig: el.style.backgroundImage });
                        el.style.backgroundImage = `url(${dataUri})`;
                    }
                }
            }));

            // ── Step 3: Extra settle buffer — mobile GPUs need more time ─────────
            await new Promise(r => setTimeout(r, 1000));

            // Mobile detection for safe DPR: iOS/Android crash on high canvas sizes
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            const dpr = isMobile ? 2 : Math.min(window.devicePixelRatio || 2, 3);

            const url = await toPng(node, {
                quality: 1,
                pixelRatio: dpr,
                backgroundColor: null, // preserve sticker/banner brand colors
                skipAutoScale: true,
                cacheBust: true,
                fetchRequestInit: { mode: 'cors', cache: 'no-cache' },
            });

            const a = document.createElement('a');
            a.download = `ScanMyRide-${profile.uniqueId || 'QR'}.png`;
            a.href = url;
            a.click();
            showToast('success', 'QR Sticker Downloaded!', 'Check your downloads folder.');

            // Restore original srcs and CSS
            originals.forEach(o => { o.el.src = o.src; });
            bgOriginals.forEach(o => { o.el.style.backgroundImage = o.orig; });
        } catch (err) {
            console.error('Download error:', err);
            showToast('error', 'Download Failed', 'Could not generate the sticker. Please try again.');
        }
        setDownloading(false);
    };


    /* ── Welcome flow handler ── */
    const handleWelcomeSelect = (type) => {
        const welcomeKey = `smr_welcomed_${user?._id || 'guest'}`;
        localStorage.setItem(welcomeKey, '1');
        setShowWelcome(false);
        // Pre-select the profile type and send to identity setup
        setProfile(prev => ({ ...prev, profileType: type }));
        setActiveTab('identity');
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Loading fleet...</p>
            </div>
        </div>
    );

    /* ── stat cards for home view ── */
    const stats = [
        { label: 'QR Scans', value: profile.scanCount || 0, icon: ScanLine, color: '#a78bfa' },
        { label: 'Fleet Size', value: profiles.length || 0, icon: Car, color: '#f4b00b' },
        { label: 'Visibility', value: profile.isPublic ? 'PUBLIC' : 'PRIVATE', icon: Eye, color: '#34d399' },
        { label: 'Emergency', value: profile.emergencyMode ? 'ACTIVE' : 'OFF', icon: AlertCircle, color: profile.emergencyMode ? '#f87171' : '#a1a1aa' },
    ];

    return (
        <div className="min-h-screen bg-[#0c0c0e] text-white flex" style={{ fontFamily: 'Outfit, sans-serif' }}>

            {/* ── WELCOME FLOW OVERLAY (first-time users) ── */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <WelcomeFlow userName={user?.name} onSelect={handleWelcomeSelect} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── TOAST NOTIFICATIONS ── */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* ── LEFT SIDEBAR ── */}
            <aside className="hidden lg:flex w-[72px] flex-shrink-0 flex-col items-center py-7 gap-5 border-r border-white/5 bg-black/40 fixed h-full z-50">
                <div className="mb-3">
                    <Logo className="w-9 h-9" iconOnly />
                </div>
                <div className="flex-1 flex flex-col gap-2 w-full px-2">
                    {TABS.map(t => {
                        const Icon = t.icon;
                        const active = activeTab === t.id;
                        return (
                            <button key={t.id} onClick={() => setActiveTab(t.id)} title={t.label}
                                className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-brand text-black shadow-[0_0_20px_rgba(244,176,11,0.4)]' : 'text-white/30 hover:bg-white/5 hover:text-white/70'}`}>
                                <Icon size={20} />
                            </button>
                        );
                    })}
                </div>
                {user?.role === 'admin' && (
                    <Link to="/admin" title="Admin" className="w-10 h-10 rounded-2xl flex items-center justify-center text-purple-400 hover:bg-purple-500/10 transition-all">
                        <ShieldCheck size={20} />
                    </Link>
                )}
                <button onClick={logout} title="Logout" className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/20 hover:bg-red-500/10 hover:text-red-400 transition-all">
                    <LogOut size={20} />
                </button>
            </aside>

            {/* ── MAIN AREA ── */}
            <div className="flex-1 lg:ml-[72px] flex flex-col min-h-screen overflow-y-auto pb-24 lg:pb-0">

                {/* ── TOP BAR ── */}
                <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-4 bg-[#0c0c0e]/80 backdrop-blur-xl border-b border-white/5">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">ScanMyRide Dashboard</p>
                        <p className="font-black text-lg leading-none mt-0.5">
                            {TABS.find(t => t.id === activeTab)?.label}
                            <span className="text-brand">.</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Profile switcher */}
                        <button onClick={() => setShowFleet(!showFleet)}
                            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 border border-white/8 hover:border-brand/30 transition-all text-sm">
                            <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center overflow-hidden">
                                {preview ? <img src={preview} className="w-full h-full object-cover" alt="" /> : <Car size={12} className="text-brand" />}
                            </div>
                            <span className="font-black text-xs max-w-[90px] truncate text-white/70">{profile.carName || 'My Profile'}</span>
                            <ChevronDown size={12} className={`text-white/40 transition-transform ${showFleet ? 'rotate-180' : ''}`} />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-black text-xs">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </div>

                    {/* Fleet dropdown */}
                    <AnimatePresence>
                        {showFleet && (
                            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                className="absolute right-5 top-16 w-72 bg-[#18181b] border border-white/10 rounded-3xl p-3 shadow-2xl z-50 space-y-2">
                                {profiles.map((p, i) => (
                                    <button key={p._id} onClick={() => switchProfile(i)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${activeProfileIndex === i ? 'bg-brand/10 border border-brand/30' : 'hover:bg-white/5 border border-transparent'}`}>
                                        <div className="w-9 h-9 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                            {p.profileImage ? <img src={(p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`} className="w-full h-full object-cover" alt="" /> : <Car size={16} className="text-brand" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-black text-sm truncate">{p.carName || 'Unnamed'}</div>
                                            <div className="text-[9px] text-white/30 font-bold uppercase">{p.uniqueId}</div>
                                        </div>
                                        {activeProfileIndex === i && <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center flex-shrink-0"><Check size={8} className="text-black" /></div>}
                                    </button>
                                ))}
                                <button onClick={addNewCar} className="w-full flex items-center gap-2 p-3 rounded-2xl border border-dashed border-white/10 hover:border-brand/30 text-white/30 hover:text-brand transition-all text-sm font-black">
                                    <Plus size={16} /> Add New Vehicle
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                {/* ── CONTENT PANELS ── */}
                <div className="flex-1 p-4 lg:p-6">
                    <AnimatePresence mode="wait">

                        {/* ══════════ HOME ══════════ */}
                        {activeTab === 'home' && (
                            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

                                {/* HERO CARD */}
                                <GlassCard className="relative overflow-hidden min-h-[240px] lg:min-h-[290px]">
                                    {/* Car banner as background */}
                                    {carPreview ? (
                                        <img src={carPreview} alt="Car" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-black/40" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                                    {/* Profile avatar - right side like the reference image */}
                                    {preview && (
                                        <div className="absolute right-0 bottom-0 h-full w-2/5 max-w-[200px]">
                                            <img src={preview} alt="Profile" className="w-full h-full object-cover object-top opacity-70" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)' }} />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="relative z-10 p-6 lg:p-8">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand mb-2">Active Profile</p>
                                        <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-1">
                                            {profile.carName || 'Your Vehicle'}
                                        </h2>
                                        <p className="text-white/50 font-bold text-sm mb-6">{profile.ownerName || 'Set up your profile'} • {profile.city || 'Location'}</p>

                                        <div className="flex gap-3 flex-wrap">
                                            <a href={publicUrl} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-2 px-5 py-2.5 bg-brand text-black rounded-2xl font-black text-sm hover:brightness-110 transition-all shadow-[0_8px_20px_rgba(244,176,11,0.3)]">
                                                <ExternalLink size={16} /> View Profile
                                            </a>
                                            {/* Moved download button */}
                                        </div>

                                        {/* Inline mini stats */}
                                        <div className="flex gap-6 mt-6 pt-6 border-t border-white/8">
                                            {[
                                                { v: profile.bloodGroup || '—', l: 'Blood Group' },
                                                { v: PROFILE_TYPE_META[profile.profileType]?.emoji + ' ' + (PROFILE_TYPE_META[profile.profileType]?.short || '—'), l: 'Profile Type' },
                                                { v: profile.isPublic ? '🟢 On' : '🔴 Off', l: 'Visibility' },
                                                { v: profile.emergencyMode ? '🚨 SOS' : '✅ Safe', l: 'Emergency' },
                                            ].map(s => (
                                                <div key={s.l}>
                                                    <div className="font-black text-sm text-white">{s.v}</div>
                                                    <div className="text-[9px] text-white/30 font-bold uppercase tracking-wider">{s.l}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* STAT CARDS */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {stats.map(s => {
                                        const Icon = s.icon;
                                        return (
                                            <GlassCard key={s.label} className="p-5">
                                                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: s.color + '22' }}>
                                                    <Icon size={18} style={{ color: s.color }} />
                                                </div>
                                                <div className="font-black text-xl text-white">{s.value}</div>
                                                <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-1">{s.label}</div>
                                            </GlassCard>
                                        );
                                    })}
                                </div>

                                {/* BOTTOM ROW: QR + Fleet list */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* QR Card */}
                                    <GlassCard className="p-5 flex flex-col items-center gap-4">
                                        <div className="w-full flex items-center justify-between mb-1">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Your QR Sticker</p>
                                            <Zap size={14} className="text-brand" />
                                        </div>
                                        {profile.uniqueId ? (
                                            <>
                                                <div className="flex flex-col items-center gap-6 w-full">
                                                    {/* Responsive QR Preview Container */}
                                                    <div className="w-full bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                                                        <QRPreviewBox variant={profile.qrVariant || 'sticker'} padding={20}>
                                                            <StylishQR
                                                                id="stylish-sticker"
                                                                value={publicUrl}
                                                                bgColor={profile.themeColor}
                                                                carCompany={profile.carCompany || ''}
                                                                variant={profile.qrVariant || 'sticker'}
                                                                carImage={carPreview}
                                                                ownerName={profile.ownerName}
                                                            />
                                                        </QRPreviewBox>
                                                    </div>

                                                    {/* Quick Variant Toggle on Home Tab */}
                                                    <div className="w-full flex flex-col gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                                                        <p className="text-center text-[9px] font-black uppercase tracking-widest text-white/30 pt-1">Select &amp; Save QR Design</p>
                                                        <div className="flex gap-2 w-full">
                                                            {[
                                                                { id: 'sticker', label: 'Sticker' },
                                                                { id: 'banner', label: 'Industrial' },
                                                                { id: 'carImage', label: 'Photo' }
                                                            ].map(v => (
                                                                <button key={v.id}
                                                                    onClick={() => saveQrVariant(v.id)}
                                                                    disabled={saving}
                                                                    className={`flex-1 py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all disabled:opacity-50 ${profile.qrVariant === v.id
                                                                        ? 'bg-brand text-black ring-2 ring-brand/50'
                                                                        : 'text-white/30 hover:bg-white/5'
                                                                        }`}>
                                                                    {saving && profile.qrVariant === v.id ? '...' : v.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {!profile._id && (
                                                            <p className="text-center text-[9px] text-yellow-400/70 pb-1">Save your profile first to lock in a design.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                                                    <StylishQR
                                                        id="d3-sticker-dl"
                                                        value={publicUrl}
                                                        isForDownload
                                                        bgColor={profile.themeColor}
                                                        carCompany={profile.carCompany || ''}
                                                        variant={profile.qrVariant || 'sticker'}
                                                        carImage={carPreview}
                                                        ownerName={profile.ownerName}
                                                    />
                                                </div>
                                                <p className="text-[9px] text-white/20 font-bold text-center tracking-wider mt-4">/p/{profile.uniqueId}</p>
                                                {/* Scan Count Badge */}
                                                <div className="w-full mt-4 flex items-center justify-center gap-4">
                                                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                                                        <ScanLine size={15} className="text-violet-400 flex-shrink-0" />
                                                        <span className="text-violet-300 font-black text-sm">{profile.scanCount || 0}</span>
                                                        <span className="text-violet-400/60 font-bold text-[10px] uppercase tracking-widest">scans</span>
                                                    </div>
                                                    <button onClick={downloadQR} disabled={downloading} className="flex-1 px-4 py-3 rounded-2xl bg-brand font-black text-black text-xs uppercase flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(244,176,11,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                                                        <Download size={15} /> {downloading ? '...' : 'Download'}
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 py-8">
                                                <QrCode size={40} className="text-white/10" />
                                                <p className="text-xs text-white/30 font-bold text-center">Fill identity to generate QR</p>
                                                <button onClick={() => setActiveTab('identity')} className="px-4 py-2 bg-brand text-black rounded-xl font-black text-xs">Set Up →</button>
                                            </div>
                                        )}
                                    </GlassCard>

                                    {/* Fleet List */}
                                    <GlassCard className="lg:col-span-2 p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Your Fleet</p>
                                            <button onClick={addNewCar} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand/10 border border-brand/20 text-brand font-black text-[10px] hover:bg-brand/20 transition-all">
                                                <Plus size={12} /> Add
                                            </button>
                                        </div>
                                        {profiles.length === 0 ? (
                                            <div className="text-center py-8 text-white/20 text-xs font-bold">No vehicles yet</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {/* table header */}
                                                <div className="grid grid-cols-3 gap-2 px-3 pb-2 border-b border-white/5">
                                                    {['Vehicle', 'Type', 'Status'].map(h => <p key={h} className="text-[8px] font-black uppercase tracking-widest text-white/20">{h}</p>)}
                                                </div>
                                                {profiles.map((p, i) => (
                                                    <button key={p._id} onClick={() => switchProfile(i)}
                                                        className={`w-full grid grid-cols-3 gap-2 items-center p-3 rounded-2xl transition-all text-left ${activeProfileIndex === i ? 'bg-brand/10 border border-brand/20' : 'hover:bg-white/5 border border-transparent'}`}>
                                                        {/* name + avatar */}
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden bg-white/5 flex items-center justify-center">
                                                                {p.profileImage ? <img src={(p.profileImage.startsWith('http') || p.profileImage.startsWith('data:')) ? p.profileImage : `${API_URL}/${p.profileImage}`} className="w-full h-full object-cover" alt="" /> : <Car size={14} className="text-brand/60" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-black text-xs truncate">{p.carName || 'Unnamed'}</div>
                                                                <div className="text-[8px] text-white/25 font-bold truncate">{p.ownerName}</div>
                                                            </div>
                                                        </div>
                                                        {/* type */}
                                                        <div className="text-[9px] font-black uppercase tracking-wider text-white/40">{PROFILE_TYPE_META[p.profileType]?.short || p.profileType || 'Vehicle'}</div>
                                                        {/* status */}
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${p.isPublic ? 'bg-green-400' : 'bg-red-400'}`} />
                                                            <span className="text-[9px] font-bold text-white/40">{p.isPublic ? 'Public' : 'Private'}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </GlassCard>
                                </div>
                            </motion.div>
                        )}

                        {/* ══════════ IDENTITY ══════════ */}
                        {activeTab === 'identity' && (
                            <motion.div key="identity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                                    {/* Left: Images */}
                                    <div className="space-y-4">
                                        {/* Avatar */}
                                        <GlassCard className="p-4 flex flex-col items-center gap-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 self-start">Profile Photo</p>
                                            <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-white/10 bg-white/5 group cursor-pointer">
                                                {preview ? <img src={preview} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center"><Camera size={28} className="text-white/20" /></div>}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={20} className="text-brand" /></div>
                                                <input type="file" accept="image/*" onChange={async e => { const f = e.target.files[0]; if (f) { const compressed = await compressImage(f); setSelectedFile(compressed); setPreview(URL.createObjectURL(compressed)); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </GlassCard>

                                        {/* Car Banner */}
                                        <GlassCard className="p-4 flex flex-col items-center gap-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 self-start">Car / Banner Image</p>
                                            <div className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5 group cursor-pointer">
                                                {carPreview ? <img src={carPreview} className="w-full h-full object-cover" alt="Car" /> : <div className="w-full h-full flex items-center justify-center"><Car size={28} className="text-white/20" /></div>}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera size={20} className="text-brand" /></div>
                                                <input type="file" accept="image/*" onChange={async e => { const f = e.target.files[0]; if (f) { const compressed = await compressImage(f, 1600, 0.85); setSelectedCarFile(compressed); setCarPreview(URL.createObjectURL(compressed)); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                        </GlassCard>

                                        {/* Profile Type */}
                                        <GlassCard className="p-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3">Profile Purpose</p>
                                            <div className="flex flex-col gap-2">
                                                {['car', 'business', 'portfolio'].map(t => (
                                                    <button key={t} type="button" onClick={() => setProfile(p => ({ ...p, profileType: t }))}
                                                        className={`py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${profile.profileType === t ? 'bg-brand text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </GlassCard>
                                    </div>

                                    {/* Right: Form fields */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <GlassCard className="p-5 space-y-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{profile.profileType === 'car' ? ' Vehicle Info' : profile.profileType === 'business' ? ' Brand Info' : ' Portfolio Info'}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div><label className={lbl}>{profile.profileType === 'car' ? 'Vehicle Name' : profile.profileType === 'business' ? 'Brand / Business Name' : 'Your Name'}</label><input name="carName" value={profile.carName} onChange={handleChange} className={inp} placeholder={profile.profileType === 'car' ? 'Matte Black Mustang' : profile.profileType === 'business' ? 'My Awesome Brand' : 'John Doe'} required /></div>
                                                <div><label className={lbl}>{profile.profileType === 'business' ? 'Owner / Founder' : 'Owner Name'}</label><input name="ownerName" value={profile.ownerName} onChange={handleChange} className={inp} placeholder="John Doe" /></div>
                                                {profile.profileType === 'car' && (
                                                    <div className="sm:col-span-2">
                                                        <label className={lbl}>Car Company / Brand <span className="text-brand">★ Logo on QR</span></label>
                                                        <select
                                                            name="carCompany"
                                                            value={profile.carCompany || ''}
                                                            onChange={handleChange}
                                                            className={inp}
                                                        >
                                                            <option value="">Select car brand...</option>
                                                            {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                                        </select>
                                                        <p className="text-[9px] text-brand/60 font-black mt-1.5 ml-1">✦ Choose your brand to display logo in QR code center</p>
                                                    </div>
                                                )}
                                                <div><label className={lbl}>Phone</label><input name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} className={inp} placeholder="+91 98765 43210" /></div>
                                                <div><label className={lbl}>Profession</label><input name="profession" value={profile.profession} onChange={handleChange} className={inp} placeholder="Car Enthusiast" /></div>
                                                <div className="sm:col-span-2"><label className={lbl}>City</label><input name="city" value={profile.city} onChange={handleChange} className={inp} placeholder="Mumbai, India" /></div>
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="p-5 space-y-4">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-red-400">Emergency Info</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div><label className={lbl}>Emergency Contact</label><input name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} className={inp} placeholder="+91 98765 43210" /></div>
                                                <div><label className={lbl}>Blood Group</label>
                                                    <select name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} className={inp}>
                                                        <option value="">Select</option>
                                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </GlassCard>

                                        {profile.profileType === 'car' && (
                                            <GlassCard className="p-5 space-y-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-brand">Spec-Sheet</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {[['hp', 'HP'], ['torque', 'Torque'], ['engine', 'Engine'], ['mods', 'Mods']].map(([k, l]) => (
                                                        <div key={k}><label className={lbl}>{l}</label>
                                                            <input value={profile.specs?.[k] || ''} onChange={e => setProfile(p => ({ ...p, specs: { ...p.specs, [k]: e.target.value } }))} className={inp} placeholder={l} />
                                                        </div>
                                                    ))}
                                                    <div className="col-span-2"><label className={lbl}>YouTube Build Link</label><input name="youtubeLink" value={profile.youtubeLink || ''} onChange={handleChange} className={inp} placeholder="https://youtube.com/..." /></div>
                                                </div>
                                            </GlassCard>
                                        )}

                                        {profile.profileType === 'business' && (
                                            <GlassCard className="p-5 space-y-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-violet-400"> Brand Details</p>
                                                <div><label className={lbl}>Business Description / Tagline</label><textarea name="workDetails" value={profile.workDetails} onChange={handleChange} className={inp + ' min-h-[90px] resize-none'} placeholder="What does your brand do? What makes it special?" /></div>
                                                <div><label className={lbl}>Website / Campaign Link</label><input name="resumeLink" value={profile.resumeLink} onChange={handleChange} className={inp} placeholder="https://yourbrand.com" /></div>
                                                <div><label className={lbl}>YouTube / Promo Video</label><input name="youtubeLink" value={profile.youtubeLink || ''} onChange={handleChange} className={inp} placeholder="https://youtube.com/..." /></div>
                                            </GlassCard>
                                        )}
                                        {profile.profileType === 'portfolio' && (
                                            <GlassCard className="p-5 space-y-4">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-blue-400"> Professional</p>
                                                <div><label className={lbl}>Summary / Bio</label><textarea name="workDetails" value={profile.workDetails} onChange={handleChange} className={inp + ' min-h-[90px] resize-none'} placeholder="Brief professional intro..." /></div>
                                                <div><label className={lbl}>Portfolio / Resume Link</label><input name="resumeLink" value={profile.resumeLink} onChange={handleChange} className={inp} placeholder="https://..." /></div>
                                            </GlassCard>
                                        )}

                                        <button type="submit" disabled={saving}
                                            className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all active:scale-95 ${success ? 'bg-green-500 text-white' : 'bg-brand text-black hover:brightness-110 shadow-[0_8px_24px_rgba(244,176,11,0.3)]'}`}>
                                            {saving ? 'Saving...' : success ? <><Check size={20} /> Saved!</> : <><Save size={20} /> Save Profile</>}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ══════════ SOCIALS ══════════ */}
                        {activeTab === 'socials' && (
                            <motion.div key="socials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
                                    <GlassCard className="p-6 space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Social Profiles</p>
                                        <div>
                                            <label className={lbl}>Instagram</label>
                                            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold text-sm">@</span><input name="instagram" value={profile.instagram} onChange={handleChange} className={inp + ' pl-9'} placeholder="yourhandle" /></div>
                                        </div>
                                        <div>
                                            <label className={lbl}>LinkedIn</label>
                                            <input name="linkedin" value={profile.linkedin} onChange={handleChange} className={inp} placeholder="linkedin-username" />
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6 space-y-3">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Privacy & Visibility</p>
                                        {[
                                            { name: 'isPublic', label: 'Public Profile', sub: 'Anyone with QR can view your page', icon: Eye },
                                            { name: 'showPhone', label: 'Show Phone Number', sub: 'Display phone on public page', icon: Eye },
                                            { name: 'emergencyMode', label: '🚨 Emergency Mode', sub: 'Flash SOS info prominently', icon: AlertCircle },
                                        ].map(item => {
                                            const Icon = item.icon;
                                            return (
                                                <label key={item.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/8 hover:border-brand/20 cursor-pointer transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <Icon size={18} className={profile[item.name] ? 'text-brand' : 'text-white/20'} />
                                                        <div>
                                                            <div className="font-black text-sm text-white">{item.label}</div>
                                                            <div className="text-[9px] text-white/30 font-bold">{item.sub}</div>
                                                        </div>
                                                    </div>
                                                    <input type="checkbox" name={item.name} checked={profile[item.name]} onChange={handleChange} className="w-5 h-5 rounded accent-brand cursor-pointer" />
                                                </label>
                                            );
                                        })}
                                    </GlassCard>

                                    <button type="submit" disabled={saving} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 ${success ? 'bg-green-500 text-white' : 'bg-brand text-black hover:brightness-110'}`}>
                                        {saving ? 'Saving...' : success ? <><Check size={20} /> Saved!</> : <><Save size={20} /> Save Changes</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ══════════ THEME ══════════ */}
                        {activeTab === 'theme' && (
                            <motion.div key="theme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                                    <GlassCard className="p-6 space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Public Profile Theme</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { id: 'carbon', name: 'Carbon', colors: ['#000', '#f4b00b'] },
                                                { id: 'neon', name: 'Neon', colors: ['#050505', '#00f2ff'] },
                                                { id: 'cyber', name: 'Cyber', colors: ['#0a0a0f', '#ff0055'] },
                                                { id: 'minimal', name: 'Minimal', colors: ['#111', '#fff'] },
                                            ].map(t => (
                                                <button key={t.id} type="button" onClick={() => setProfile(p => ({ ...p, selectedTheme: t.id }))}
                                                    className={`relative p-4 rounded-2xl border transition-all ${profile.selectedTheme === t.id ? 'border-brand bg-brand/10' : 'border-white/8 bg-white/3 hover:border-white/20'}`}>
                                                    <div className="w-full h-9 rounded-xl mb-2 flex gap-1 p-1.5" style={{ backgroundColor: t.colors[0] }}>
                                                        <div className="w-1/3 h-full rounded-md" style={{ backgroundColor: t.colors[1] }} />
                                                        <div className="flex-1 h-full rounded-md bg-white/5" />
                                                    </div>
                                                    <div className="text-xs font-black uppercase tracking-widest text-white/50">{t.name}</div>
                                                    {profile.selectedTheme === t.id && <div className="absolute top-2 right-2 w-4 h-4 bg-brand rounded-full flex items-center justify-center"><Check size={8} className="text-black" /></div>}
                                                </button>
                                            ))}
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6 space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Accent Color</p>
                                        <div className="flex gap-3 flex-wrap">
                                            {['#f4b00b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316'].map(c => (
                                                <button key={c} type="button" onClick={() => setProfile(p => ({ ...p, themeColor: c }))}
                                                    className={`w-10 h-10 rounded-full border-4 transition-all ${profile.themeColor === c ? 'border-white scale-125 shadow-lg' : 'border-transparent'}`}
                                                    style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                        <input type="color" name="themeColor" value={profile.themeColor || '#f4b00b'} onChange={handleChange}
                                            className="w-full h-12 rounded-2xl cursor-pointer border border-white/10 p-1 bg-transparent" />
                                    </GlassCard>

                                    <GlassCard className="p-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Scan QR Design</p>
                                            <div className="px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20">
                                                <span className="text-[8px] font-black text-brand uppercase tracking-tighter">Live Preview</span>
                                            </div>
                                        </div>

                                        {/* Real-time Preview in Theme Tab - Responsive Scaled */}
                                        <div className="w-full bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                                            <QRPreviewBox variant={profile.qrVariant || 'sticker'} padding={24}>
                                                <StylishQR
                                                    value={publicUrl || 'https://scanmyride.in'}
                                                    bgColor={profile.themeColor}
                                                    carCompany={profile.carCompany || ''}
                                                    variant={profile.qrVariant || 'sticker'}
                                                    carImage={carPreview}
                                                    ownerName={profile.ownerName}
                                                />
                                            </QRPreviewBox>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {[
                                                { id: 'sticker', name: 'Premium Sticker', desc: 'Classic Rounded' },
                                                { id: 'banner', name: 'Industrial Banner', desc: 'Alert Theme' },
                                                { id: 'carImage', name: 'Car Banner', desc: 'Photo Background' },
                                            ].map(v => (
                                                <button key={v.id} type="button"
                                                    onClick={() => saveQrVariant(v.id)}
                                                    disabled={saving}
                                                    className={`p-4 rounded-2xl border transition-all text-left group active:scale-[0.98] disabled:opacity-50 ${profile.qrVariant === v.id ? 'border-brand bg-brand/10 shadow-[0_0_20px_rgba(244,176,11,0.15)]' : 'border-white/8 bg-white/3 hover:border-white/20'}`}>
                                                    <div className={`text-sm font-black mb-1 transition-colors ${profile.qrVariant === v.id ? 'text-brand' : 'text-white'}`}>{v.name}</div>
                                                    <div className="text-[9px] text-white/30 uppercase font-bold">{v.desc}</div>
                                                    {profile.qrVariant === v.id && (
                                                        <motion.div layoutId="qr-active" className="mt-3 w-6 h-6 bg-brand rounded-lg flex items-center justify-center">
                                                            <Check size={12} className="text-black" />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-4 rounded-2xl bg-brand/5 border border-brand/10">
                                            <p className="text-[10px] text-brand/80 font-bold leading-relaxed">
                                                ✦ Tip: The "Car Banner" uses your uploaded vehicle image as a backdrop. Make sure to upload a high-quality photo in the Identity tab.
                                            </p>
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6 space-y-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Typography</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[['font-outfit', 'Outfit', 'Modern'], ['font-inter', 'Inter', 'Clean'], ['font-roboto', 'Roboto', 'Pro'], ['font-mono', 'Mono', 'Tech']].map(([id, name, desc]) => (
                                                <button key={id} type="button" onClick={() => setProfile(p => ({ ...p, fontStyle: id }))}
                                                    className={`p-4 rounded-2xl border transition-all text-left ${profile.fontStyle === id ? 'border-brand bg-brand/10' : 'border-white/8 bg-white/3'}`}>
                                                    <div className={`text-2xl font-black mb-1 ${id}`}>Aa</div>
                                                    <div className="text-xs font-black text-white/50">{name}</div>
                                                    <div className="text-[9px] text-white/25 uppercase font-bold">{desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </GlassCard>

                                    <button type="submit" disabled={saving} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 ${success ? 'bg-green-500 text-white' : 'bg-brand text-black hover:brightness-110'}`}>
                                        {saving ? 'Saving...' : success ? <><Check size={20} /> Saved!</> : <><Save size={20} /> Save Theme</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ══════════ SETTINGS ══════════ */}
                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md space-y-4">
                                <GlassCard className="p-5 space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Account</p>
                                    <div className="p-4 rounded-2xl bg-white/5">
                                        <div className="font-black">{user?.name || 'User'}</div>
                                        <div className="text-xs text-white/30 font-bold">{user?.email}</div>
                                    </div>
                                    <button onClick={addNewCar} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/8 hover:border-brand/30 transition-all text-left">
                                        <Plus size={18} className="text-brand" />
                                        <div><div className="font-black text-sm">Add New Vehicle</div><div className="text-[9px] text-white/30 font-bold">Create another profile</div></div>
                                    </button>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" className="w-full flex items-center gap-3 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-all text-left">
                                            <ShieldCheck size={18} className="text-purple-400" />
                                            <div><div className="font-black text-sm text-purple-300">Admin Panel</div><div className="text-[9px] text-purple-400/50 font-bold">Manage all users</div></div>
                                        </Link>
                                    )}
                                    <button onClick={logout} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/15 hover:border-red-400/30 transition-all text-left">
                                        <LogOut size={18} className="text-red-400" />
                                        <div><div className="font-black text-sm text-red-400">Log Out</div><div className="text-[9px] text-red-400/40 font-bold">Sign out of ScanMyRide</div></div>
                                    </button>
                                </GlassCard>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            {/* ── MOBILE BOTTOM NAV ── */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around px-2 py-2 bg-[#111]/90 backdrop-blur-xl border-t border-white/5">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl flex-1 transition-all ${active ? 'bg-brand text-black' : 'text-white/25 hover:text-white/60'}`}>
                            <Icon size={active ? 22 : 20} />
                            <span className={`text-[7px] font-black uppercase tracking-widest ${active ? '' : 'hidden sm:block'}`}>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div >
    );
};

export default Dashboard3;
