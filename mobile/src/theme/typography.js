export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
};

export const type = {
  h1: { fontFamily: fonts.extraBold, fontSize: 30, lineHeight: 38 },
  h2: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 30 },
  h3: { fontFamily: fonts.semiBold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17 },
  tiny: { fontFamily: fonts.medium, fontSize: 10, lineHeight: 14 },
};
