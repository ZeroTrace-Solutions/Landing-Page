import { motion } from 'framer-motion';

export const ScrollReveal = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  distance = 50,
  duration = 0.8,
  once = false,
  className = "" 
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      scale: 0.95,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: duration,
        delay: delay / 1000,
        ease: [0.25, 1, 0.5, 1], // Custom cubic-bezier for smoother feel
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: once, margin: "-10% 0px -10% 0px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
