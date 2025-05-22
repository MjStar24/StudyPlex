import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Modal,
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/color';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemeView';
import axios from 'axios';
import { SERVER_URL } from '@env';
import { useSelector, useDispatch } from 'react-redux';
import { setOtp } from '../../store/authSlice';

const PhoneLoginScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.dark;
  const router = useRouter();
  const dispatch = useDispatch();


  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [showOtpError, setShowOtpError] = React.useState(false);
  const [otpErrorMsg, setOtpErrorMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleContinue = async () => {
    if (phoneNumber.length === 10) {
      setLoading(true);
      try {
        const formattedPhone = '+91' + phoneNumber;
        const response = await axios.post(`${SERVER_URL}/auth/api/send-otp`, {
          phone: formattedPhone,
        });

        const { hash } = response.data;


        dispatch(setOtp({ phone: formattedPhone, hash }));


        router.push('/verify');
      } catch (err) {
        console.log(' Error in OTP request:', err);
        setOtpErrorMsg(
          err.response?.data?.message ||
          'OTP bhejne me kuch problem aayi. Kripya thodi der baad try karein.'
        );
        setShowOtpError(true);
      } finally {
        setLoading(false);
      }
    } else {
      setShowAlert(true);
    }
  };

  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ThemedView style={styles.container}>
        <Pressable onPress={() => router.replace('/onboarding')} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>

        <Text style={[styles.title, { color: theme.text }]}>Continue with Phone</Text>

        <Image
          source={require('../../assets/images/OnboardingImg2.png')}
          style={styles.image}
        />

        <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Welcome</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter your phone number"
              placeholderTextColor={theme.textSecondary}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              maxLength={10}
            />

            <Pressable
              onPress={handleContinue}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? theme.primaryPressed : theme.button,
                },
                styles.continueButton,
              ]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.buttonText} />
              ) : (
                <Text style={[styles.continueText, { color: theme.buttonText }]}>
                  Continue
                </Text>
              )}
            </Pressable>
          </View>
        </View>

       {/* 🔔 Modal: Invalid Phone Number */}
        <Modal animationType="fade" transparent visible={showAlert} onRequestClose={() => setShowAlert(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.alertBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.alertText, { color: theme.text }]}>
                Please enter a valid 10-digit phone number.
              </Text>
              <Pressable
                onPress={() => setShowAlert(false)}
                style={[styles.alertButton, { backgroundColor: theme.button }]}
              >
                <Text style={{ color: theme.buttonText, fontWeight: '600' }}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* 🔔 Modal: OTP Send Error */}
        <Modal animationType="fade" transparent visible={showOtpError} onRequestClose={() => setShowOtpError(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.alertBox, { backgroundColor: theme.card }]}>
              <Text style={[styles.alertText, { color: theme.text }]}>{otpErrorMsg}</Text>
              <Pressable
                onPress={() => setShowOtpError(false)}
                style={[styles.alertButton, { backgroundColor: theme.button }]}
              >
                <Text style={{ color: theme.buttonText, fontWeight: '600' }}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 20,
  },
  formContainer: {
    borderRadius: 20,
    padding: 16,
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000020',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  continueButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  continueText: {
    fontWeight: '600',
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
