import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Modal,
} from 'react-native';
import { Colors } from '../../constants/color.js';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from '../../components/ThemeView';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const UserDetailsScreen = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const router = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.light;

  
  const { updateUser } = useAuth();
  const handleContinue = () => {
    if (step === 1) {
      if (name.trim() === '') {
        setModalMessage('Please enter your name');
        setModalVisible(true);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedClass && !selectedExam) {
        setModalMessage('Please select your goal');
        setModalVisible(true);
        return;
      }
      console.log('User Details:', {
        name,
        goal: selectedClass || selectedExam,
      });
      updateUser({ 
        name, 
        goal: selectedClass || selectedExam // ✅ Fix here
      });
      router.replace('/home');
    }
  };

  const renderGoalOptions = () => {
    if (selectedGoal === 'class') {
      return (
        <>
          <Text style={[styles.sectionLabel, { color: theme.text, marginTop: 20 }]}>Select Class</Text>
          <View style={styles.grid}>
            {[...Array(7)].map((_, i) => {
              const classVal = `${i + 6}`;
              return (
                <TouchableOpacity
                  key={classVal}
                  style={[
                    styles.optionBox,
                    {
                      backgroundColor: selectedClass === classVal ? theme.button : theme.card,
                      borderColor: selectedClass === classVal ? theme.button : theme.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedClass(classVal);
                    setSelectedExam('');
                  }}
                >
                  <Text style={{
                    color: selectedClass === classVal ? theme.buttonText : theme.text,
                    fontWeight: '500',
                  }}>
                    Class {classVal}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      );
    }

    if (selectedGoal === 'exam') {
      return (
        <>
          <Text style={[styles.sectionLabel, { color: theme.text, marginTop: 20 }]}>Select Exam</Text>
          <View style={styles.grid}>
            {['IAS / PCS', 'IBPS'].map((exam) => (
              <TouchableOpacity
                key={exam}
                style={[
                  styles.optionBox,
                  {
                    backgroundColor: selectedExam === exam ? theme.button : theme.card,
                    borderColor: selectedExam === exam ? theme.button : theme.border,
                  },
                ]}
                onPress={() => {
                  setSelectedExam(exam);
                  setSelectedClass('');
                }}
              >
                <Text style={{
                  color: selectedExam === exam ? theme.buttonText : theme.text,
                  fontWeight: '500',
                }}>
                  {exam}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      );
    }

    return null;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>Step {step} of 2</Text>
        <Text style={[styles.title, { color: theme.text }]}>
          {step === 1 ? 'Enter your name' : 'Select your goal'}
        </Text>

        {step === 1 ? (
          <View style={styles.step1Container}>
            <TextInput
              placeholder="Your full name"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.text },
              ]}
              value={name}
              onChangeText={setName}
            />
          </View>
        ) : (
          <View style={styles.step2Container}>
            <View style={styles.grid}>
              <TouchableOpacity
                style={[
                  styles.optionBox,
                  {
                    backgroundColor: selectedGoal === 'class' ? theme.button : theme.card,
                    borderColor: selectedGoal === 'class' ? theme.button : theme.border,
                  },
                ]}
                onPress={() => {
                  setSelectedGoal('class');
                  setSelectedClass('');
                  setSelectedExam('');
                }}
              >
                <Text style={{
                  color: selectedGoal === 'class' ? theme.buttonText : theme.text,
                  fontWeight: '500',
                }}>
                  CBSE Course
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionBox,
                  {
                    backgroundColor: selectedGoal === 'exam' ? theme.button : theme.card,
                    borderColor: selectedGoal === 'exam' ? theme.button : theme.border,
                  },
                ]}
                onPress={() => {
                  setSelectedGoal('exam');
                  setSelectedExam('');
                  setSelectedClass('');
                }}
              >
                <Text style={{
                  color: selectedGoal === 'exam' ? theme.buttonText : theme.text,
                  fontWeight: '500',
                }}>
                  Competitive Exams
                </Text>
              </TouchableOpacity>
            </View>

            {renderGoalOptions()}
          </View>
        )}

        <TouchableOpacity
          onPress={handleContinue}
          style={[
            styles.continueBtn,
            { backgroundColor: theme.button, marginTop: 40 },
          ]}
        >
          <Text style={[styles.continueText, { color: theme.buttonText }]}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL ALERT */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Validation Error</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>{modalMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: theme.button }]}
            >
              <Text style={{ color: theme.buttonText, fontWeight: '600' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backBtn: {
    position: 'absolute',
    top: 30,
    left: 16,
    padding: 6,
    zIndex: 10,
  },
  stepLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  step1Container: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  step2Container: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  optionBox: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  continueBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  continueText: {
    fontSize: 17,
    fontWeight: '700',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalBox: {
    width: '80%',
    padding: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
