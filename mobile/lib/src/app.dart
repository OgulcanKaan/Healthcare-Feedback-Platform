import 'package:flutter/material.dart';

import 'core/app_theme.dart';
import 'presentation/screens/login_screen.dart';

class HastaAnketiMobileApp extends StatelessWidget {
  const HastaAnketiMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hasta Anketi Mobile',
      debugShowCheckedModeBanner: false,
      theme: buildAppTheme(),
      home: const LoginScreen(),
    );
  }
}
