import 'package:flutter/material.dart';

import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../widgets/screen_background.dart';
import 'kvkk_screen.dart';

class UnitSelectionScreen extends StatelessWidget {
  const UnitSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final birimler = const ['Acil', 'Dahiliye', 'Kardiyoloji'];

    return Scaffold(
      body: ScreenBackground(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const SizedBox(height: 16),
            const Text('Birim Seçimi', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800)),
            const SizedBox(height: 24),
            ...birimler.map(
              (birim) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: GlassCard(
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(colors: [Color(0xFF1AA9CD), Color(0xFF5DD6C8)]),
                        ),
                        child: const Icon(Icons.local_hospital_outlined, color: Colors.white),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Text(
                          birim,
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
                        ),
                      ),
                      GradientButton(
                        label: 'Seç',
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const KvkkScreen()),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
