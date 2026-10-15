import { FadeIn, FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';

export const fadeIn = FadeIn.duration(400);
export const fadeInUp = FadeInUp.duration(500).springify();
export const fadeInDown = FadeInDown.duration(500).springify();
export const slideInRight = SlideInRight.duration(400);
