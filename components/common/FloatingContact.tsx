'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, X } from 'lucide-react'

export default function FloatingContact() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <>
            {/* WhatsApp */}
            <motion.a
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              href="https://wa.me/34641093550?text=Hola%20quiero%20una%20cita"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <span className="text-sm font-medium">WhatsApp</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
            </motion.a>

            {/* Call */}
            <motion.a
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              href="tel:+34641093550"
              aria-label="Llamar"
              className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-full bg-obsidian-600 border border-gold/30 text-white shadow-lg hover:border-gold/60 hover:shadow-gold transition-all duration-200"
            >
              <span className="text-sm font-medium">+34 641 09 35 50</span>
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-gold" />
              </div>
            </motion.a>
          </>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.95 }}
        aria-label="Contact options"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
