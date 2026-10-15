import { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Briefcase, FileText, Mic, Sparkles } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { GradientButton } from '@/components/buttons/GradientButton';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { ONBOARDING_SLIDES } from '@/constants';
import { colors, layout, typography } from '@/theme';

const iconMap = {
  mic: Mic,
  briefcase: Briefcase,
  'file-text': FileText,
  sparkles: Sparkles,
};

const ICON_BOX = 128;
const ICON_SIZE = 56;

type Props = {
  onComplete: () => void;
};

export function OnboardingScreen({ onComplete }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<(typeof ONBOARDING_SLIDES)[number]>>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    setIndex(i);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setIndex(viewableItems[0].index);
      }
    },
  ).current;

  const next = () => {
    if (index < ONBOARDING_SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      onComplete();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={[typography.label, styles.brand]}>Lumio AI</Text>
        </View>

        <FlatList
          ref={listRef}
          data={[...ONBOARDING_SLIDES]}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          keyExtractor={(item) => String(item.id)}
          style={styles.carousel}
          getItemLayout={(_, i) => ({
            length: screenWidth,
            offset: screenWidth * i,
            index: i,
          })}
          renderItem={({ item }) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Mic;
            return (
              <View style={[styles.slide, { width: screenWidth }]}>
                <View style={styles.slideInner}>
                  <LinearGradient
                    colors={[`${colors.primary}20`, `${colors.secondaryLight}10`]}
                    style={styles.iconBox}
                  >
                    <Icon size={ICON_SIZE} color={colors.primary} />
                  </LinearGradient>

                  <Animated.Text
                    entering={FadeInUp.duration(500)}
                    style={[typography.largeHeading, styles.title]}
                  >
                    {item.title}
                  </Animated.Text>

                  <Text style={[typography.body, styles.subtitle]}>{item.subtitle}</Text>
                </View>
              </View>
            );
          }}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {ONBOARDING_SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
          </View>

          {index === ONBOARDING_SLIDES.length - 1 ? (
            <GradientButton label="Get Started" onPress={onComplete} />
          ) : (
            <PrimaryButton label="Continue" onPress={next} />
          )}

          {index < ONBOARDING_SLIDES.length - 1 && (
            <Text style={[typography.label, styles.skip]} onPress={onComplete}>
              Skip
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  root: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  brand: {
    color: colors.primary,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideInner: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: layout.screenPaddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    width: '100%',
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    width: '100%',
  },
  footer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 16,
    paddingTop: 8,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 32,
    backgroundColor: colors.primary,
  },
  skip: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
