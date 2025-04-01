// src/components/TextFooter.js
import React from 'react';
import styles from './TextFooter.module.css'; // Assuming you're using CSS modules for styling

const TextFooter = () => {
    return (
        <footer className={styles.footer}>
            <p className={styles.text}>© 2025 Waggle, All Rights Reserved.</p>
        </footer>
    );
};

export default TextFooter;