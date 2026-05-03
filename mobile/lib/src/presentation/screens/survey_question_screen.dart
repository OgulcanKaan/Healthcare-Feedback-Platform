import 'package:flutter/material.dart';

import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../widgets/screen_background.dart';
import 'thank_you_screen.dart';

class SurveyQuestionScreen extends StatefulWidget {
  const SurveyQuestionScreen({super.key});

  @override
  State<SurveyQuestionScreen> createState() => _SurveyQuestionScreenState();
}

class _SurveyQuestionScreenState extends State<SurveyQuestionScreen> {
  int currentQuestionIndex = 2;
  int? selectedIndex = 1;

  final options = const [
    'Cok Memnun',
    'Memnun',
    'Kararsiz',
    'Memnun Degil',
    'Hic Memnun Degil',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ScreenBackground(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                height: 10,
                decoration: BoxDecoration(
                  color: const Color(0xFFDCEBF2),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: FractionallySizedBox(
                  alignment: Alignment.centerLeft,
                  widthFactor: 0.3,
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(999),
                      gradient: const LinearGradient(colors: [Color(0xFF1AA9CD), Color(0xFF4DBDEA)]),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerRight,
                child: Text(
                  'Soru ${currentQuestionIndex + 1} / 10',
                  style: const TextStyle(color: Color(0xFF5E7283)),
                ),
              ),
              const SizedBox(height: 18),
              Expanded(
                child: GlassCard(
                  child: Column(
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(colors: [Color(0xFF1AA9CD), Color(0xFF5DD6C8)]),
                        ),
                        child: const Center(
                          child: Text(
                            'hb',
                            style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.w800),
                          ),
                        ),
                      ),
                      const SizedBox(height: 18),
                      const Text(
                        'Hastanemizden aldiginiz hizmeti nasil degerlendirirsiniz?',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 30, fontWeight: FontWeight.w700, height: 1.2),
                      ),
                      const SizedBox(height: 26),
                      Expanded(
                        child: ListView.separated(
                          itemCount: options.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 14),
                          itemBuilder: (context, index) {
                            final selected = selectedIndex == index;
                            return InkWell(
                              borderRadius: BorderRadius.circular(24),
                              onTap: () => setState(() => selectedIndex = index),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(24),
                                  color: selected ? const Color(0xFFEAF9FF) : Colors.white,
                                  border: Border.all(
                                    color: selected ? const Color(0xFF1AA9CD) : const Color(0xFFD5E8F1),
                                    width: 1.5,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 28,
                                      height: 28,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        border: Border.all(color: const Color(0xFF1AA9CD), width: 1.7),
                                        color: selected ? const Color(0xFF1AA9CD) : Colors.transparent,
                                      ),
                                    ),
                                    const SizedBox(width: 18),
                                    Expanded(
                                      child: Text(
                                        options[index],
                                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w500),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                      ),
                      child: const Text('[ Geri ]', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: GradientButton(
                      label: '[ Ileri ]',
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const ThankYouScreen()),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
