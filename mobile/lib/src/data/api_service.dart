import 'package:dio/dio.dart';

import '../core/api_config.dart';

class ApiService {
  ApiService()
      : _dio = Dio(
          BaseOptions(
            baseUrl: ApiConfig.baseUrl,
            connectTimeout: const Duration(seconds: 20),
            receiveTimeout: const Duration(seconds: 20),
          ),
        );

  final Dio _dio;

  Future<Response<dynamic>> login({
    required String kullaniciAdi,
    required String sifre,
  }) {
    return _dio.post(
      '/Auth/login',
      data: {
        'KullaniciAdi': kullaniciAdi,
        'Sifre': sifre,
      },
    );
  }
}
