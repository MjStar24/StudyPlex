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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/color';
import ThemedView from '../../components/ThemeView';
import axios from 'axios';
import {SERVER_URL} from '@env'

import { useDispatch, useSelector } from 'react-redux';
import { setAuth, setOtp } from '../../store/authSlice';

const OTPVerificationScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.dark;
  const router = useRouter();

  const dispatch = useDispatch();

  const phone = useSelector((state) => state.auth.otp.phone);
  const serverHash = useSelector((state) => state.auth.otp.hash);

  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const inputs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
        if (userHasDetails) {
          router.replace('/home');
        } else {
          router.replace('/userdetails');
        }
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);


  const [userHasDetails, setUserHasDetails] = useState(false);
  const handleChange = (text, index) => {
    const val = text.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otpDigits];
    newOtp[index] = val;
    setOtpDigits(newOtp);
    if (val && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace') {
      if (otpDigits[index] === '') {
        if (index > 0) {
          inputs.current[index - 1]?.focus();
        }
      } else {
        const newOtp = [...otpDigits];
        newOtp[index] = '';
        setOtpDigits(newOtp);
      }
    }
  };
  // 1. OTP Verify Logic
  const handleVerify = async () => {
    if (otpDigits.join('').length < 4) {
      setErrorMsg('Please enter the 4-digit OTP.');
      setShowError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/auth/api/verify-otp`, {
        phone,
        otp: otpDigits.join(''),
        hash: serverHash,
      });

    const { user, accessToken } = res.data;   
    dispatch(setAuth({ user, token: accessToken }));
   // Success modal dikhao
     setUserHasDetails(Boolean(user.name && user.email && user.city));
      setSuccessMsg('OTP verified successfully!');
      setShowSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Invalid OTP. Please try again.';
      setErrorMsg(message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtpDigits(['', '', '', '']);
    setResendTimer(30);
    setResendLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/auth/api/send-otp`, { phone });
      const newHash = res.data.hash;

      dispatch(setOtp({ phone, hash: newHash }));

      setSuccessMsg('OTP sent successfully!');
      setShowSuccess(true);
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
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessible={true}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>

        <Text style={[styles.title, { color: theme.text }]}>Verify OTP</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Code is sent to{' '}
          <Text style={{ fontWeight: '600', color: theme.text }}>{phone}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otpDigits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
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
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              autoFocus={index === 0}
              selectionColor={theme.button}
              editable={!loading && !resendLoading}
              accessible={true}
              accessibilityLabel={`OTP digit ${index + 1}`}
              returnKeyType={index === 3 ? 'done' : 'next'}
              onSubmitEditing={() => {
                if (index < 3) inputs.current[index + 1]?.focus();
              }}
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
          accessible={true}
          accessibilityLabel="Verify OTP"
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
              onPress={!resendLoading ? handleResend : null}
              style={{ color: theme.button, fontWeight: '600' }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={resendLoading ? 'Sending OTP' : 'Resend OTP'}
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
          accessible={true}
          accessibilityRole="alert"
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.alertBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.alertText, { color: theme.text }]}>{errorMsg}</Text>
              <Pressable
                onPress={() => setShowError(false)}
                style={[styles.alertButton, { backgroundColor: theme.button }]}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Close error message"
              >
                <Text style={{ color: theme.buttonText, fontWeight: '600' }}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal animationType="fade" transparent visible={showSuccess} accessible={true}>
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
