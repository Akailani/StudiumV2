import React from "react";
import { motion } from "framer-motion";

const Wizard = ({ message }) => {
    return (
        <motion.div
            className="wizard-container"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
        >
            <motion.img
                src="/wizard.png"
                alt="Wizard"
                className="w-32 h-32"
                key={message}
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div
                className="wizard-message text-sm bg-white p-2 rounded shadow mt-2"
                key={message}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {message}
            </motion.div>
        </motion.div>
    );
};

export default Wizard;
