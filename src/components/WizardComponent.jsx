import React from 'react';
import { motion } from 'framer-motion';

const Wizard = ({ message }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-purple-200 p-4 rounded-xl shadow-md"
        >
            <p className="text-purple-500 text-lg italic">🧙 {message}</p>
        </motion.div>
    );
};

export default Wizard;
