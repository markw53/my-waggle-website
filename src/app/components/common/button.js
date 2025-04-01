// src/components/common/Button.js
import React from 'react';
import styles from './Button.module.css'; // Assuming you're using CSS modules for styling
import { useTheme } from '../../contexts/ThemeContext';
import { FaSpinner } from 'react-icons/fa'; // Example icon from react-icons for loading spinner

export const BUTTON_VARIANTS = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    OUTLINE: 'outline',
    GHOST: 'ghost',
    DANGER: 'danger',
};

export const BUTTON_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
};

const Button = ({
    title,
    onPress,
    variant = BUTTON_VARIANTS.PRIMARY,
    size = BUTTON_SIZES.MEDIUM,
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    style,
    textStyle,
    ...props
}) => {
    const { colors, shadows, isDark } = useTheme();

    const getVariantStyles = () => {
        const variantStyles = {
            container: {},
            text: {},
        };

        switch (variant) {
            case BUTTON_VARIANTS.PRIMARY:
                variantStyles.container = {
                    backgroundColor: colors.primary,
                    boxShadow: shadows.small,
                };
                variantStyles.text = {
                    color: colors.white,
                };
                break;

            case BUTTON_VARIANTS.SECONDARY:
                variantStyles.container = {
                    backgroundColor: colors.secondary,
                    boxShadow: shadows.small,
                };
                variantStyles.text = {
                    color: colors.white,
                };
                break;

            case BUTTON_VARIANTS.OUTLINE:
                variantStyles.container = {
                    backgroundColor: 'transparent',
                    borderWidth: '1px',
                    borderColor: colors.primary,
                };
                variantStyles.text = {
                    color: colors.primary,
                };
                break;

            case BUTTON_VARIANTS.GHOST:
                variantStyles.container = {
                    backgroundColor: 'transparent',
                };
                variantStyles.text = {
                    color: colors.primary,
                };
                break;

            case BUTTON_VARIANTS.DANGER:
                variantStyles.container = {
                    backgroundColor: colors.error,
                    boxShadow: shadows.small,
                };
                variantStyles.text = {
                    color: colors.white,
                };
                break;
        }

        if (disabled) {
            variantStyles.container = {
                ...variantStyles.container,
                opacity: '0.5',
            };
        }

        return variantStyles;
    };

    const getSizeStyles = () => {
        switch (size) {
            case BUTTON_SIZES.SMALL:
                return {
                    container: {
                        padding: '8px 16px',
                        borderRadius: '6px',
                    },
                    text: {
                        fontSize: '14px',
                    },
                    icon: '16px',
                };

            case BUTTON_SIZES.LARGE:
                return {
                    container: {
                        padding: '16px 32px',
                        borderRadius: '12px',
                    },
                    text: {
                        fontSize: '18px',
                    },
                    icon: '24px',
                };

            default: // MEDIUM
                return {
                    container: {
                        padding: '12px 24px',
                        borderRadius: '8px',
                    },
                    text: {
                        fontSize: '16px',
                    },
                    icon: '20px',
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    const renderContent = () => {
        if (loading) {
            return <FaSpinner className={styles.loadingSpinner} style={{ color: variantStyles.text.color, fontSize: sizeStyles.icon }} />;
        }

        const iconElement = icon && (
            <span className={`${styles.icon} ${iconPosition === 'right' ? styles.iconRight : ''}`} style={{ fontSize: sizeStyles.icon }}>
                {icon}
            </span>
        );

        return (
            <div className={styles.contentContainer}>
                {iconPosition === 'left' && iconElement}
                <span className={styles.text} style={{ ...sizeStyles.text, ...variantStyles.text, ...textStyle }}>
                    {title}
                </span>
                {iconPosition === 'right' && iconElement}
            </div>
        );
    };

    return (
        <button
            onClick={onPress}
            disabled={disabled || loading}
            className={`${styles.button} ${fullWidth ? styles.fullWidth : ''}`}
            style={{
                ...sizeStyles.container,
                ...variantStyles.container,
                ...style,
            }}
            {...props}
        >
            {renderContent()}
        </button>
    );
};

export default Button;