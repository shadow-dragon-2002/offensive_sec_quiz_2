import React from 'react';
import { motion } from 'framer-motion';
import soundManager from '../soundManager';

function WelcomeScreen({ onStart, error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        {/* Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-orbitron font-black text-center mb-8 holographic-text"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          ⚡ CYBER INFILTRATION ⚡
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-2xl md:text-3xl font-orbitron font-bold neon-blue mb-2">
            OFFENSIVE SECURITY ESCAPE ROOM
          </p>
          <p className="text-lg md:text-xl font-jetbrains text-gray-400">
            Red Team Operations: Progressive Challenge Mode
          </p>
        </motion.div>

        {/* Mission Briefing Card */}
        <motion.div
          className="cyber-card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-orbitron font-bold neon-green mb-4">
              🎯 MISSION BRIEFING
            </h2>
            <p className="text-gray-300 font-jetbrains mb-4">
              You have been tasked with infiltrating a highly secured network through 30 progressive 
              offensive security challenges. Each correct answer maintains your operational integrity 
              score, while mistakes will cost you points. Complete all stages within the time limit.
            </p>
          </div>

          {/* Challenge Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-dark-surface/50 p-4 rounded border border-cyber-blue/20">
              <h3 className="text-lg font-orbitron font-bold text-cyber-blue mb-2">
                ⏱️ TIME LIMIT
              </h3>
              <p className="font-jetbrains text-gray-300">25 minutes neural countdown</p>
            </div>

            <div className="bg-dark-surface/50 p-4 rounded border border-cyber-pink/20">
              <h3 className="text-lg font-orbitron font-bold text-cyber-pink mb-2">
                📊 SCORING SYSTEM
              </h3>
              <p className="font-jetbrains text-gray-300">Start: 100 pts | Wrong: -10 pts</p>
            </div>

            <div className="bg-dark-surface/50 p-4 rounded border border-neon-green/20">
              <h3 className="text-lg font-orbitron font-bold text-neon-green mb-2">
                🎮 PROGRESSION
              </h3>
              <p className="font-jetbrains text-gray-300">30 stages across 6 attack phases</p>
            </div>

            <div className="bg-dark-surface/50 p-4 rounded border border-cyber-purple/20">
              <h3 className="text-lg font-orbitron font-bold text-cyber-purple mb-2">
                🔒 NEURAL PROTOCOL
              </h3>
              <p className="font-jetbrains text-gray-300">One playthrough per session</p>
            </div>
          </div>

          {/* Attack Phases */}
          <div className="mb-6">
            <h3 className="text-xl font-orbitron font-bold neon-pink mb-3">
              ⚔️ ATTACK PHASES
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'RECONNAISSANCE', color: 'text-cyber-blue' },
                { name: 'SCANNING', color: 'text-neon-green' },
                { name: 'EXPLOITATION', color: 'text-hot-pink' },
                { name: 'PRIVILEGE ESCALATION', color: 'text-cyber-purple' },
                { name: 'LATERAL MOVEMENT', color: 'text-electric-blue' },
                { name: 'EXFILTRATION', color: 'text-cyber-pink' }
              ].map((phase, idx) => (
                <motion.div
                  key={phase.name}
                  className={`bg-dark-surface/30 p-2 rounded border border-current/30 ${phase.color}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                >
                  <span className="font-jetbrains text-sm font-bold">
                    {phase.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-dark-surface/50 p-4 rounded border border-hot-pink/30">
            <h3 className="text-lg font-orbitron font-bold text-hot-pink mb-2">
              ⚠️ NEURAL PROTOCOL CONSTRAINTS
            </h3>
            <ul className="space-y-2 font-jetbrains text-gray-300">
              <li className="flex items-start">
                <span className="text-hot-pink mr-2">▸</span>
                <span>Session locks after initiation - no restarts allowed</span>
              </li>
              <li className="flex items-start">
                <span className="text-hot-pink mr-2">▸</span>
                <span>Timer continues across page refreshes (same session)</span>
              </li>
              <li className="flex items-start">
                <span className="text-hot-pink mr-2">▸</span>
                <span>Must complete all 30 stages to unlock leaderboard submission</span>
              </li>
              <li className="flex items-start">
                <span className="text-hot-pink mr-2">▸</span>
                <span>Focus and careful decision-making are critical for success</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded mb-6 font-jetbrains"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Start Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="cyber-button text-xl px-12 py-5 rounded-lg font-orbitron uppercase tracking-wider"
            onClick={onStart}
            onMouseEnter={() => soundManager.hover()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-3">
              <span>⚡ INITIATE OPERATION</span>
              <span className="text-2xl">▶</span>
            </span>
          </motion.button>
          
          <p className="mt-4 text-gray-500 font-jetbrains text-sm">
            Click to begin your infiltration mission
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default WelcomeScreen;
