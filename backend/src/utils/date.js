
// "15-10-2026" biçimindeki metni gerçek Date nesnesine çevirir.
export function parseDate(value) {
  // Değer zaten Date ise veya undefined ise olduğu gibi bırak.
  if (typeof value !== "string") {
    return value;
  }

  // Beklenen biçim: GG-AA-YYYY
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);

  // Tarih biçimi uygun değilse geçersiz Date döndür.
  if (!match) {
    return new Date(NaN);
  }

  const gun = Number(match[1]);
  const ay = Number(match[2]);
  const yil = Number(match[3]);

  // UTC kullanarak tarih nesnesini oluştur.
  const tarih = new Date(Date.UTC(yil, ay - 1, gun));

  // 31-02-2026 gibi geçersiz tarihleri kontrol et.
  if (
    tarih.getUTCFullYear() !== yil ||
    tarih.getUTCMonth() !== ay - 1 ||
    tarih.getUTCDate() !== gun
  ) {
    return new Date(NaN);
  }

  return tarih;
}

// Date nesnesini "GG-AA-YYYY" biçiminde gösterir.
export function formatDate(tarih) {
  if (!(tarih instanceof Date)) {
    return tarih;
  }

  if (Number.isNaN(tarih.getTime())) {
    return tarih;
  }

  const gun = String(tarih.getUTCDate()).padStart(2, "0");
  const ay = String(tarih.getUTCMonth() + 1).padStart(2, "0");
  const yil = tarih.getUTCFullYear();

  return `${gun}-${ay}-${yil}`;
}

// Bugünün başlangıcını UTC olarak döndürür.
export function todayStart() {
  const simdi = new Date();

  return new Date(
    Date.UTC(
      simdi.getUTCFullYear(),
      simdi.getUTCMonth(),
      simdi.getUTCDate()
    )
  );
}
