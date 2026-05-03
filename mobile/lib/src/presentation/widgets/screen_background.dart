import 'package:flutter/material.dart';

class ScreenBackground extends StatelessWidget {
  const ScreenBackground({
    super.key,
    required this.child,
  });

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFF7FCFF),
            Color(0xFFE7F6FF),
            Color(0xFFF9FCFF),
          ],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            top: -120,
            left: -40,
            child: Container(
              width: 240,
              height: 240,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0x2232C0E6),
              ),
            ),
          ),
          Positioned(
            right: -80,
            bottom: -40,
            child: Transform.rotate(
              angle: -0.4,
              child: Container(
                width: 260,
                height: 180,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(48),
                  color: const Color(0x115DD6C8),
                ),
              ),
            ),
          ),
          SafeArea(child: child),
        ],
      ),
    );
  }
}
