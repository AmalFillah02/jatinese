// src/app/(public)/page.jsx
'use client';

import { Parallax } from 'react-parallax';

function SectionContent({ children, align = 'center', animationClass = '' }) {
  const alignmentClass = align === 'end' ? 'items-end pb-20 md:pb-30' : 'items-center';

  return (
    <div className={`h-screen flex ${alignmentClass} justify-start container mx-auto px-6 md:px-12`}>
      <div className={`font-optima text-3xl sm:text-5xl md:text-7xl font-bold text-black max-w-md ${animationClass}`}>
        {children}
      </div>
    </div>
  );
}

// Komponen utama
export default function HomePage() {
  const bgStyle = { objectFit: "cover", objectPosition: "center", width: "100%", height: "100%" };

  return (
    <div>
      <Parallax bgImage="/bg1.jpg" alt="bg1" strength={500} className="potongan-bawah" bgImageStyle={bgStyle}>
        <SectionContent animationClass="animate-fade-in-up">
          <div className="flex flex-col items-start ml-4 sm:ml-8">
            <div>WELCOME</div>
            <a
              href="/gallery"
              className="mt-2 inline-block font-sans text-sm sm:text-base font-semibold
                         bg-white/70 backdrop-blur-sm text-black py-2 px-4 rounded-sm 
                         hover:bg-white hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              Explore
            </a>
          </div>
        </SectionContent>
      </Parallax>

      <Parallax bgImage="/bg5.jpg" alt="bg5" strength={300} className="potongan-ganda tumpang-tindih" bgImageStyle={bgStyle}>
        <SectionContent align="end">
          <div className="flex flex-col items-start ml-4 sm:ml-8 uppercase">
            <span className="text-white opacity-20">Jack Outdoor</span>
            <span className="text-white">Armchair</span>
            <a
              href="/gallery"
              className="mt-2 inline-block font-sans text-sm sm:text-base font-semibold
                         bg-white/70 backdrop-blur-sm text-black py-2 px-4 rounded-sm 
                         hover:bg-white hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              details
            </a>
          </div>
        </SectionContent>
      </Parallax>

      <Parallax bgImage="/bg4.jpg" alt="bg4" strength={300} className="potongan-ganda tumpang-tindih" bgImageStyle={bgStyle}>
        <SectionContent align="end">
          <div className="flex flex-col items-start ml-4 sm:ml-8 uppercase">
            <span className="text-black opacity-30">poise fabric</span>
            <span className="text-black">Armchair</span>
            <a
              href="/gallery"
              className="mt-2 inline-block font-sans text-sm sm:text-base font-semibold
                         bg-black/70 backdrop-blur-sm text-white py-2 px-4 rounded-sm 
                         hover:bg-black hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              details
            </a>
          </div>
        </SectionContent>
      </Parallax>

      <Parallax bgImage="/bg3.jpg" alt="bg3" strength={300} className="potongan-ganda tumpang-tindih" bgImageStyle={bgStyle}>
        <SectionContent align="end">
          <div className="flex flex-col items-start ml-4 sm:ml-8 uppercase">
            <span className="text-white opacity-20">Scandinavian</span>
            <span className="text-white">Desk</span>
            <a
              href="/gallery"
              className="mt-2 inline-block font-sans text-sm sm:text-base font-semibold
                         bg-white/70 backdrop-blur-sm text-black py-2 px-4 rounded-sm 
                         hover:bg-white hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              details
            </a>
          </div>
        </SectionContent>
      </Parallax>

      <Parallax bgImage="/bg2.jpg" alt="bg2" strength={300} className="potongan-atas tumpang-tindih" bgImageStyle={bgStyle}>
        <SectionContent align="end">
          <div className="flex flex-col items-start ml-4 sm:ml-8 uppercase">
            <span className="text-white opacity-20">modern</span>
            <span className="text-white">sideboard</span>
            <a
              href="/gallery"
              className="mt-2 inline-block font-sans text-sm sm:text-base font-semibold
                         bg-white/70 backdrop-blur-sm text-black py-2 px-4 rounded-sm 
                         hover:bg-white hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              details
            </a>
          </div>
        </SectionContent>
      </Parallax>
    </div>
  );
}
