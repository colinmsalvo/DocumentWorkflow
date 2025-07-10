import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsScreen() {
  const handleFeaturePress = (feature) => {
    Alert.alert('Feature Coming Soon', `${feature} will be available in the next update.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="analytics-outline" size={64} color="#ccc" />
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>
          Generate and view project reports and analytics
        </Text>
        
        <TouchableOpacity
          style={styles.featureButton}
          onPress={() => handleFeaturePress('Reports and analytics')}
        >
          <Text style={styles.featureText}>Coming Soon</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  featureButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});