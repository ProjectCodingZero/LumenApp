import * as Device from 'expo-device';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';
import { Text } from 'expo-router/build/react-navigation';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function App() {
  const {isAuthenticated, isLoading} = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Superior */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            {/* <MaterialCommunityIcons name="paw" size={24} color="#FFF" /> */}
          </View>
          <View>
            <Text style={styles.headerTitle}>Lumen Vet</Text>
            <Text style={styles.headerSubtitle}>Atención Veterinaria</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          {/* <Ionicons name="notifications" size={20} color="#1A2E3B" /> */}
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Saludo al usuario */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>Hola, Cooper 👋</Text>
            <View style={styles.activeTag}>
              <View style={styles.dotGreen} />
              <Text style={styles.activeTagText}>Tutor Activo</Text>
            </View>
          </View>
          <Text style={styles.greetingSubtext}>
            Cuidando la salud de tus compañeros de vida con excelencia clínica.
          </Text>
        </View>

        {/* Sección: Mis Mascotas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Mascotas <Text style={styles.sectionCount}>(2 registradas)</Text></Text>
          <TouchableOpacity style={styles.filterRow}>
            <Text style={styles.filterText}>Filtrar</Text>
            {/* <Ionicons name="options-outline" size={16} color="#0E6251" /> */}
          </TouchableOpacity>
        </View>

        {/* Carrusel de Mascotas */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsHorizontalScroll}>
          {/* Tarjeta Mascota 1: Max */}
          <View style={[styles.petCardMini, styles.petCardActiveBorder]}>
            <View style={styles.petMiniImgContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200' }}
                style={styles.petMiniImg}
              />
              <View style={styles.petMiniBadge}>
                {/* <MaterialCommunityIcons name="dog" size={12} color="#FFF" /> */}
              </View>
            </View>
            <Text style={styles.petMiniName}>Max <Text style={styles.dotGreenInline}>●</Text></Text>
            <Text style={styles.petMiniBreed} numberOfLines={1}>Labrador Retriever</Text>
            <View style={styles.petStatusPill}>
              <Text style={styles.petStatusPillText}>Activo</Text>
            </View>
          </View>

          {/* Tarjeta Mascota 2: Bella */}
          <View style={styles.petCardMini}>
            <View style={styles.petMiniImgContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200' }}
                style={styles.petMiniImg}
              />
              <View style={[styles.petMiniBadge, { backgroundColor: '#4A5568' }]}>
                {/* <MaterialCommunityIcons name="cat" size={12} color="#FFF" /> */}
              </View>
            </View>
            <Text style={styles.petMiniName}>Bella <Text style={styles.dotOrangeInline}>●</Text></Text>
            <Text style={styles.petMiniBreed} numberOfLines={1}>Siamés</Text>
            <View style={[styles.petStatusPill, styles.bgOrangeLight]}>
              <Text style={[styles.petStatusPillText, styles.textOrange]}>Revisión</Text>
            </View>
          </View>

          {/* Tarjeta Mascota 3: Rocky (Inactivo parcial) */}
          <View style={[styles.petCardMini, styles.cardInactiveOpacity]}>
            <View style={styles.petMiniImgContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200' }}
                style={styles.petMiniImg}
              />
            </View>
            <Text style={styles.petMiniName}>Bulldog</Text>
            <Text style={styles.petMiniBreed}>Inactivo</Text>
          </View>
        </ScrollView>

        {/* Filtros de Categoría */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <TouchableOpacity style={[styles.catChip, styles.catChipActive]}>
            <Text style={[styles.catChipText, styles.catChipTextActive]}>Todas (2)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.catChip}>
            {/*<MaterialCommunityIcons name="dog" size={14} color="#4A5568" style={{ marginRight: 4 }} >*/}
            <Text style={styles.catChipText}>Perros (1)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.catChip}>
            {/*<MaterialCommunityIcons name="cat" size={14} color="#4A5568" style={{ marginRight: 4 }} /> */}
            <Text style={styles.catChipText}>Felinos (1)</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Tarjeta de Información Detallada: Max */}
        <View style={styles.mainCard}>
          <View style={styles.mainCardHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200' }}
              style={styles.mainCardAvatar}
            />
            <View style={styles.mainCardInfo}>
              <View style={styles.rowBetween}>
                <Text style={styles.mainCardName}>Max</Text>
                <View style={styles.healthBadge}>
                  <Text style={styles.healthBadgeText}>● Al día / Saludable</Text>
                </View>
              </View>
              <Text style={styles.mainCardSub}>Perro • Labrador Retriever</Text>
              <View style={styles.metaRow}>
                {/* <Ionicons name="time-outline" size={14} color="#718096" /> */}
                <Text style={styles.metaText}>3 años</Text>
                <Text style={styles.metaDot}>•</Text>
                {/* <Ionicons name="bag-outline" size={14} color="#718096" /> */}
                <Text style={styles.metaText}>Última visita: 12 Sep 2026</Text>
              </View>
            </View>
          </View>

          {/* Alerta / Plan Vigente */}
          <View style={styles.planBanner}>
            <View style={styles.rowCenter}>
              {/* <Ionicons name="shield-checkmark-outline" size={16} color="#0E6251" /> */}
              <Text style={styles.planBannerText}>Plan Integral de Prevención Canina</Text>
            </View>
            <Text style={styles.planVigenteText}>Vigente</Text>
          </View>

          {/* Botones de acción de Max */}
          <View style={styles.cardActionsRow}>
            <TouchableOpacity style={styles.actionBtnSecondary}>
              {/* <Ionicons name="document-text-outline" size={16} color="#1A2E3B" /> */}
              <Text style={styles.actionBtnSecText}>Ver Historial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnPrimary}>
              {/* <Ionicons name="calendar-outline" size={16} color="#FFF" /> */}
              <Text style={styles.actionBtnPriText}>Agendar Turno</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner de Próximo Turno Clínico */}
        <View style={styles.appointmentBanner}>
          <View style={styles.rowBetween}>
            <View style={styles.appoHeaderBadge}>
              {/* <Ionicons name="calendar" size={12} color="#FFF" /> */}
              <Text style={styles.appoHeaderBadgeText}>PRÓXIMO TURNO CLÍNICO</Text>
            </View>
            <Text style={styles.appoDaysText}>En 18 días</Text>
          </View>

          <View style={styles.appoContentRow}>
            <View style={styles.appoIconContainer}>
              {/* <MaterialCommunityIcons name="needle" size={24} color="#FFF" /> */}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.appoTitle}>Vacuna Antirrábica de Max</Text>
              <View style={styles.rowCenter}>
                {/* <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.8)" /> */}
                <Text style={styles.appoDateTime}> 15 de Octubre, 2026 • 10:30 AM</Text>
              </View>
              <Text style={styles.appoLocation}>Sede Central Belgrano</Text>
            </View>
          </View>

          <View style={styles.appoFooterRow}>
            <View style={styles.rowCenter}>
              {/* <Ionicons name="checkmark-circle-outline" size={14} color="#A3E4D7" /> */}
              <Text style={styles.appoConfirmedText}> Confirmado</Text>
            </View>
            <TouchableOpacity style={styles.detailsBtn}>
              <Text style={styles.detailsBtnText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tarjeta de Información Detallada: Bella */}
        <View style={styles.mainCard}>
          <View style={styles.mainCardHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200' }}
              style={styles.mainCardAvatar}
            />
            <View style={styles.mainCardInfo}>
              <View style={styles.rowBetween}>
                <Text style={styles.mainCardName}>Bella</Text>
                <View style={[styles.healthBadge, styles.bgOrangeLight]}>
                  <Text style={[styles.healthBadgeText, { color: '#D68910' }]}>● Próximo control anual</Text>
                </View>
              </View>
              <Text style={styles.mainCardSub}>Gato • Siamés</Text>
              <View style={styles.metaRow}>
                {/* <Ionicons name="time-outline" size={14} color="#718096" /> */}
                <Text style={styles.metaText}>2 años</Text>
                <Text style={styles.metaDot}>•</Text>
                {/* <Ionicons name="bag-outline" size={14} color="#718096" /> */}
                <Text style={styles.metaText}>Última visita: 28 Ago 2026</Text>
              </View>
            </View>
          </View>

          {/* Alerta Sugerencia Bella */}
          <View style={[styles.planBanner, styles.bgOrangeAlert]}>
            <View style={styles.rowCenter}>
              {/* <Ionicons name="notifications-outline" size={16} color="#D68910" /> */}
              <Text style={[styles.planBannerText, { color: '#7E5109' }]}>Desparasitación interna sugerida</Text>
            </View>
            <Text style={[styles.planVigenteText, { color: '#D68910' }]}>Revisión</Text>
          </View>

          <View style={styles.cardActionsRow}>
            <TouchableOpacity style={styles.actionBtnSecondary}>
              {/* <Ionicons name="document-text-outline" size={16} color="#1A2E3B" /> */}
              <Text style={styles.actionBtnSecText}>Ver Historial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnPrimary}>
              {/* <Ionicons name="calendar-outline" size={16} color="#FFF" /> */}
              <Text style={styles.actionBtnPriText}>Agendar Turno</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tarjeta Rocky (Inactivo) */}
        <View style={styles.inactiveCard}>
          <View style={styles.rowCenter}>
            <View style={styles.inactiveAvatarContainer}>
              {/* <FontAwesome5 name="shield-alt" size={18} color="#5DADE2" /> */}
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <View style={styles.rowCenter}>
                <Text style={styles.inactiveName}>Rocky</Text>
                <View style={styles.inactivePill}>
                  <Text style={styles.inactivePillText}>Inactivo</Text>
                </View>
              </View>
              <Text style={styles.inactiveSub}>Perro • Bulldog Francés</Text>
              <Text style={styles.inactiveAlertText}>Control dental pendiente</Text>
            </View>
            {/* <Ionicons name="chevron-forward" size={20} color="#A0AEC0" /> */}
          </View>
        </View>

        {/* Banner de Urgencias 24/7 */}
        <View style={styles.emergencyCard}>
          <View style={styles.rowCenter}>
            <View style={styles.emergencyIconBox}>
              {/* <MaterialCommunityIcons name="phone-in-talk" size={22} color="#0E6251" /> */}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.emergencyTitle}>¿Urgencias 24/7?</Text>
              <Text style={styles.emergencySub}>Comunícate de inmediato con la guardia Lumen Vet.</Text>
            </View>
            <TouchableOpacity style={styles.emergencyBtn}>
              <Text style={styles.emergencyBtnText}>Llamar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Espacio inferior para el Bottom Navigation */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Botón flotante de añadir (+) */}
      <TouchableOpacity style={styles.floatingBtn}>
        {/* <Ionicons name="add" size={28} color="#FFF" /> */}
      </TouchableOpacity>

      {/* Barra de Navegación Inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          {/* <MaterialCommunityIcons name="paw" size={22} color="#1ABC9C" /> */}
          <Text style={[styles.navText, styles.navTextActive]}>Mascotas</Text>
          <View style={styles.navDotActive} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          {/* <Ionicons name="calendar-outline" size={22} color="#839192" /> */}
          <Text style={styles.navText}>Turnos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          {/* <Ionicons name="medkit-outline" size={22} color="#839192" /> */}
          <Text style={styles.navText}>Especialistas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          {/* <Ionicons name="person-outline" size={22} color="#839192" /> */}
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#0E6251',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2E3B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#718096',
  },
  notificationBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#EDF2F7',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    width: 8,
    height: 8,
    backgroundColor: '#E74C3C',
    borderRadius: 4,
    position: 'absolute',
    top: 8,
    right: 9,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  greetingSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A2E3B',
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAFAF1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27AE60',
    marginRight: 6,
  },
  activeTagText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
  },
  greetingSubtext: {
    fontSize: 13,
    color: '#718096',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2E3B',
  },
  sectionCount: {
    fontWeight: 'normal',
    color: '#718096',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 13,
    color: '#0E6251',
    fontWeight: '600',
    marginRight: 4,
  },
  petsHorizontalScroll: {
    marginBottom: 12,
  },
  petCardMini: {
    width: 100,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  petCardActiveBorder: {
    borderColor: '#0E6251',
    borderWidth: 1.5,
  },
  petMiniImgContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  petMiniImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  petMiniBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0E6251',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  petMiniName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A2E3B',
  },
  petMiniBreed: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 6,
  },
  petStatusPill: {
    backgroundColor: '#EAFAF1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  petStatusPillText: {
    fontSize: 10,
    color: '#27AE60',
    fontWeight: 'bold',
  },
  dotGreenInline: {
    color: '#27AE60',
    fontSize: 10,
  },
  dotOrangeInline: {
    color: '#F39C12',
    fontSize: 10,
  },
  bgOrangeLight: {
    backgroundColor: '#FEF9E7',
  },
  textOrange: {
    color: '#D68910',
  },
  cardInactiveOpacity: {
    opacity: 0.7,
    borderStyle: 'dashed',
  },
  categoryScroll: {
    marginBottom: 16,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: '#0E6251',
  },
  catChipText: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '600',
  },
  catChipTextActive: {
    color: '#FFF',
  },
  mainCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mainCardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  mainCardInfo: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2E3B',
  },
  healthBadge: {
    backgroundColor: '#EAFAF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  healthBadgeText: {
    fontSize: 11,
    color: '#27AE60',
    fontWeight: '600',
  },
  mainCardSub: {
    fontSize: 12,
    color: '#4A5568',
    marginTop: 2,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    color: '#718096',
    marginLeft: 4,
  },
  metaDot: {
    marginHorizontal: 6,
    color: '#A0AEC0',
    fontSize: 10,
  },
  planBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EAFAF1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  bgOrangeAlert: {
    backgroundColor: '#FEF9E7',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planBannerText: {
    fontSize: 12,
    color: '#0E6251',
    fontWeight: '600',
    marginLeft: 6,
  },
  planVigenteText: {
    fontSize: 12,
    color: '#0E6251',
    fontWeight: 'bold',
  },
  cardActionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EDF2F7',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  actionBtnSecText: {
    fontSize: 13,
    color: '#1A2E3B',
    fontWeight: '600',
    marginLeft: 6,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0E6251',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  actionBtnPriText: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  appointmentBanner: {
    backgroundColor: '#0E6251',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  appoHeaderBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
  },
  appoHeaderBadgeText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  appoDaysText: {
    fontSize: 12,
    color: '#A3E4D7',
    fontWeight: '600',
  },
  appoContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  appoIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  appoDateTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  appoLocation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  appoFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 10,
  },
  appoConfirmedText: {
    fontSize: 12,
    color: '#A3E4D7',
    fontWeight: '600',
  },
  detailsBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailsBtnText: {
    fontSize: 12,
    color: '#0E6251',
    fontWeight: 'bold',
  },
  inactiveCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inactiveAvatarContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EBF5FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A2E3B',
  },
  inactivePill: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  inactivePillText: {
    fontSize: 10,
    color: '#718096',
    fontWeight: 'bold',
  },
  inactiveSub: {
    fontSize: 12,
    color: '#718096',
    marginTop: 1,
  },
  inactiveAlertText: {
    fontSize: 12,
    color: '#D68910',
    fontWeight: '600',
    marginTop: 2,
  },
  emergencyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emergencyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAFAF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A2E3B',
  },
  emergencySub: {
    fontSize: 11,
    color: '#718096',
    marginTop: 1,
  },
  emergencyBtn: {
    backgroundColor: '#FADBD8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emergencyBtnText: {
    fontSize: 12,
    color: '#C0392B',
    fontWeight: 'bold',
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0E6251',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#1A2E3B',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2C3E50',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 10,
    color: '#839192',
    marginTop: 3,
  },
  navTextActive: {
    color: '#1ABC9C',
    fontWeight: '600',
  },
  navDotActive: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1ABC9C',
    position: 'absolute',
    bottom: 4,
  },
});