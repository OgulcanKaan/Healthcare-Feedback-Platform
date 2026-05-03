using HastaAnketi.API.Models;

namespace HastaAnketi.API.Data
{
    public static class InMemoryStore
    {
        public static List<Anket> Anketler { get; } = new();
        public static List<Soru> Sorular { get; } = new();
        public static List<CevapSecenek> Secenekler { get; } = new();
        public static List<AnketSoru> AnketSorular { get; } = new();

        public static List<AnketOturumu> Oturumlar { get; } = new();
        public static List<Cevap> Cevaplar { get; } = new();
        public static List<Sikayet> Sikayetler { get; } = new();

        public static List<Birim> Birimler { get; } = new();
        public static List<Rol> Roller { get; } = new();
        public static List<Kullanici> Kullanicilar { get; } = new();
        public static List<KullaniciLog> KullaniciLoglari { get; } = new();
        public static List<Hasta> Hastalar { get; } = new();
        public static List<Randevu> Randevular { get; } = new();

        public static SistemParametre Parametre { get; private set; } = new();

        private static bool _seeded = false;

        public static void Seed()
        {
            if (_seeded) return;
            _seeded = true;

            // Sistem Parametreleri
            if (Parametre == null || Parametre.Id == 0)
            {
                Parametre = new SistemParametre
                {
                    Id = 1,
                    KurumAdi = "Demo Hastane",
                    KvkkMetni = "KVKK metni (demo).",
                    AnketTimeoutSuresi = 300,
                    AnonimAnketAktif = true,
                    SikayetEsikPuani = 3
                };
            }

            // Roller
            if (!Roller.Any(r => r.Id == 1))
            {
                Roller.Add(new Rol
                {
                    Id = 1,
                    RolAdi = "Yonetici",
                    AktifPasif = true
                });
            }

            if (!Roller.Any(r => r.Id == 2))
            {
                Roller.Add(new Rol
                {
                    Id = 2,
                    RolAdi = "Personel",
                    AktifPasif = true
                });
            }

            // Birimler
            if (!Birimler.Any(b => b.Id == 1))
            {
                Birimler.Add(new Birim
                {
                    Id = 1,
                    BirimKodu = "ACIL",
                    BirimAdi = "Acil",
                    AktifPasif = true
                });
            }

            if (!Birimler.Any(b => b.Id == 2))
            {
                Birimler.Add(new Birim
                {
                    Id = 2,
                    BirimKodu = "DAH",
                    BirimAdi = "Dahiliye",
                    AktifPasif = true
                });
            }

            // Kullanicilar
            if (!Kullanicilar.Any(k => k.Id == 1))
            {
                Kullanicilar.Add(new Kullanici
                {
                    Id = 1,
                    KullaniciAdi = "admin",
                    Sifre = "123456",
                    AdSoyad = "Sistem Yöneticisi",
                    BirimId = 1,
                    RolId = 1,
                    AktifPasif = true,
                    SonGirisTarihi = null
                });
            }

            // Hastalar
            if (!Hastalar.Any(h => h.Id == 1))
            {
                Hastalar.Add(new Hasta
                {
                    Id = 1,
                    HbysReferans = "HBYS-1001",
                    TcNo = "11111111111",
                    BirimId = 1,
                    HizmetTarihi = DateTime.UtcNow.AddDays(-1),
                    AnonimMi = false
                });
            }

            if (!Hastalar.Any(h => h.Id == 2))
            {
                Hastalar.Add(new Hasta
                {
                    Id = 2,
                    HbysReferans = "HBYS-1002",
                    TcNo = null,
                    BirimId = 2,
                    HizmetTarihi = DateTime.UtcNow.AddDays(-1),
                    AnonimMi = true
                });
            }

            // Randevular
            if (!Randevular.Any(r => r.Id == 1))
            {
                Randevular.Add(new Randevu
                {
                    Id = 1,
                    HastaId = 1,
                    BirimId = 1,
                    DoktorAdi = "Dr. Mehmet Kaya",
                    RandevuZamani = DateTime.UtcNow.AddHours(-2),
                    Durum = "Tamamlandi"
                });
            }

            if (!Randevular.Any(r => r.Id == 2))
            {
                Randevular.Add(new Randevu
                {
                    Id = 2,
                    HastaId = 2,
                    BirimId = 2,
                    DoktorAdi = "Dr. Elif Arslan",
                    RandevuZamani = DateTime.UtcNow.AddHours(-1),
                    Durum = "Tamamlandi"
                });
            }

            // Anket
            if (!Anketler.Any(a => a.Id == 1))
            {
                Anketler.Add(new Anket
                {
                    Id = 1,
                    AnketAdi = "Poliklinik Memnuniyet Anketi",
                    Durum = "Aktif",
                    BaslangicTarihi = DateTime.UtcNow,
                    BitisTarihi = null,
                    KarsilamaMesaji = "Hoş geldiniz",
                    TesekkurMesaji = "Katılımınız için teşekkürler.",
                    OlusturanKullaniciId = 1,
                    AnketSorular = new List<AnketSoru>()
                });
            }

            // Sorular
            SeedSoru(1, "CoktanSecmeli", "Genel memnuniyetiniz?", true, "Genel");
            SeedSoru(2, "CoktanSecmeli", "Doktor ilgisi nasıldı?", true, "Personel");
            SeedSoru(3, "CoktanSecmeli", "Hemşire ilgisi nasıldı?", true, "Personel");
            SeedSoru(4, "CoktanSecmeli", "Temizlik nasıldı?", true, "Genel");
            SeedSoru(5, "CoktanSecmeli", "Bekleme süresi nasıldı?", true, "Süreç");

            // Anket - Soru bağları
            int sira = 1;
            foreach (var soru in Sorular.OrderBy(s => s.Id))
            {
                if (!AnketSorular.Any(x => x.AnketId == 1 && x.SoruId == soru.Id))
                {
                    AnketSorular.Add(new AnketSoru
                    {
                        AnketId = 1,
                        SoruId = soru.Id,
                        SiraNo = sira++
                    });
                }
                else
                {
                    sira++;
                }
            }

            // Seçenekler
            foreach (var soru in Sorular)
            {
                SeedSecenek(soru.Id, "Çok Kötü", 1);
                SeedSecenek(soru.Id, "Kötü", 2);
                SeedSecenek(soru.Id, "Orta", 3);
                SeedSecenek(soru.Id, "İyi", 4);
                SeedSecenek(soru.Id, "Çok İyi", 5);
            }
        }

        private static void SeedSoru(int id, string tip, string metin, bool zorunlu, string kategori)
        {
            if (Sorular.Any(s => s.Id == id)) return;

            Sorular.Add(new Soru
            {
                Id = id,
                SoruTipi = tip,
                SoruMetni = metin,
                ZorunluMu = zorunlu,
                Kategori = kategori
            });
        }

        private static void SeedSecenek(int soruId, string metin, int puan)
        {
            if (Secenekler.Any(x => x.SoruId == soruId &&
                                    x.SecenekMetni == metin &&
                                    x.PuanDegeri == puan))
                return;

            Secenekler.Add(new CevapSecenek
            {
                Id = NextId(Secenekler),
                SoruId = soruId,
                SecenekMetni = metin,
                PuanDegeri = puan
            });
        }

        public static int NextId<T>(List<T> list) where T : class
        {
            if (list.Count == 0) return 1;

            var prop = typeof(T).GetProperty("Id");
            if (prop == null) return list.Count + 1;

            var max = list
                .Select(x => (int)(prop.GetValue(x) ?? 0))
                .DefaultIfEmpty(0)
                .Max();

            return max + 1;
        }
    }
}
