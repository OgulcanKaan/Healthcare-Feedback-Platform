import 'package:flutter/material.dart';

import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../widgets/screen_background.dart';
import 'survey_selection_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController(text: 'admin');
  final _passwordController = TextEditingController(text: '123456');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ScreenBackground(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 460),
              child: GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 68,
                          height: 68,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: LinearGradient(
                              colors: [Color(0xFF1AA9CD), Color(0xFF5DD6C8)],
                            ),
                          ),
                          child: const Center(
                            child: Text(
                              'hb',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 28,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Mediflow Health', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
                              SizedBox(height: 4),
                              Text('Mobil Memnuniyet Uygulamasi', style: TextStyle(color: Color(0xFF5E7283))),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 28),
                    const Text('Guvenli Giris', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 10),
                    const Text(
                      'Referans ekrandaki temiz, beyaz ve yumusak cam yuzey hissini mobil tarafta koruyan giris deneyimi.',
                      style: TextStyle(color: Color(0xFF5E7283), height: 1.45),
                    ),
                    const SizedBox(height: 24),
                    TextField(
                      controller: _usernameController,
                      decoration: const InputDecoration(labelText: 'Kullanici Adi'),
                    ),
                    const SizedBox(height: 14),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(labelText: 'Sifre'),
                    ),
                    const SizedBox(height: 24),
                    GradientButton(
                      label: 'Devam Et',
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const SurveySelectionScreen()),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
