import { Theme } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ResponseMedicalRecord } from '@/types/medicalRecordTypes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/** Lista de entradas de historia clínica (GET /api/pets/{id}/medical-records) */
export function MedicalRecordList({ records }: { records: ResponseMedicalRecord[] }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (records.length === 0) {
    return (
      <View style={styles.empty}>
        <MaterialCommunityIcons name="folder-open-outline" size={32} color={theme.inactive} />
        <Text style={styles.emptyTitle}>Sin historia clínica registrada</Text>
        <Text style={styles.emptyText}>Las consultas y estudios aparecerán aquí.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {records.map((record) => (
        <View key={record.id} style={styles.item}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={18} color={theme.primary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {record.title}
            </Text>
            <Text style={styles.metrics}>
              {record.temperature} °C • {record.weight} kg
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      gap: 10,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    info: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    metrics: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    empty: {
      alignItems: 'center',
      paddingVertical: 20,
      backgroundColor: theme.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    emptyTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: 8,
    },
    emptyText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
  });
