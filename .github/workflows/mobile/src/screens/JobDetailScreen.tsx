import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';

export default function JobDetailScreen({ route, navigation }) {
  const { jobId } = route.params;

  const { data: job, isLoading } = useQuery({
    queryKey: ['/api/jobs', jobId],
    queryFn: () => apiRequest(`/api/jobs/${jobId}`),
  });

  const { data: elements } = useQuery({
    queryKey: ['/api/elements/by-job', jobId],
    queryFn: () => apiRequest(`/api/elements/by-job/${jobId}`),
  });

  const handleElementPress = (element) => {
    navigation.navigate('ElementDetail', { elementId: element.id });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete': return '#059669';
      case 'in_progress': return '#d97706';
      case 'not_started': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase?.toLowerCase()) {
      case 'drawing': return '#2563eb';
      case 'production': return '#d97706';
      case 'delivery': return '#7c3aed';
      case 'install': return '#059669';
      default: return '#6b7280';
    }
  };

  if (isLoading || !job) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading job details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Job Header */}
      <View style={styles.header}>
        <Text style={styles.jobName}>{job.name}</Text>
        <Text style={styles.projectNumber}>Project #{job.projectNumber}</Text>
        
        <View style={styles.jobInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.infoText}>{job.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="person" size={16} color="#666" />
            <Text style={styles.infoText}>{job.clientName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.infoText}>
              Started: {new Date(job.startDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Ionicons name="qr-code" size={24} color="#dc2626" />
            <Text style={styles.actionText}>Scan QR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Feature Coming Soon', 'This feature will be available in the next update.')}
          >
            <Ionicons name="document-text" size={24} color="#2563eb" />
            <Text style={styles.actionText}>Daily Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Feature Coming Soon', 'This feature will be available in the next update.')}
          >
            <Ionicons name="camera" size={24} color="#059669" />
            <Text style={styles.actionText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Elements List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Elements ({elements?.length || 0})</Text>
        
        {elements && elements.length > 0 ? (
          elements.map((elementData, index) => {
            // Handle JOIN structure from API
            const element = elementData.elements || elementData;
            const level = elementData.levels;
            const building = elementData.buildings;
            
            return (
              <TouchableOpacity
                key={element.id}
                style={styles.elementCard}
                onPress={() => handleElementPress(element)}
              >
                <View style={styles.elementHeader}>
                  <Text style={styles.elementId}>{element.elementId}</Text>
                  <View style={styles.statusBadges}>
                    <View style={[styles.phaseBadge, { backgroundColor: getPhaseColor(element.primaryStatus) }]}>
                      <Text style={styles.badgeText}>{element.primaryStatus}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(element.secondaryStatus) }]}>
                      <Text style={styles.badgeText}>{element.secondaryStatus}</Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.elementName}>{element.name}</Text>
                
                {(building || level) && (
                  <Text style={styles.elementLocation}>
                    {building?.name} - {level?.name}
                  </Text>
                )}
                
                <View style={styles.elementFooter}>
                  <Text style={styles.elementType}>{element.type}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No elements found</Text>
          </View>
        )}
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
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  jobName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  projectNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  jobInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    fontWeight: '500',
  },
  elementCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  elementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  elementId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadges: {
    flexDirection: 'row',
    gap: 5,
  },
  phaseBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  elementName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  elementLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  elementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  elementType: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});