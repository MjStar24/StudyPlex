import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  useColorScheme,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/color';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GOAL_OPTIONS = [
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12', 'IAS / PCS', 'IBPS'
];

const LANGUAGE_OPTIONS = ['English', 'Hindi'];
const STATUS_OPTIONS = ['Ongoing', 'Upcoming'];
const DURATION_OPTIONS = [
  '1-3 Months', '3-6 Months', '6-12 Months', '12+ Months'
];

const DUMMY_BATCHES = [
  {
    id: 'c11-1',
    name: 'Class 11 Physics Full Course',
    goal: 'Class 11',
    mentor: 'Dr. Ravi Shankar',
    price: 4999,
    duration: 12,
    startDate: '15/07/24',
    endDate: '14/07/25',
    language: 'English',
    status: 'Ongoing',
    schedule: 'Mon/Wed/Fri 4-6 PM',
    rating: 4.8,
  },
  {
    id: 'c11-2',
    name: 'Class 11 Maths Crash Course',
    goal: 'Class 11',
    mentor: 'Ms. Neha Gupta',
    price: 2999,
    duration: 6,
    startDate: '01/08/24',
    endDate: '31/01/25',
    language: 'Hindi',
    status: 'Upcoming',
    schedule: 'Tue/Thu 3-5 PM',
    rating: 4.6,
  },
  {
    id: 'ias-1',
    name: 'IAS Prelims GS Complete',
    goal: 'Class 11',
    mentor: 'Mr. Ajay Verma',
    price: 14999,
    duration: 18,
    startDate: '01/06/24',
    endDate: '30/11/25',
    language: 'English',
    status: 'Ongoing',
    schedule: 'Daily 7-9 AM',
    rating: 4.9,
  },
  {
    id: 'ibps-1',
    name: 'IBPS PO Prelims Crash',
    goal: 'Class 11',
    mentor: 'Mr. Rajesh Kumar',
    price: 3999,
    duration: 3,
    startDate: '10/07/24',
    endDate: '10/10/24',
    language: 'Hindi',
    status: 'Upcoming',
    schedule: 'Mon-Fri 8-10 PM',
    rating: 4.5,
  },
  // ...add more as needed
];

function getDurationLabel(months) {
  if (months <= 3) return '1-3 Months';
  if (months <= 6) return '3-6 Months';
  if (months <= 12) return '6-12 Months';
  return '12+ Months';
}

const FILTER_SECTIONS = [
  { key: 'language', label: 'Language', options: LANGUAGE_OPTIONS },
  { key: 'status', label: 'Status', options: STATUS_OPTIONS },
  { key: 'duration', label: 'Duration', options: DURATION_OPTIONS },
];

const BatchesScreen = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    language: [],
    status: [],
    duration: [],
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState(['language']);
  const [batches, setBatches] = useState([]);
  const searchTimeout = useRef();

  // Debounced search for smooth UX
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      let filtered = DUMMY_BATCHES.filter(b => b.goal === user?.goal);
      if (filters.language.length)
        filtered = filtered.filter(b => filters.language.includes(b.language));
      if (filters.status.length)
        filtered = filtered.filter(b => filters.status.includes(b.status));
      if (filters.duration.length)
        filtered = filtered.filter(b => filters.duration.includes(getDurationLabel(b.duration)));
      if (search.trim()) {
        filtered = filtered.filter(
          b =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.mentor.toLowerCase().includes(search.toLowerCase())
        );
      }
      setBatches(filtered);
    }, 200);
    return () => clearTimeout(searchTimeout.current);
  }, [user?.goal, search, filters]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleGoalChange = (goal) => {
    updateUser({ goal });
    setShowGoalModal(false);
  };

  const toggleTempFilter = (key, value) => {
    setTempFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  };

  const clearTempFilters = () => {
    setTempFilters({ language: [], status: [], duration: [] });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilter(false);
  };

  const toggleSection = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const renderOption = (label, active, onPress) => (
    <Pressable
      key={label}
      style={[
        styles.filterOption,
        {
          backgroundColor: active ? theme.button : theme.card,
          borderColor: active ? theme.button : theme.border,
        },
      ]}
      onPress={onPress}
    >
      <Text style={{ color: active ? theme.buttonText : theme.text, fontWeight: '600' }}>{label}</Text>
      {active && <Ionicons name="checkmark" size={16} color={theme.buttonText} style={{ marginLeft: 6 }} />}
    </Pressable>
  );

  const renderBatchItem = ({ item }) => (
    <View
      style={[
        styles.batchCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.button,
        },
      ]}
    >
      <View style={styles.batchHeader}>
        <Ionicons name="school-outline" size={22} color={theme.icon} />
        <Text style={[styles.batchTitle, { color: theme.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'Ongoing' ? '#E0F7FA' : '#FFF3E0' }
        ]}>
          <Text style={{ color: theme.button, fontWeight: '600', fontSize: 12 }}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="person-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Mentor:</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{item.mentor}</Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Start:</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{item.startDate}</Text>
        <Text style={[styles.detailLabel, { color: theme.textSecondary, marginLeft: 12 }]}>End:</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{item.endDate}</Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="language-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Language:</Text>
        <Text style={[styles.detailValue, { color: theme.text }]}>{item.language}</Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="pricetag-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Price:</Text>
        <Text style={[styles.priceText, { color: theme.button }]}>{`\u20B9${item.price}`}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.exploreBtn, { borderColor: theme.button }]}
          onPress={() => router.push(`/batch/${item.id}`)}
        >
          <Text style={[styles.exploreText, { color: theme.button }]}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.enrollBtn, { backgroundColor: theme.button }]}
          onPress={() => router.push(`/enroll/${item.id}`)}
        >
          <Text style={[styles.enrollText, { color: theme.buttonText }]}>Enroll</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.outerContainer}>
        {/* Goal Selector */}
        <Pressable
          style={[styles.goalButton, { backgroundColor: theme.card, borderColor: theme.button }]}
          onPress={() => setShowGoalModal(true)}
        >
          <Ionicons name="flag-outline" size={18} color={theme.button} />
          <Text style={[styles.goalButtonText, { color: theme.button }]}>
            {user?.goal || 'Select Goal'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={theme.button} />
        </Pressable>

        {/* Modal for Goal Change */}
        <Modal
          visible={showGoalModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowGoalModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Change Your Goal</Text>
              {GOAL_OPTIONS.map((goal) => (
                <Pressable
                  key={goal}
                  style={[
                    styles.goalOption,
                    {
                      backgroundColor: user?.goal === goal ? theme.button + '22' : 'transparent',
                    },
                  ]}
                  onPress={() => handleGoalChange(goal)}
                >
                  <Text
                    style={{
                      color: user?.goal === goal ? theme.button : theme.text,
                      fontWeight: user?.goal === goal ? '700' : '500',
                      fontSize: 16,
                    }}
                  >
                    {goal}
                  </Text>
                  {user?.goal === goal && (
                    <Ionicons name="checkmark" size={18} color={theme.button} />
                  )}
                </Pressable>
              ))}
              <Pressable
                onPress={() => setShowGoalModal(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.button }]}
              >
                <Text style={{ color: theme.buttonText, fontWeight: '600' }}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Search & Filter Row */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={20} color={theme.textSecondary} style={{ marginRight: 6 }} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search batches..."
              placeholderTextColor={theme.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <Pressable
            style={[styles.filterBtn, { backgroundColor: theme.card, borderColor: theme.button }]}
            onPress={() => {
              setTempFilters(filters);
              setShowFilter(true);
            }}
          >
            <Ionicons name="options-outline" size={22} color={theme.button} />
            <Text style={{ color: theme.button, fontWeight: '700', marginLeft: 4 }}>Filter</Text>
          </Pressable>
        </View>

        {/* Filter Drawer/Modal */}
        <Modal
          visible={showFilter}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFilter(false)}
        >
          <View style={styles.filterOverlay}>
            <View style={[styles.filterDrawer, { backgroundColor: theme.card }]}>
              <Text style={[styles.filterTitle, { color: theme.text }]}>Filter Batches</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {FILTER_SECTIONS.map(section => (
                  <View key={section.key} style={{ marginBottom: 8 }}>
                    <Pressable
                      style={styles.sectionHeader}
                      onPress={() => toggleSection(section.key)}
                    >
                      <Text style={[styles.filterSection, { color: theme.textSecondary }]}>
                        {section.label}
                      </Text>
                      <Ionicons
                        name={expandedSections.includes(section.key) ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={theme.textSecondary}
                      />
                    </Pressable>
                    {expandedSections.includes(section.key) && (
                      <View style={styles.filterOptionsRow}>
                        {section.options.map(opt =>
                          renderOption(
                            opt,
                            tempFilters[section.key].includes(opt),
                            () => toggleTempFilter(section.key, opt)
                          )
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
              <View style={styles.filterDrawerActions}>
                <Pressable
                  style={[styles.drawerBtn, { backgroundColor: theme.card, borderColor: theme.button }]}
                  onPress={clearTempFilters}
                >
                  <Text style={{ color: theme.button, fontWeight: '700' }}>Clear</Text>
                </Pressable>
                <Pressable
                  style={[styles.drawerBtn, { backgroundColor: theme.button }]}
                  onPress={applyFilters}
                >
                  <Text style={{ color: theme.buttonText, fontWeight: '700' }}>Apply</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Batches List */}
        {loading ? (
          <ActivityIndicator size="large" color={theme.button} style={styles.loader} />
        ) : (
          <FlatList
            data={batches}
            renderItem={renderBatchItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No batches found matching your criteria
              </Text>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingHorizontal: width > 400 ? 24 : 14,
    paddingTop: 14,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1.2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  goalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 3,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000009',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 2,
  },
  batchCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  batchTitle: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 3,
    minWidth: 44,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2,
    flexShrink: 1,
  },
  priceText: {
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  exploreBtn: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1.2,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  enrollBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  exploreText: {
    fontWeight: '700',
    fontSize: 15,
  },
  enrollText: {
    fontWeight: '700',
    fontSize: 15,
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    elevation: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  goalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  modalCloseBtn: {
    marginTop: 18,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: '#00000077',
    justifyContent: 'flex-end',
  },
  filterDrawer: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 22,
    minHeight: 350,
    maxHeight: 0.7 * Dimensions.get('window').height,
    elevation: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  filterSection: {
    fontSize: 15,
    fontWeight: '600',
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    marginTop: 3,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.2,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginBottom: 4,
    marginRight: 4,
  },
  filterDrawerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    marginTop: 18,
  },
  drawerBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.2,
  },
});

export default BatchesScreen