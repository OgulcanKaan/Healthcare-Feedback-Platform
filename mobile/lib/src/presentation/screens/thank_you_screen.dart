import 'package:flutter/material.dart';

import '../widgets/glass_card.dart';
import '../widgets/screen_background.dart';

class ThankYouScreen extends StatelessWidget {
  const ThankYouScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ScreenBackground(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: GlassCard(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 92,
                      height: 92,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(colors: [Color(0xFF1AA9CD), Color(0xFF5DD6C8)]),
                      ),
                      child: const Icon(Icons.favorite_outline, size: 42, color: Colors.white),
                    ),
                    const SizedBox(height: 24),
                    const Text('Tesekkur Ederiz', style: TextStyle(fontSize: 34, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 12),
                    const Text(
                      'Gorusleriniz hastanemizin hizmet kalitesini iyilestirmemize yardimci olur.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 17, color: Color(0xFF5E7283), height: 1.5),
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
