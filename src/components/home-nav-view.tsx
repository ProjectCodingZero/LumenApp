import { Theme } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HomeNavViewProps {
    theme: Theme;
}
export function HomeNavView({ theme }: HomeNavViewProps) {
  const styles = getStyles(theme);
  return (
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="paw" size={22} color="#1ABC9C" />
          <Text style={[styles.navText, styles.navTextActive]}>Mascotas</Text>
          <View style={styles.navDotActive} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="calendar" size={22} color="#839192" />
          <Text style={styles.navText}>Turnos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="doctor" size={22} color="#839192" />
          <Text style={styles.navText}>Especialistas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="account" size={22} color="#839192" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
  );
}

const getStyles = (theme: Theme) => StyleSheet.create({
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 60,
        backgroundColor: theme.background || theme.surface
    },
    navItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    navText: {
        fontSize: 12,
        color: theme.textSecondary,
    },
    navTextActive: {
        color: theme.primary,
    },
    navDotActive: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.primary,
        marginTop: 2,
    },
});