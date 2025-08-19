"use client";

import React, { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const ChairModel = () => {
  const { scene } = useGLTF("/images/modern_chair.glb");
  return <primitive object={scene} scale={4.5} position={[0, -2, 0]} />;
};

const ModelViewer = () => {
  return (
    <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={1.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <ChairModel />

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
      </Suspense>
    </Canvas>
  );
};

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default function AboutPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full h-[100dvh] bg-[#8e8e8e] overflow-hidden font-sans flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <motion.div
            className="md:col-start-2 md:col-span-5 flex flex-col items-start text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tighter"
              variants={itemVariants}
            >
              Jatinese Wood
            </motion.h1>
            <motion.p
              className="text-lg text-white mb-8 max-w-md leading-relaxed"
              variants={itemVariants}
            >
              Premium & timeless furniture, custom-made in Jepara, Indonesia.
              Bringing the heritage of Jepara worldwide.
            </motion.p>
            <a
              href="https://wa.me/62895325626700?text=Hello%20Jatinese%20Wood"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                className="group flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-400 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
                <ArrowRightIcon />
              </motion.button>
            </a>
          </motion.div>

          <div className="col-span-1 md:col-start-8 md:col-span-5 relative flex w-full h-80 md:h-96 items-center justify-center">
            {isMounted && <ModelViewer />}
          </div>
        </div>
      </div>
    </section>
  );
}
