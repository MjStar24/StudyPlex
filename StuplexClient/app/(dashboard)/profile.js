import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  useColorScheme,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext.js';
import { Colors } from '../../constants/color.js';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] || Colors.light;
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city || '');
  const [state, setState] = useState(user.state || '');

  const handleSave = () => {
    updateUser({ name, city, state });
    setEditModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.heading, { color: theme.text }]}>My Profile</Text>
          <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
            <Ionicons name="settings-outline" size={24} color={theme.icon || theme.button} />
          </Pressable>
        </View>

        {/* My Details */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>My Details</Text>
            <Pressable onPress={() => setEditModalVisible(true)} hitSlop={8} style={styles.editIcon}>
              <Ionicons name="pencil" size={15} color={theme.buttonText} />
            </Pressable>
          </View>
          <DetailRow icon="person-outline" label="Name" value={user.name} theme={theme} />
          <DetailRow icon="call-outline" label="Phone" value={user.phone} theme={theme} />
          <DetailRow icon="ribbon-outline" label="Goal" value={user.goal} theme={theme} />
        </View>

        {/* Other Details */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border, marginTop: 20 }]}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>Other Details</Text>
          <DetailRow icon="location-outline" label="City" value={user.city || 'Not set'} theme={theme} />
          <DetailRow icon="navigate-outline" label="State" value={user.state || 'Not set'} theme={theme} />
        </View>

        {/* About & Contact */}
        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <LinkRow
            icon="information-circle-outline"
            text="About Us"
            onPress={() => router.push('/about')}
            theme={theme}
          />
          <LinkRow
            icon="call-outline"
            text="Contact Us"
            onPress={() => router.push('/contact')}
            theme={theme}
          />
        </View>

        {/* Theme Toggle */}
        <View style={[styles.section, styles.themeToggle, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.themeRow}>
            <Ionicons name="moon-outline" size={18} color={theme.icon || theme.button} />
            <Text style={[styles.sectionTitle, { color: theme.text, marginLeft: 8 }]}>Dark Theme</Text>
          </View>
          <Switch
            value={colorScheme === 'dark'}
            onValueChange={() => {}}
            thumbColor={theme.button}
            trackColor={{ false: theme.border, true: theme.button }}
          />
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutRow,
            {
              backgroundColor: pressed ? (theme.card + '22') : 'transparent',
              borderColor: theme.card,
            }
          ]}
          onPress={() => router.replace('/login')}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.icon} />
          <Text style={[styles.logoutText, { color: theme.text }]}>Logout</Text>
        </Pressable>

        {/* Edit Modal */}
        <Modal visible={editModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
              <TextInput
                placeholder="Enter Name"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
              />
              <TextInput
                placeholder="Enter City"
                placeholderTextColor={theme.textSecondary}
                value={city}
                onChangeText={setCity}
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
              />
              <TextInput
                placeholder="Enter State"
                placeholderTextColor={theme.textSecondary}
                value={state}
                onChangeText={setState}
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
              />

              {/* Cancel and Save buttons */}
              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setEditModalVisible(false)}
                  style={[styles.modalButton, { borderColor: theme.border }]}
                >
                  <Text style={[styles.modalButtonText, { color: theme.text }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  style={[styles.modalButton, { backgroundColor: theme.button }]}
                >
                  <Text style={[styles.modalButtonText, { color: theme.buttonText }]}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

// Detail row with icon
const DetailRow = ({ icon, label, value, theme }) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={17} color={theme.icon || theme.button} style={{ marginRight: 8 }} />
    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}:</Text>
    <Text style={[styles.detailValue, { color: theme.text }]} numberOfLines={1}>{value}</Text>
  </View>
);

// Link row with icon
const LinkRow = ({ icon, text, onPress, theme }) => (
  <Pressable style={styles.linkRow} onPress={onPress} hitSlop={10}>
    <Ionicons name={icon} size={18} color={theme.icon || theme.button} style={styles.iconLeft} />
    <Text style={[styles.linkText, { color: theme.text }]}>{text}</Text>
    <Ionicons name="chevron-forward" size={15} color={theme.textSecondary} style={{ marginLeft: "auto" }} />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  section: {
    padding: 18,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  editIcon: {
    backgroundColor: "#3D5CFF",
    padding: 6,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
    paddingHorizontal: 4,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 55,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 'auto',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconLeft: {
    marginRight: 10,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '500',
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000077',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    borderRadius: 14,
    padding: 20,
    elevation: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginVertical: 6,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Profile;
