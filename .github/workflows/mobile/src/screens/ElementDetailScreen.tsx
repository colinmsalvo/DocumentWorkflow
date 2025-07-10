import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { mobileApi } from '../lib/api';

export default function ElementDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { elementId, element: initialElement } = route.params;
  
  const [element, setElement] = useState(initialElement || null);
  const [loading, setLoading] = useState(!initialElement);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!initialElement) {
      loadElement();
    } else {
      setStatus(initialElement.status || 'not_started');
      setNotes(initialElement.notes || '');
    }
  }, [elementId, initialElement]);

  const loadElement = async () => {
    try {
      setLoading(true);
      const elementData = await mobileApi.getElement(elementId);
      setElement(elementData);
      setStatus(elementData.status || 'not_started');
      setNotes(elementData.notes || '');
    } catch (error) {
      console.error('Failed to load element:', error);
      Alert.alert('Error', 'Failed to load element details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const updateElement = async () => {
    try {
      setUpdating(true);
      const updates = {
        status,
        notes,
        lastModified: new Date().toISOString(),
      };
      
      const updatedElement = await mobileApi.updateElement(elementId, updates);
      setElement(updatedElement);
      
      Alert.alert('Success', 'Element updated successfully');
    } catch (error) {
      console.error('Failed to update element:', error);
      Alert.alert('Error', 'Failed to update element');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete': return '#059669';
      case 'in_progress': return '#d97706';
      case 'not_started': return '#6b7280';
      case 'on_hold': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete': return 'Complete';
      case 'in_progress': return 'In Progress';
      case 'not_started': return 'Not Started';
      case 'on_hold': return 'On Hold';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading element...</Text>
      </View>
    );
  }

  if (!element) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#dc2626" />
        <Text style={styles.errorText}>Element not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#dc2626" />
        </TouchableOpacity>
        <Text style={styles.title}>Element Details</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.elementInfo}>
          <Text style={styles.elementId}>{element.elementId || element.id}</Text>
          <Text style={styles.elementName}>{element.name}</Text>
          <Text style={styles.elementType}>{element.elementType}</Text>
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            {['not_started', 'in_progress', 'complete', 'on_hold'].map((statusOption) => (
              <TouchableOpacity
                key={statusOption}
                style={[
                  styles.statusOption,
                  status === statusOption && { backgroundColor: getStatusColor(statusOption) }
                ]}
                onPress={() => setStatus(statusOption)}
              >
                <Text style={[
                  styles.statusOptionText,
                  status === statusOption && { color: '#fff' }
                ]}>
                  {getStatusLabel(statusOption)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this element..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.elementDetails}>
          <Text style={styles.sectionTitle}>Element Information</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{element.elementType || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dimensions:</Text>
            <Text style={styles.detailValue}>
              {element.length && element.width && element.height 
                ? `${element.length} × ${element.width} × ${element.height}mm`
                : 'Not specified'
              }
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Status:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(element.status) }]}>
              <Text style={styles.statusBadgeText}>{getStatusLabel(element.status)}</Text>
            </View>
          </View>
          
          {element.assignedTo && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assigned To:</Text>
              <Text style={styles.detailValue}>{element.assignedTo}</Text>
            </View>
          )}
          
          {element.lastModified && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Modified:</Text>
              <Text style={styles.detailValue}>
                {new Date(element.lastModified).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.updateButton, updating && styles.updatingButton]}
          onPress={updateElement}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Update Element</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    padding: 16,
  },
  elementInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  elementId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  elementName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  elementType: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  statusSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  notesSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#f9fafb',
  },
  elementDetails: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  updateButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  updatingButton: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});