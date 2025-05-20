import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
  useColorScheme,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/color';
import ThemedView from '../../components/ThemeView';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.js';

const OTPVerificationScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.dark;
  const { phone } = useLocalSearchParams(); // comes from login page
  const router = useRouter();
  const { updateUser } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const inputs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (text, index) => {
    const val = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (val) {
      newOtp[index] = val[0];
      setOtp(newOtp);
      if (index < 3) {
        inputs.current[index + 1]?.focus();
      }
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          inputs.current[index - 1]?.focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // 1. OTP Verify Logic
  const handleVerify = async () => {
    if (otp.join('').length < 4) {
      setErrorMsg('Please enter the 4-digit OTP.');
      setShowError(true);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://<YOUR_BACKEND_URL>/api/verify-otp', {
        phone,
        otp: otp.join(''),
      });
      // Update context with user info
      updateUser({
        phone,
        otpVerified: true,
        ...res.data.user, // name, goal, etc.
      });
      // Success modal dikhao
      setSuccessMsg('OTP verified successfully!');
      setShowSuccess(true);

      // 1.5 sec baad redirect karo (UX smoothness ke liye)
      setTimeout(() => {
        setShowSuccess(false);
        if (res.data.user?.name && res.data.user?.goal) {
          router.replace('/home');
        } else {
          router.replace('/userdetails');
        }
      }, 1500);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Invalid OTP. Please try again.'
      );
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // 2. Resend OTP Logic
  const handleResend = async () => {
    setOtp(['', '', '', '']);
    setResendTimer(30);
    setResendLoading(true);
    try {
      await axios.post('http://<YOUR_BACKEND_URL>/api/send-otp', { phone });
      setSuccessMsg('OTP sent successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1200);
    } catch (err) {
      setErrorMsg('OTP resend failed. Try again later.');
      setShowError(true);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ThemedView style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>

        <Text style={[styles.title, { color: theme.text }]}>Verify OTP</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Code is sent to{' '}
          <Text style={{ fontWeight: '600', color: theme.text }}>{phone}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputs.current[index] = ref)}
              style={[
                styles.otpBox,
                {
                  borderColor: theme.border,
                  color: theme.text,
                  backgroundColor: theme.card,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={text => handleChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              autoFocus={index === 0}
              selectionColor={theme.button}
            />
          ))}
        </View>

        <Pressable
          onPress={handleVerify}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? theme.primaryPressed : theme.button,
            },
            styles.verifyBtn,
          ]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.buttonText} />
          ) : (
            <Text style={[styles.verifyText, { color: theme.buttonText }]}>Verify OTP</Text>
          )}
        </Pressable>

        <Text style={[styles.resendText, { color: theme.textSecondary }]}>
          Didn’t receive code?{' '}
          {resendTimer === 0 ? (
            <Text
              onPress={handleResend}
              style={{ color: theme.button, fontWeight: '600' }}
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </Text>
          ) : (
            <Text style={{ fontWeight: '600', color: theme.textSecondary }}>
              Resend in {resendTimer}s
            </Text>
          )}
        </Text>

        {/* Error Modal */}
        <Modal
          animationType="fade"
          transparent
          visible={showError}
          onRequestClose={() => setShowError(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.alertBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.alertText, { color: theme.text }]}>
                {errorMsg}
              </Text>
              <Pressable
                onPress={() => setShowError(false)}
                style={[styles.alertButton, { backgroundColor: theme.button }]}
              >
                <Text style={{ color: theme.buttonText, fontWeight: '600' }}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent
          visible={showSuccess}
          onRequestClose={() => setShowSuccess(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.alertBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.alertText, { color: theme.text, fontWeight: '700' }]}>
                {successMsg}
              </Text>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  otpBox: {
    width: 60,
    height: 60,
    fontSize: 24,
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  verifyBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  alertText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
