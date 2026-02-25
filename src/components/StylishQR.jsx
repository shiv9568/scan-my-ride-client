import React, { useState } from 'react';
import QRCode from 'react-qr-code';

/* ─────────────────────────────────────
   Car brand logo map
   Uses GitHub-hosted transparent PNGs
   (filippofilip95/car-logos-dataset)
───────────────────────────────────── */
const GH = 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized';

export const CAR_LOGOS = {
    'toyota': `${GH}/toyota.png`,
    'honda': `${GH}/honda.png`,
    'bmw': `${GH}/bmw.png`,
    'mercedes': `${GH}/mercedes-benz.png`,
    'mercedes-benz': `${GH}/mercedes-benz.png`,
    'audi': `${GH}/audi.png`,
    'ford': `${GH}/ford.png`,
    'volkswagen': `${GH}/volkswagen.png`,
    'vw': `${GH}/volkswagen.png`,
    'hyundai': `${GH}/hyundai.png`,
    'kia': `${GH}/kia.png`,
    'nissan': `${GH}/nissan.png`,
    'renault': `${GH}/renault.png`,
    'jeep': `${GH}/jeep.png`,
    'lamborghini': `${GH}/lamborghini.png`,
    'ferrari': `${GH}/ferrari.png`,
    'porsche': `${GH}/porsche.png`,
    'chevrolet': `${GH}/chevrolet.png`,
    'chevy': `${GH}/chevrolet.png`,
    'dodge': `${GH}/dodge.png`,
    'tesla': `${GH}/tesla.png`,
    'volvo': `${GH}/volvo.png`,
    'lexus': `${GH}/lexus.png`,
    'subaru': `${GH}/subaru.png`,
    'mitsubishi': `${GH}/mitsubishi.png`,
    'suzuki': `${GH}/suzuki.png`,
    'maruti': `${GH}/suzuki.png`,
    'maruti suzuki': `${GH}/suzuki.png`,
    'tata': `${GH}/tata.png`,
    'mahindra': `${GH}/mahindra.png`,
    'skoda': `${GH}/skoda.png`,
    'seat': `${GH}/seat.png`,
    'peugeot': `${GH}/peugeot.png`,
    'citroen': `${GH}/citroen.png`,
    'fiat': `${GH}/fiat.png`,
    'maserati': `${GH}/maserati.png`,
    'bugatti': `${GH}/bugatti.png`,
    'bentley': `${GH}/bentley.png`,
    'rolls royce': `${GH}/rolls-royce.png`,
    'rolls-royce': `${GH}/rolls-royce.png`,
    'alfa romeo': `${GH}/alfa-romeo.png`,
    'land rover': `${GH}/land-rover.png`,
    'range rover': `${GH}/land-rover.png`,
    'mini': `${GH}/mini.png`,
    'infiniti': `${GH}/infiniti.png`,
    'acura': `${GH}/acura.png`,
    'buick': `${GH}/buick.png`,
    'cadillac': `${GH}/cadillac.png`,
    'lincoln': `${GH}/lincoln.png`,
    'chrysler': `${GH}/chrysler.png`,
    'ram': `${GH}/ram.png`,
    'genesis': `${GH}/genesis.png`,
    'isuzu': `${GH}/isuzu.png`,
    'mazda': `${GH}/mazda.png`,
};

export function getCarLogoUrl(company) {
    if (!company) return null;
    return CAR_LOGOS[company.toLowerCase().trim()] || null;
}

/* ─────────────────────────────────────
   Stylish QR Sticker Component
───────────────────────────────────── */
const StylishQR = ({ 
    value, 
    id, 
    isForDownload = false, 
    carCompany = '', 
    logoUrl, 
    bgColor = '#f4b00b',
    variant = 'sticker', // 'sticker', 'banner', 'carImage'
    carImage = null,
    ownerName = ''
}) => {
    const [logoError, setLogoError] = useState(false);

    const resolvedLogoUrl = logoUrl || getCarLogoUrl(carCompany);
    const showLogo = resolvedLogoUrl && !logoError;

    // Dark background detection for text color
    const isDark = (() => {
        try {
            const hex = bgColor.replace('#', '');
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return (r * 299 + g * 587 + b * 114) / 1000 < 128;
        } catch { return false; }
    })();
    const textColor = isDark ? '#ffffff' : '#000000';
    const textColorMuted = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)';

    /* ── TEMPLATE: BANNER (Yellow/Black Industrial) ── */
    if (variant === 'banner') {
        return (
            <div
                id={id}
                style={{
                    width: '600px',
                    height: '240px',
                    backgroundColor: '#f4b00b', // Specific yellow for banner
                    padding: '2px', // Border space
                    display: 'flex',
                    position: 'relative',
                    fontFamily: "'Outfit', sans-serif",
                    overflow: 'hidden',
                    backgroundImage: `repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)`, // Hazard stripes border
                }}
            >
                <div style={{
                    flex: 1,
                    backgroundColor: '#f4b00b',
                    margin: '12px',
                    display: 'flex',
                    padding: '16px',
                    gap: '20px',
                    alignItems: 'center',
                }}>
                    {/* Left: QR Area */}
                    <div style={{
                        width: '180px',
                        backgroundColor: '#fff',
                        borderRadius: '0',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <QRCode
                            value={value || 'https://scanmyride.in'}
                            size={180}
                            level="H"
                            fgColor="#000"
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                        />
                        <div style={{ marginTop: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: 900, color: '#000' }}>ScanMyRide</div>
                        </div>
                    </div>

                    {/* Right: Text Area */}
                    <div style={{ flex: 1, color: '#000', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                            SCAN TO CONTACT<br />THE VEHICLE OWNER
                        </h2>
                        <div style={{ margin: '12px 0', borderTop: '2px solid #000', opacity: 0.2 }} />
                        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, opacity: 0.8 }}>
                            वाहन मालिक से संपर्क करने के<br />लिए कोड को स्कैन करें
                        </h3>
                        <div style={{ marginTop: '16px', fontSize: '10px', fontWeight: 600, opacity: 0.6 }}>
                            Use your camera, Google Lens, Paytm or any<br />QR Scanner app to scan the QR tag.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── TEMPLATE: CAR IMAGE (Premium Overlay) ── */
    if (variant === 'carImage') {
        const defaultCarImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000';
        return (
            <div
                id={id}
                style={{
                    width: '500px',
                    height: '350px',
                    backgroundColor: '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    position: 'relative',
                    fontFamily: "'Outfit', sans-serif",
                    overflow: 'hidden',
                    borderRadius: '24px',
                }}
            >
                {/* Background Image */}
                <img 
                    src={carImage || defaultCarImage} 
                    alt="Car" 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                
                {/* Visual Polish: Top gradient */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)' }} />

                {/* Bottom Overlay */}
                <div style={{
                    height: '40%',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '20px 30px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    position: 'relative',
                    zIndex: 2,
                    borderTopLeftRadius: '100% 10%', // Curved top effect
                    borderTopRightRadius: '100% 10%',
                }}>
                    {/* QR Code */}
                    <div style={{ width: '100px', height: '100px', flexShrink: 0 }}>
                        <QRCode
                            value={value || 'https://scanmyride.in'}
                            size={100}
                            level="H"
                            fgColor="#000"
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                        />
                    </div>

                    {/* Branding */}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '28px', fontWeight: 900, color: '#000', letterSpacing: '-0.05em' }}>ScanMyRide</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginTop: '2px' }}>
                            {ownerName || 'Safety & Contact Profile'}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── DEFAULT TEMPLATE: STICKER (Original) ── */
    return (
        <div
            id={id}
            style={{
                width: '300px',
                height: '400px',
                backgroundColor: bgColor,
                borderRadius: '56px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                margin: '0 auto',
                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                boxShadow: isForDownload ? 'none' : `0 30px 60px -12px rgba(0,0,0,0.6), 0 0 30px ${bgColor}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
                overflow: 'hidden',
            }}
        >
            {/* ── Gloss shine ── */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '50%',
                borderRadius: '56px 56px 0 0', pointerEvents: 'none',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)',
            }} />

            {/* ── Dot pattern texture ── */}
            <div style={{
                position: 'absolute', inset: 0, borderRadius: '56px', pointerEvents: 'none', opacity: 0.06,
                backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                backgroundSize: '12px 12px',
            }} />

            {/* ── Header ── */}
            <div style={{ marginTop: '4px', textAlign: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
                <span style={{
                    color: textColor, fontWeight: 900, fontSize: '28px',
                    letterSpacing: '-0.05em',
                    display: 'block', lineHeight: '1', opacity: 0.95,
                }}>
                    ScanMyRide
                </span>
                {carCompany && (
                    <span style={{
                        color: textColor, fontWeight: 700, fontSize: '10px',
                        letterSpacing: '0.25em', textTransform: 'uppercase',
                        display: 'block', marginTop: '3px', opacity: 0.55,
                    }}>
                        {carCompany}
                    </span>
                )}
            </div>

            {/* ── Main QR Area ── */}
            <div style={{
                position: 'relative', width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '36px',
                padding: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isForDownload ? 'none' : 'inset 0 2px 12px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.15)',
            }}>
                {/* Side labels */}
                {['left', 'right'].map(side => (
                    <div key={side} style={{
                        position: 'absolute',
                        [side]: '5px', top: '50%',
                        transform: `translateY(-50%) rotate(${side === 'left' ? '-90deg' : '90deg'})`,
                        whiteSpace: 'nowrap',
                    }}>
                        <span style={{ fontSize: '9px', fontWeight: 900, color: '#c4c4c4', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                            SCAN NOW
                        </span>
                    </div>
                ))}

                {/* QR Code */}
                <div style={{ width: '185px', height: '185px', position: 'relative' }}>
                    <QRCode
                        value={value || 'https://scanmyride.in'}
                        size={512}
                        level="H"
                        fgColor="#111111"
                        style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    />

                    {/* ── Car Company Logo Overlay (center of QR) ── */}
                    {showLogo ? (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '46px', height: '46px',
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            padding: '5px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                            border: '1px solid rgba(0,0,0,0.06)',
                        }}>
                            <img
                                src={resolvedLogoUrl}
                                alt={carCompany}
                                onError={() => setLogoError(true)}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    ) : (
                        /* SMR logo mark in center when no car company */
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '36px', height: '36px',
                            backgroundColor: bgColor,
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L4 7v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V7L12 2z" fill={textColor} opacity="0.9" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Footer ── */}
            <div style={{ marginBottom: '8px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <span style={{
                    color: textColor, fontWeight: 900, fontSize: '11px',
                    textTransform: 'uppercase', letterSpacing: '0.12em',
                    display: 'block', opacity: 0.7,
                }}>
                    SCAN TO CONTACT THE OWNER
                </span>
                <div style={{
                    marginTop: '6px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '5px'
                }}>
                    <div style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        backgroundColor: textColor, opacity: 0.4,
                        animation: isForDownload ? 'none' : 'pulse 2s infinite',
                    }} />
                    <span style={{ color: textColorMuted, fontSize: '9px', fontWeight: 700, letterSpacing: '0.15em' }}>
                        SCANMYRIDE.IN
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StylishQR;
