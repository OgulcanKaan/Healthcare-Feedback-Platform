import 'package:flutter/material.dart';

ThemeData buildAppTheme() {
  const brand = Color(0xFF1AA9CD);
  const mint = Color(0xFF5DD6C8);
  const dark = Color(0xFF20384B);

  final scheme = ColorScheme.fromSeed(
    seedColor: brand,
    primary: brand,
    secondary: mint,
    surface: Colors.white,
  );

  return ThemeData(
    colorScheme: scheme,
    scaffoldBackgroundColor: const Color(0xFFF5FBFF),
    useMaterial3: true,
    textTheme: const TextTheme(
      headlineLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: dark),
      headlineMedium: TextStyle(fontSize: 26, fontWeight: FontWeight.w700, color: dark),
      titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: dark),
      bodyLarge: TextStyle(fontSize: 18, color: dark),
      bodyMedium: TextStyle(fontSize: 15, color: dark),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white.withValues(alpha: 0.84),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(22),
        borderSide: BorderSide(color: brand.withValues(alpha: 0.12)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(22),
        borderSide: BorderSide(color: brand.withValues(alpha: 0.12)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(22),
        borderSide: const BorderSide(color: brand, width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
    ),
  );
}
