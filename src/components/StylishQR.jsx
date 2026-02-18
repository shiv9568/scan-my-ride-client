import React from 'react';
import QRCode from 'react-qr-code';

const StylishQR = ({ value, id, isForDownload = false }) => {
    return (
        <div
            id={id}
            style={{
                width: '300px',
                height: '380px',
                backgroundColor: '#f4b00b',
                borderRadius: '56px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                margin: '0 auto',
                fontFamily: "'Inter', system-ui, sans-serif",
                boxShadow: isForDownload ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(244, 176, 11, 0.2)',
                overflow: 'hidden'
            }}
        >
            {/* Header Text */}
            <div style={{ marginTop: '8px', textAlign: 'center', width: '100%' }}>
                <span style={{
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '30px',
                    letterSpacing: '-0.05em',
                    textTransform: 'lowercase',
                    display: 'block',
                    transform: 'scaleY(0.9)',
                    lineHeight: '1'
                }}>
                    scanmyride
                </span>
            </div>

            {/* Main QR Area */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '252px',
                backgroundColor: '#fff',
                borderRadius: '40px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isForDownload ? 'none' : 'inset 0 2px 10px rgba(0,0,0,0.05)'
            }}>
                {/* Left Side Text */}
                <div style={{
                    position: 'absolute',
                    left: '6px',
                    top: '50%',
                    transform: 'translateY(-50%) rotate(-90deg)',
                    whiteSpace: 'nowrap'
                }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scan Me</span>
                </div>

                {/* Right Side Text */}
                <div style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%) rotate(90deg)',
                    whiteSpace: 'nowrap'
                }}>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scan Me</span>
                </div>

                <div style={{ width: '180px', height: '180px' }}>
                    <QRCode
                        value={value}
                        size={512}
                        level="H"
                        fgColor="#000000"
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                </div>
            </div>

            {/* Footer Text */}
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '14px',
                    lineHeight: '1.1',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    padding: '0 24px'
                }}>
                    SCAN TO CONTACT<br />THE VEHICLE OWNER
                </span>
            </div>

            {/* Subtle gloss effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '56px',
                pointerEvents: 'none',
                overflow: 'hidden',
                opacity: 0.1,
                background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%)'
            }}>
            </div>
        </div>
    );
};

export default StylishQR;
