/*
 * SCRIPT UNTUK SLIDER GAMBAR DI HOMEPAGE
 * (Ini adalah file JS yang terpisah dari script ujian Anda)
 */

document.addEventListener("DOMContentLoaded", () => {
  const sliderImages = document.querySelectorAll(".slider-img");
  let currentImageIndex = 0;

  if (sliderImages.length > 0) {
    // Atur gambar pertama agar langsung terlihat
    sliderImages[currentImageIndex].classList.add("active");

    // Ganti gambar setiap 3 detik (3000 ms)
    setInterval(() => {
      // 1. Sembunyikan gambar yang sekarang
      sliderImages[currentImageIndex].classList.remove("active");

      // 2. Pindah ke gambar berikutnya
      currentImageIndex++;

      // 3. Jika sudah di gambar terakhir, kembali ke awal
      if (currentImageIndex >= sliderImages.length) {
        currentImageIndex = 0;
      }

      // 4. Tampilkan gambar baru
      sliderImages[currentImageIndex].classList.add("active");
    }, 3000); // 3000ms = 3 detik
  }
});
