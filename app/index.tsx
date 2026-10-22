import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BentoCard } from '../components/BentoCard';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <View pointerEvents="none" style={styles.orbBlue} />
      <View pointerEvents="none" style={styles.orbSand} />
      <View pointerEvents="none" style={styles.orbLilac} />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.intro}>
            <Text style={styles.title}>Mobile Lab</Text>
            <Text style={styles.subtitle}>Build something your browser cannot.</Text>
          </View>

          <View style={styles.stack}>
            <BentoCard
              large
              kicker="LEVEL"
              sentence="Feel your phone move"
              icon="level"
              onPress={() => router.push('/level')}
            />
            <View style={styles.row}>
              <BentoCard
                kicker="RECEIPTS"
                sentence="Use camera"
                icon="receipt"
                onPress={() => router.push('/receipt-scanner')}
              />
              <BentoCard
                kicker="LIGHTBOX"
                sentence="Control it"
                icon="light"
                onPress={() => router.push('/lights')}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
  },
  safe: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  intro: {
    gap: 8,
    marginBottom: 28,
  },
  title: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: '#5E6470',
    maxWidth: 280,
  },
  stack: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'stretch',
  },
  orbBlue: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#A9C8EE',
    top: -70,
    right: -50,
  },
  orbSand: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#F0CDB8',
    bottom: 40,
    left: -90,
  },
  orbLilac: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#C9D0EA',
    top: 280,
    right: -20,
  },
});
