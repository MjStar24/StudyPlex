import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Modal,
} from "react-native";
import { Colors } from "../../constants/color.js";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemeView";
import { useRouter } from "expo-router";
import { useDispatch,useSelector } from "react-redux";
import { setUserDetails } from "../../store/activateSlice";
import { SERVER_URL } from "@env";
import axios from "axios";

const UserDetailsScreen = () => {
  const [step, setStep] = useState(1);
  const [name, setNameLocal] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [board, setBoard] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.light;

const token = useSelector((state) => state.auth.token);

  const handleContinue = () => {
    if (step === 1) {
      if (!name.trim() || !email.trim()) {
        setModalMessage("Please enter both name and email");
        setModalVisible(true);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!city || !state || !board || !selectedExam || !selectedClass) {
        setModalMessage("Please fill all the fields");
        setModalVisible(true);
        return;
      }

      const userPayload = {
        name,
        email,
        city,
        state,
        board,
        exam: selectedExam,
        Class: selectedClass,
        role: "student",
      };

      dispatch(setUserDetails(userPayload));

      console.log("User Details:", {
        name,
        email,
        city,
        state,
        board,
        exam: selectedExam,
        Class: selectedClass,
        role: "student",
      });

      console.log('Sending activation request with token:', token);

      

      axios
        .post(`${SERVER_URL}/activate/api/activate-user`, userPayload,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
        .then((response) => {
          console.log("Activation response:", response.data);
          router.replace("/home"); 
        })
        .catch((error) => {
          if (error.response) {
            console.error("Error response:", error.response.data); 
          }
          console.error("Activation error:", error);
          setModalMessage(
            error.response?.data?.message ||
              "Failed to submit details. Please try again."
          );
          setModalVisible(true); 
        });

      router.replace("/home");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.stepLabel, { color: theme.textSecondary }]}>
          Step {step} of 2
        </Text>
        <Text style={[styles.title, { color: theme.text }]}>
          {step === 1 ? "Enter your basic details" : "Additional Information"}
        </Text>

        {step === 1 ? (
          <View style={styles.step1Container}>
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.text },
              ]}
              value={name}
              onChangeText={setNameLocal}
            />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.text, marginTop: 16 },
              ]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        ) : (
          <View style={styles.step2Container}>
            <TextInput
              placeholder="City"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.text },
              ]}
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              placeholder="State"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.text, marginTop: 12 },
              ]}
              value={state}
              onChangeText={setState}
            />
            <TextInput
              placeholder="Board"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                { borderColor: theme.border, color: theme.text, marginTop: 12 },
              ]}
              value={board}
              onChangeText={setBoard}
            />

            <Text
              style={[
                styles.sectionLabel,
                { color: theme.text, marginTop: 20 },
              ]}
            >
              Select Class
            </Text>
            <View style={styles.grid}>
              {[...Array(7)].map((_, i) => {
                const classVal = `${i + 6}`;
                return (
                  <TouchableOpacity
                    key={classVal}
                    style={[
                      styles.optionBox,
                      {
                        backgroundColor:
                          selectedClass === classVal
                            ? theme.button
                            : theme.card,
                        borderColor:
                          selectedClass === classVal
                            ? theme.button
                            : theme.border,
                      },
                    ]}
                    onPress={() => setSelectedClass(classVal)}
                  >
                    <Text
                      style={{
                        color:
                          selectedClass === classVal
                            ? theme.buttonText
                            : theme.text,
                      }}
                    >
                      Class {classVal}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={[
                styles.sectionLabel,
                { color: theme.text, marginTop: 20 },
              ]}
            >
              Select Exam
            </Text>
            <View style={styles.grid}>
              {["JEE", "NEET"].map((exam) => (
                <TouchableOpacity
                  key={exam}
                  style={[
                    styles.optionBox,
                    {
                      backgroundColor:
                        selectedExam === exam ? theme.button : theme.card,
                      borderColor:
                        selectedExam === exam ? theme.button : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedExam(exam)}
                >
                  <Text
                    style={{
                      color:
                        selectedExam === exam ? theme.buttonText : theme.text,
                    }}
                  >
                    {exam}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={handleContinue}
          style={[
            styles.continueBtn,
            { backgroundColor: theme.button, marginTop: 40 },
          ]}
        >
          <Text style={[styles.continueText, { color: theme.buttonText }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Validation Error
            </Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
              {modalMessage}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: theme.button }]}
            >
              <Text style={{ color: theme.buttonText, fontWeight: "600" }}>
                OK
              </Text>
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
    position: "absolute",
    top: 30,
    left: 16,
    padding: 6,
    zIndex: 10,
  },
  stepLabel: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  step1Container: {
    marginTop: 20,
  },
  step2Container: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionBox: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    width: "48%",
    alignItems: "center",
  },
  continueBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 3,
  },
  continueText: {
    fontSize: 17,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    width: "80%",
    padding: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
