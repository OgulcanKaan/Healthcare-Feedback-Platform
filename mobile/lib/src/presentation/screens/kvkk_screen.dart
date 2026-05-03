import 'package:flutter/material.dart';

import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../widgets/screen_background.dart';
import 'survey_question_screen.dart';

class KvkkScreen extends StatefulWidget {
  const KvkkScreen({super.key});

  @override
  State<KvkkScreen> createState() => _KvkkScreenState();
}

class _KvkkScreenState extends State<KvkkScreen> {
  bool accepted = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ScreenBackground(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const SizedBox(height: 16),
            const Text('KVKK Onayi', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800)),
            const SizedBox(height: 24),
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Kisisel verileriniz yalnizca hizmet memnuniyetini iyilestirmek amaciyla islenir. Onay verdikten sonra anket ekranina gecilir.',
                    style: TextStyle(fontSize: 16, height: 1.6, color: Color(0xFF5E7283)),
                  ),
                  const SizedBox(height: 18),
                  CheckboxListTile(
                    value: accepted,
                    contentPadding: EdgeInsets.zero,
                    title: const Text('KVKK metnini okudum ve onayliyorum.'),
                    onChanged: (value) => setState(() => accepted = value ?? false),
                  ),
                  const SizedBox(height: 12),
                  GradientButton(
                    label: 'Ankete Gec',
                    onPressed: accepted
                        ? () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SurveyQuestionScreen()),
                            );
                          }
                        : () {},
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
