import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { uiMode, toggleUiMode } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleUiMode}
            className="p-2.5 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-brand transition-all flex items-center justify-center"
            aria-label="Toggle Theme"
        >
            {uiMode === 'dark' ? <Sun size={20} /> : <Moon size={20} className="text-zinc-600" />}
        </motion.button>
    );
};

export default ThemeToggle;
