import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = true, text = 'Chargement' }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'w-full h-full min-h-[300px]';

  return (
    <div className={`${containerClasses} flex flex-col items-center justify-center overflow-hidden`}
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      }}
    >
      {/* Walking Model Container */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0 model-walk-container">
        {/* Head */}
        <div className="model-head" />
        
        {/* Body/Torso */}
        <div className="model-torso" />
        
        {/* Arms */}
        <div className="model-arm-left" />
        <div className="model-arm-right" />
        
        {/* Legs */}
        <div className="model-leg-left" />
        <div className="model-leg-right" />
      </div>

      {/* Logo Container */}
      <div className="relative z-10 text-center" style={{ animation: 'logoFloat 3s ease-in-out infinite' }}>
        {/* Logo Image */}
        <img
          src="/logopmm.jpg"
          alt="PMM"
          className="w-[120px] h-[120px] rounded-full object-cover"
          style={{
            border: '3px solid #D4AF37',
            boxShadow: '0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2)',
            animation: 'logoGlow 2s ease-in-out infinite alternate',
          }}
        />

        {/* Brand Name */}
        <div
          className="mt-6 font-playfair text-[28px] font-black italic text-[#D4AF37] tracking-[4px]"
          style={{
            textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
          }}
        >
          PERFECT MODELS
        </div>

        {/* Tagline */}
        <div className="mt-2 font-montserrat text-[11px] font-light tracking-[6px] text-white/60 uppercase">
          Management
        </div>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-[rgba(212,175,55,0.2)] rounded-sm overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
            animation: 'loadingBar 1.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Loading Text */}
      <div
        className="absolute bottom-[50px] font-montserrat text-[10px] tracking-[3px] text-[rgba(212,175,55,0.6)] uppercase"
        style={{ animation: 'loadingText 1.5s ease-in-out infinite' }}
      >
        {text}
      </div>

      {/* Keyframe Styles */}
      <style>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes logoGlow {
          from { box-shadow: 0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2); }
          to { box-shadow: 0 0 60px rgba(212, 175, 55, 0.6), 0 0 100px rgba(212, 175, 55, 0.4); }
        }
        
        /* Model Container - Walking Animation */
        .model-walk-container {
          position: relative;
          width: 200px;
          height: 400px;
          animation: walkBody 1.5s ease-in-out infinite;
        }
        
        @keyframes walkBody {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          25% { transform: translateX(-50%) translateY(-8px) rotate(-1deg); }
          50% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          75% { transform: translateX(-50%) translateY(-8px) rotate(1deg); }
        }
        
        /* Model Head */
        .model-head {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 60px;
          background: linear-gradient(180deg, #D4AF37 0%, rgba(212, 175, 55, 0.3) 100%);
          border-radius: 50% 50% 45% 45%;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        }
        
        /* Model Torso */
        .model-torso {
          position: absolute;
          top: 55px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 140px;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.6) 0%, rgba(212, 175, 55, 0.2) 100%);
          clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
          border-radius: 20px 20px 0 0;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
        }
        
        /* Model Arms */
        .model-arm-left {
          position: absolute;
          top: 65px;
          left: 25px;
          width: 20px;
          height: 120px;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.7) 0%, rgba(212, 175, 55, 0.2) 100%);
          border-radius: 10px;
          transform-origin: top center;
          animation: armSwingLeft 1.5s ease-in-out infinite;
        }
        
        .model-arm-right {
          position: absolute;
          top: 65px;
          right: 25px;
          width: 20px;
          height: 120px;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.7) 0%, rgba(212, 175, 55, 0.2) 100%);
          border-radius: 10px;
          transform-origin: top center;
          animation: armSwingRight 1.5s ease-in-out infinite;
        }
        
        @keyframes armSwingLeft {
          0%, 100% { transform: rotate(-15deg) translateX(0); }
          50% { transform: rotate(20deg) translateX(10px); }
        }
        
        @keyframes armSwingRight {
          0%, 100% { transform: rotate(15deg) translateX(0); }
          50% { transform: rotate(-20deg) translateX(-10px); }
        }
        
        /* Model Legs */
        .model-leg-left {
          position: absolute;
          top: 185px;
          left: 50px;
          width: 25px;
          height: 180px;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.5) 0%, rgba(212, 175, 55, 0.1) 100%);
          border-radius: 12px;
          transform-origin: top center;
          animation: legWalkLeft 1.5s ease-in-out infinite;
        }
        
        .model-leg-right {
          position: absolute;
          top: 185px;
          right: 50px;
          width: 25px;
          height: 180px;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.5) 0%, rgba(212, 175, 55, 0.1) 100%);
          border-radius: 12px;
          transform-origin: top center;
          animation: legWalkRight 1.5s ease-in-out infinite;
        }
        
        @keyframes legWalkLeft {
          0%, 100% { transform: rotate(-10deg) translateY(0); }
          25% { transform: rotate(15deg) translateY(-5px); }
          50% { transform: rotate(0deg) translateY(0); }
          75% { transform: rotate(-5deg) translateY(-3px); }
        }
        
        @keyframes legWalkRight {
          0%, 100% { transform: rotate(10deg) translateY(0); }
          25% { transform: rotate(-15deg) translateY(-5px); }
          50% { transform: rotate(0deg) translateY(0); }
          75% { transform: rotate(5deg) translateY(-3px); }
        }
        
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes loadingText {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loading;
