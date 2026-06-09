import { motion } from "framer-motion";
import { Brain, Camera, Upload } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <section className="flex flex-col items-center justify-center text-center px-6 py-24">

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-6"
        >
          Dental Disease Detection System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-300 max-w-2xl"
        >
          AI-powered dental disease detection using deep learning.
          Upload dental images or use your webcam to get instant predictions.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 rounded-2xl bg-cyan-500 text-black font-bold text-lg"
        >
          Start Detection
        </motion.button>

      </section>

      <section className="grid md:grid-cols-3 gap-8 px-8 pb-20">

        <FeatureCard
          icon={<Brain size={40} />}
          title="AI Detection"
          description="MobileNetV2 powered disease prediction."
        />

        <FeatureCard
          icon={<Upload size={40} />}
          title="Upload Images"
          description="Analyze dental images instantly."
        />

        <FeatureCard
          icon={<Camera size={40} />}
          title="Webcam Support"
          description="Capture images directly from your browser."
        />

      </section>

    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800"
    >
      <div className="text-cyan-400 mb-4">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}