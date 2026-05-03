import 'package:flutter/material.dart';

import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../widgets/screen_background.dart';
import 'unit_selection_screen.dart';

class SurveySelectionScreen extends StatelessWidget {
  const SurveySelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ScreenBackground(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const SizedBox(height: 16),
            const Text('Anket Seçimi', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800)),
            const SizedBox(height: 10),
            const Text('Kullanıcı giriş yaptıktan sonra aktif anketlerden birini seçerek süreci başlatır.', style: TextStyle(color: Color(0xFF5E7283))),
            const SizedBox(height: 24),
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Poliklinik Memnuniyet Anketi', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 10),
                  const Text('Aktif anket • 5 soru • Web / Mobil / Kiosk akışı ile uyumlu', style: TextStyle(color: Color(0xFF5E7283))),
                  const SizedBox(height: 24),
                  GradientButton(
                    label: 'Bu Anketi Seç',
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const UnitSelectionScreen()),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
