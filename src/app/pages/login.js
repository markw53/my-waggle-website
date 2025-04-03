// pages/login.js
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../styles/Login.module.css';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have this context set up for web
import { useTheme } from '../contexts/ThemeContext'; // Assuming you have this context set up for web
import FormField from '../components/FormField'; // You'll need to create or adapt this component
import Button from '../components/common/button'; // You'll need to create or adapt this component
import TextFooter from '../components/TextFooter'; // You'll need to create or adapt this component

const SocialButton = ({ icon, title, onPress }) => {
  return (
    <button className={styles.socialButton} onClick={onPress}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.socialButtonText}>{title}</span>
    </button>
  );
};

const Divider = ({ text }) => {
  return (
    <div className={styles.dividerContainer}>
      <div className={styles.divider} />
      <span className={styles.dividerText}>{text}</span>
      <div className={styles.divider} />
    </div>
  );
};

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleLogin = async () => {
    try {
      if (!formData.email || !formData.password) {
        alert('Please fill in all fields');
        return;
      }

      await login(formData.email, formData.password);
      router.push('/'); // Redirect to home or dashboard after login
    } catch (error) {
      alert(error.message || 'Login failed');
      setError(error.message);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className={styles.backgroundImage}>
      <div className={styles.safeArea}>
        <div className={styles.container}>
          <div className={styles.formContainer}>
            <h1 className={styles.welcomeTitle}>Welcome to Waggle!</h1>

            <FormField
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email"
              type="email"
              autoCapitalize="off"
              icon="mail-outline"
              error={error?.email}
              required
            />

            <FormField
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              icon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={error?.password}
              required
            />

            <Link href="/forgot-password" className={styles.forgotPasswordButton}>
              Forgot Password?
            </Link>

            <Button
              title="Login"
              onClick={handleLogin}
              disabled={!isFormValid || loading}
              loading={loading}
              variant="primary"
              className={styles.loginButton}
            />

            <Divider text="OR" />

            <SocialButton
              icon={<span className="icon-google"></span>} // You'll need to style this or use an icon library
              title="Continue with Google"
              onPress={() => {/* Handle Google login */ }}
            />

            <div className={styles.signupContainer}>
              <span className={styles.signupText}>Don't have an account?</span>
              <Link href="/signup" className={styles.signupLink}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <TextFooter />
      </div>
    </div>
  );
}