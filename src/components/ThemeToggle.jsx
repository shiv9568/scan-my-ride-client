import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { uiMode, toggleUiMode } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleUiMode}
            className="p-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--card-border)] text-[var(--text-color)] opacity-70 hover:opacity-100 hover:text-[var(--theme-brand)] transition-all flex items-center justify-center"
            aria-label="Toggle Theme"
        >
            {uiMode === 'dark' ? <Sun size={20} /> : <Moon size={20} className="text-[var(--text-color)] opacity-80" />}
        </motion.button>
    );
};

export default ThemeToggle;
