/*
 * SCRIPT LOGIKA UJIAN (FRONTEND)
 * Versi ini memperbaiki semua error copy-paste.
 */

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!           MASUKKAN URL APLIKASI WEB ANDA DI SINI            !!
// !!   (Dapatkan dari Google Apps Script setelah Anda 'Deploy')   !!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwZV8L-y2MPQ7YjY6LrO-T7RGWA2OnXZH_ZkDhW7wAoF3pKy8BAMAzO4OkFPWOHmC6xTQ/exec";
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Ambil elemen DOM
const loginContainer = document.getElementById("login-container");
const instructionsContainer = document.getElementById("instructions-container");
const examContainer = document.getElementById("exam-container");
const resultsContainer = document.getElementById("results-container");
const loginBtn = document.getElementById("login-btn");
const startExamBtn = document.getElementById("start-exam-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const timerDisplay = document.getElementById("timer");
const questionContainer = document.getElementById("question-container");

// Variabel status
let currentQuestionIndex = 0;
let userAnswers = [];
let allQuestions = [];
let timer;
let timeLeft = 90 * 60; // 90 menit
let cheatingDetected = false;
let cheatStatus = "Aman";
let studentName = "";
let studentClass = "";
let mcqCount = 0; // Untuk menghitung jumlah soal PG

// --- 1. DATABASE SOAL ---
// Soal-soal diekstrak dari file PDF Anda

// SOAL APPS PG.pdf (35 Soal)
const mcqQuestions = [
  {
    type: "mcq",
    question:
      "1. Ibadah sering kali disalahartikan oleh banyak orang sebagai kegiatan yang sebatas...",
    options: [
      "a. Persekutuan dan sikap hidup setiap hari.",
      "b. Upacara keagamaan, seperti kebaktian di gereja atau sekolah.",
      "c. Mempersembahkan tubuh sebagai persembahan yang hidup.",
      "d. Mengunjungi yatim piatu dan janda-janda.",
      "e. Mengabdikan semua pikiran, perkataan, dan perbuatan kepada Tuhan.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      "2. Menurut Rasul Paulus dalam Roma 12:1-2, yang dimaksud dengan ibadah yang sejati adalah...",
    options: [
      "a. Rajin menyanyi, berdoa, dan membaca Firman Tuhan saja.",
      "b. Mengendalikan lidah dan mengunjungi yatim piatu.",
      "c. Melakukan tindakan sosial untuk orang miskin dan menderita.",
      "d. Mempersembahkan tubuh sebagai persembahan yang hidup, kudus, dan berkenan kepada Allah.",
      "e. Selalu hadir dalam ibadah di gereja setiap hari Minggu.",
    ],
    answer: 3, // Kunci Jawaban: D
  },
  {
    type: "mcq",
    question:
      '3. Apa makna dari "mempersembahkan tubuh" sebagai ibadah yang sejati menurut penjelasan materi?',
    options: [
      "a. Mengurbankan tubuh secara harfiah seperti pada zaman dahulu.",
      "b. Memberikan atau mengabdikan semua pikiran, perkataan, dan perbuatan agar sesuai dengan keinginan Tuhan.",
      "c. Menjaga kebersihan dan kesehatan tubuh jasmani semata.",
      "d. Hanya menggunakan anggota tubuh (tangan dan kaki) untuk melayani di gereja.",
      "e. Berfokus pada doa dan pujian menggunakan mulut.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      '4. tindakan yang terlihat baik seperti berdoa atau menolong orang lain bisa saja tidak dianggap ibadah, melainkan "sandiwara" atau pura-pura, apabila...',
    options: [
      "a. Dilakukan di luar lingkungan gereja.",
      "b. Tidak ada orang lain yang melihat perbuatan tersebut.",
      "c. Dilakukan tanpa ketulusan dan kejujuran di hadapan Tuhan.",
      "d. Perbuatan tersebut dianggap terlalu kecil atau sepele.",
      "e. Tidak menggunakan bagian tubuh seperti tangan atau kaki.",
    ],
    answer: 2, // Kunci Jawaban: C
  },
  {
    type: "mcq",
    question:
      "5. Berikut ini yang bukan merupakan contoh tindakan sederhana sebagai wujud ibadah yang benar di lingkungan rumah adalah...",
    options: [
      "a. Patuh dan taat kepada orang tua.",
      "b. Menyayangi kakak dan adik.",
      "c. Rajin belajar dan membuat pekerjaan rumah.",
      "d. Menendang orang lain ketika sedang marah.",
      "e. Tidak terlambat ke Sekolah Minggu.",
    ],
    answer: 3, // Kunci Jawaban: D
  },
  {
    type: "mcq",
    question:
      "6. Menurut materi yang dipelajari, alasan utama orang Kristen melakukan seluruh ibadah adalah...",
    options: [
      "a. Karena ibadah adalah tradisi yang harus dijalankan.",
      "b. Untuk memohon berkat dan pertolongan Roh Kudus saja.",
      "c. Sebagai bentuk atau cara manusia merespons kebaikan Tuhan dalam hidupnya.",
      "d. Agar dapat mengucapkan Pengakuan Iman Rasuli bersama-sama.",
      "e. Supaya ibadah tidak sekadar menjadi rutinitas tanpa arti.",
    ],
    answer: 2, // Kunci Jawaban: C
  },
  {
    type: "mcq",
    question:
      "7. Dalam ibadah, doa dinaikkan dengan berbagai tujuan. Doa yang dinaikkan sebelum membaca Alkitab untuk memohon pertolongan Tuhan agar kita dapat memahami Firman Tuhan dan melakukannya disebut...",
    options: [
      "a. Doa Syukur",
      "b. Doa Syafaat",
      "c. Doa Pengakuan Dosa",
      "d. Doa Epiklese",
      "e. Doa Berkat",
    ],
    answer: 3, // Kunci Jawaban: D
  },
  {
    type: "mcq",
    question:
      "8. Unsur Pembacaan Alkitab dan Khotbah membantu kita melihat bagaimana Allah bekerja. Fungsi utama dari khotbah yang disampaikan oleh pendeta adalah...",
    options: [
      "a. Menolong kita agar dapat melakukan firman Tuhan dalam kehidupan sehari-hari.",
      "b. Mengungkapkan penyesalan atas dosa-dosa kita.",
      "c. Menyatakan pujian atau syukur kepada Tuhan melalui kata-kata.",
      "d. Mengucapkan wujud iman tentang keyakinan orang Kristen.",
      "e. Memohon agar Tuhan menyertai orang-orang lain.",
    ],
    answer: 0, // Kunci Jawaban: A
  },
  {
    type: "mcq",
    question:
      "9. Ada tiga macam Pengakuan Iman orang Kristen di seluruh dunia. Akan tetapi, Pengakuan Iman yang paling sering diucapkan dalam kebaktian Minggu adalah...",
    options: [
      "a. Pengakuan Iman Athanasius",
      "b. Pengakuan Iman Nicea-Konstantinopel",
      "c. Pengakuan Iman Rasuli",
      "d. Pengakuan Iman Epiklese",
      "e. Pengakuan Iman Syafaat",
    ],
    answer: 2, // Kunci Jawaban: C
  },
  {
    type: "mcq",
    question:
      "10. Orang Kristen dianjurkan beribadah setiap hari, tidak hanya pada hari Minggu. Alasan kita beribadah setiap hari adalah...",
    options: [
      "a. Karena kebaktian Minggu tidak memuat semua unsur ibadah.",
      "b. Karena kita mensyukuri kebaikan Tuhan yang juga berlangsung setiap hari dalam kehidupan kita.",
      "c. Agar kita dapat merasakan kehadiran Tuhan hanya melalui nyanyian dan doa.",
      "d. Supaya kita bisa cepat menghafal Doa Pengakuan Dosa.",
      "e. Agar kita dapat memahami karya Allah di masa lampau, kini, dan masa depan.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      "11. salah satu kebiasaan yang sering terjadi saat bernyanyi dalam ibadah, namun tidak tepat, adalah...",
    options: [
      "a. Menyanyi dengan irama yang lembut dan syahdu.",
      "b. Asal bunyi dan tidak menghayati nyanyian tersebut.",
      "c. Menyanyikan lagu yang berisi pujian kepada Allah.",
      "d. Bernyanyi dengan suara jelas dan tidak berteriak.",
      "e. Melibatkan perasaan, keyakinan, dan doa.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      '12. "menyanyi dalam ibadah berarti melibatkan hati, bukan hanya mulut yang bersuara". Apakah maksud dari pernyataan tersebut?',
    options: [
      "a. Kita harus bernyanyi dengan suara yang paling merdu agar dipuji.",
      "b. Kita benar-benar menghayati syair dan melodi yang kita nyanyikan.",
      "c. Kita harus bernyanyi sambil memainkan alat musik seperti jimbe atau gitar.",
      "d. Kita bernyanyi karena takut dianggap tidak serius dalam beribadah.",
      "e. Kita harus memilih lagu yang iramanya bersemangat saja.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      '13. Sekalipun seseorang memiliki suara yang bagus, nyanyiannya dapat dianggap "tidak ada gunanya" apabila ia bernyanyi...',
    options: [
      "a. Dengan tujuan agar mendapat pujian dari orang yang mendengar.",
      "b. Dengan suara yang jelas dan menenteramkan hati.",
      "c. Dengan syair yang berisi ungkapan rasa syukur.",
      "d. Dalam suasana duka untuk penghiburan.",
      "e. Sambil diiringi alat musik perkusi.",
    ],
    answer: 0, // Kunci Jawaban: A
  },
  {
    type: "mcq",
    question:
      "14. Menyanyi adalah salah satu unsur ibadah yang tidak dapat diabaikan. Berdasarkan materi, nyanyian merupakan...",
    options: [
      "a. Kegiatan yang hanya boleh dilakukan oleh orang yang bersuara bagus.",
      "b. Kebiasaan yang dilakukan hanya untuk mengisi waktu ibadah.",
      "c. Ekspresi, doa, dan harapan umat terhadap Tuhan.",
      "d. Cara untuk menunjukkan kemampuan bermain alat musik.",
      "e. Unsur yang hanya cocok untuk kebaktian di gereja.",
    ],
    answer: 2, // Kunci Jawaban: C
  },
  {
    type: "mcq",
    question:
      "15. Agar nyanyian dapat menolong orang memahami karya Allah, materi menekankan bahwa nyanyian harus diciptakan dan dinyanyikan dengan...",
    options: [
      "a. Irama yang paling rumit dan sulit.",
      "b. Suara yang paling keras dan bersemangat.",
      "c. Akal dan budi yang baik.",
      "d. Lirik yang hanya berisi pujian saja.",
      "e. Berbagai macam alat musik modern.",
    ],
    answer: 2, // Kunci Jawaban: C
  },
  {
    type: "mcq",
    question:
      "16. salah satu manfaat utama membaca Alkitab atau Firman Tuhan adalah...",
    options: [
      "a. Kita akan menemukan banyak gambar yang menarik.",
      "b. Kita akan tahu apa yang Tuhan kehendaki untuk kita lakukan atau tidak lakukan.",
      "c. Otak kita akan terbiasa pada hal-hal yang mudah.",
      "d. Kita dapat menghafal semua kisah Perjanjian Lama.",
      "e. Kita hanya akan menemukan kisah-kisah para rasul.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      "17. Membaca Firman Tuhan secara tekun akan menolong kita agar...",
    options: [
      "a. Iman kita semakin kuat dan tidak mudah goyah oleh godaan.",
      "b. Kita tidak perlu lagi bergaul dengan orang lain.",
      "c. Otak kita terbiasa pada hal-hal yang mudah.",
      "d. Kita hanya fokus pada cerita penciptaan.",
      "e. Kita menjadi penemu-penemu dunia seperti dalam materi.",
    ],
    answer: 0, // Kunci Jawaban: A
  },
  {
    type: "mcq",
    question:
      "18. Ketika seseorang mengalami kesusahan atau kesedihan, membaca Alkitab dapat menolongnya agar...",
    options: [
      "a. Tidak gampang putus asa dan tidak merasa sendiri, karena tahu Tuhan menyertai dan menghibur.",
      "b. Masalahnya langsung selesai tanpa perlu melakukan apa-apa.",
      "c. Bisa menceritakan kesedihannya kepada para rasul.",
      "d. Lupa pada masalah karena banyak cerita menakjubkan.",
      "e. Menjadi takut karena Tuhan itu Mahakuasa.",
    ],
    answer: 0, // Kunci Jawaban: A
  },
  {
    type: "mcq",
    question:
      "19. Jika seseorang tidak suka membaca, ada efek buruk yang akan terjadi, yaitu...",
    options: [
      "a. Otak akan susah diajak berpikir untuk menyelesaikan masalah.",
      "b. Iman akan otomatis menjadi kuat.",
      "c. Menjadi terlalu takut kepada Tuhan.",
      "d. Terlalu banyak mengetahui kehendak Tuhan.",
      "e. Menemukan terlalu banyak penghiburan.",
    ],
    answer: 0, // Kunci Jawaban: A
  },
  {
    type: "mcq",
    question:
      "20. Alkitab adalah Kitab Suci yang berisi pengajaran, pedoman, teguran, larangan, nasihat, penghiburan, dan harapan bagi kita. Dengan membaca Alkitab, kita menjadi tahu...",
    options: [
      "a. Cerita yang hanya berisi hal-hal mudah saja.",
      "b. Cara Tuhan menuntun hidup manusia dan apa yang Tuhan kehendaki untuk kita lakukan.",
      "c. Bahwa Tuhan hanya bekerja di masa lalu saja.",
      "d. Bahwa iman tidak perlu dipelihara.",
      "e. Cara menjadi penemu-penemu dunia.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      "21. Matius 6:6, sikap yang harus dihindari ketika berdoa di tempat umum (seperti rumah makan) adalah...",
    options: [
      "a. Berdoa dalam hati sambil mengucap syukur.",
      "b. Berdoa dengan suara keras atau lantang sehingga menyita perhatian orang lain.",
      "c. Menyesuaikan sikap badan dengan waktu dan tempat.",
      "d. Berdoa dengan rendah hati di hadapan Tuhan.",
      "e. Berdoa kapan saja saat kita membutuhkannya.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      "22. Perumpamaan orang Farisi dan pemungut cukai (Lukas 18:9-14) untuk menekankan bahwa Tuhan lebih berkenan pada doa yang didasari oleh...",
    options: [
      "a. Kesombongan dan pamer kesalehan diri.",
      "b. Kerendahan hati dan pengakuan atas keberdosaan.",
      "c. Kata-kata yang bertele-tele dan diulang-ulang.",
      "d. Sikap badan yang menengadah ke langit.",
      "e. Kemampuan untuk memuji-muji diri sendiri.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      '23. Kita diminta untuk "tekun berdoa", yang berbeda artinya dengan "berdoa berulang-ulang". Maksud dari "tekun berdoa" adalah...',
    options: [
      "a. Berdoa dengan kata-kata yang tidak jelas arah dan tujuannya.",
      "b. Berdoa hanya dalam keadaan senang saja.",
      "c. Tetap berdoa baik dalam keadaan senang maupun susah.",
      "d. Memamerkan sikap doa di tempat umum agar terlihat saleh.",
      "e. Menggunakan sikap badan bersujud di mana saja.",
    ],
    answer: 2, // Kunci Jawaban: C
  },
  {
    type: "mcq",
    question:
      "24. Mengenai berbagai sikap badan dalam berdoa (berdiri, bersujud, dll.), materi menjelaskan bahwa...",
    options: [
      "a. Alkitab mengharuskan satu sikap badan yang kaku, yaitu berdiri.",
      "b. Tuhan hanya melihat sikap badan, bukan apa yang ada di dalam hati.",
      "c. Tidak ada aturan khusus, karena sikap badan hanyalah gambaran atau ungkapan hati kita kepada Tuhan.",
      "d. Berdoa di gereja harus selalu sambil bersujud di samping tempat tidur.",
      "e. Berdoa di kamar harus selalu dengan sikap berdiri.",
    ],
    answer: 2, // Kunci Jawaban: C
  },
  {
    type: "mcq",
    question:
      '25. Doa adalah "nafas kehidupan orang percaya". Hal ini karena doa merupakan...',
    options: [
      "a. Komunikasi kepada Tuhan untuk menyampaikan segala isi hati (keluh kesah, kebahagiaan, harapan).",
      "b. Sebuah kewajiban yang hanya dilakukan pada waktu-waktu tertentu saja.",
      "c. Cara untuk menonjolkan diri atau memuji diri kepada Tuhan.",
      "d. Kegiatan yang harus dilakukan dengan suara lantang di restoran.",
      "e. Aturan yang kaku mengenai sikap badan.",
    ],
    answer: 0, // Kunci Jawaban: A
  },
  {
    type: "mcq",
    question:
      "26. Sumber segala sesuatu yang kita miliki di dunia ini, yang menjadi alasan mengapa kita pantas memberi, berasal dari...",
    options: [
      "a. Usaha dan kerja keras kita sendiri semata.",
      "b. Tuhan, yang memberikannya melalui pekerjaan orang tua atau pemberian orang lain.",
      "c. Kisah sang nenek dan jemaat di Korintus.",
      "d. Keberuntungan yang kita dapatkan secara acak.",
      "e. Kebiasaan baik yang kita kembangkan sejak kecil.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question: "27. Kebiasaan memberi yang baik adalah yang dilakukan dengan...",
    options: [
      "a. Perasaan sedih karena merasa kehilangan.",
      "b. Rela dan dengan hati yang bergembira (sukacita).",
      "c. Harapan akan dikenang oleh orang lain.",
      "d. Perhitungan agar tidak rugi di kemudian hari.",
      "e. Perasaan terpaksa karena itu adalah aturan gereja.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question: "28. Kita memberi kepada Tuhan sebagai...",
    options: [
      "a. Cara untuk menunjukkan bahwa kita memiliki banyak harta.",
      "b. Wujud terima kasih kita kepada-Nya karena Tuhan sudah lebih dahulu memberi.",
      "c. Simbol bahwa kita lebih baik dari orang lain.",
      "d. Upaya agar kebaikan kita tumbuh dalam hidup orang lain.",
      "e. Cara agar hidup kita menjadi lebih indah saja.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      "29. Seringkali orang beranggapan keliru bahwa ketika seseorang memberi sesuatu kepada orang lain, maka ia...",
    options: [
      "a. Akan bertumbuh dalam kebaikan.",
      "b. Mengalami kebahagiaan.",
      "c. Kehilangan sesuatu miliknya.",
      "d. Menjadi bagian dari hidup sesama.",
      "e. Meneruskan berkat Tuhan.",
    ],
    answer: 2, // Kunci Jawaban: C
  },
  {
    type: "mcq",
    question:
      "30. Kita dapat meneruskan kebaikan dan berkat Tuhan kepada orang lain melalui dua cara, yaitu...",
    options: [
      "a. Melalui persembahan di gereja atau langsung kepada orang yang membutuhkan.",
      "b. Hanya melalui doa dan pujian di gereja.",
      "c. Hanya dengan memberi uang, bukan benda.",
      "d. Belajar dari kisah Daud dan bekerja keras.",
      "e. Menjadi pribadi yang dikenang dan menumbuhkan kebaikan.",
    ],
    answer: 0, // Kunci Jawaban: A
  },
  {
    type: "mcq",
    question:
      "31. bahwa seringkali bersyukur disamakan dengan aktivitas yang keliru, yaitu...",
    options: [
      "a. Dilakukan dalam segala waktu dan situasi.",
      "b. Dilakukan hanya ketika memperoleh sesuatu yang baik atau yang kita suka.",
      "c. Menyadari bahwa segala sesuatu berasal dari Tuhan.",
      "d. Dilakukan saat sedang susah atau sedih.",
      "e. Menjadi kebiasaan yang baik.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      "32. Bersyukur ketika sedang senang atau berhasil tentu mudah dilakukan. Akan tetapi, bersyukur yang dikehendaki dari setiap anak Tuhan adalah bersyukur ketika...",
    options: [
      "a. Menerima hal-hal yang tampak kecil dan biasa.",
      "b. Mengalami peristiwa besar dan ajaib seperti Musa.",
      "c. Sedang susah (sedih) atau gagal dalam pelajaran di sekolah.",
      "d. Mendapat pertolongan dari guru dan teman saja.",
      "e. Mampu melakukan banyak hal karena Tuhan.",
    ],
    answer: 2, // Kunci Jawaban: C
  },
  {
    type: "mcq",
    question:
      "33. Alasan kita pantas dan layak untuk selalu bersyukur kepada Tuhan adalah karena...",
    options: [
      "a. Tuhan hanya baik ketika kita sedang senang atau sukses.",
      "b. Tuhan selalu baik kepada kita, dalam segala keadaan yang kita alami.",
      "c. Kita sudah berusaha berterima kasih kepada orang lain.",
      "d. Kita menunggu peristiwa ajaib terjadi dalam hidup kita.",
      "e. Kita berhasil menghindari kegagalan di sekolah.",
    ],
    answer: 1, // Kunci Jawaban: B
  },
  {
    type: "mcq",
    question:
      "34. Bahwa kita tidak terlambat untuk bersyukur. Hal ini karena bersyukur adalah sesuatu yang bisa kita...",
    options: [
      "a. Lupakan jika sedang mengalami kesusahan.",
      "b. Anggap sebagai hal biasa yang tidak perlu dilakukan.",
      "c. Lakukan hanya jika kita ingat saja.",
      "d. Ciptakan, usahakan, bahkan kita tumbuhkan sebagai sebuah kebiasaan yang baik.",
      "e. Tunda sampai kita mengalami hal-hal besar dan luar biasa.",
    ],
    answer: 3, // Kunci Jawaban: D
  },
  {
    type: "mcq",
    question:
      "35. Kita sering jarang bersyukur atas hal-hal yang tampak kecil atau biasa. Padahal, materi mengingatkan bahwa segala sesuatu yang kita miliki, baik hal-hal kecil maupun hal besar, semuanya berasal dari...",
    options: [
      "a. Guru-guru yang mendidik kita.",
      "b. Orangtua yang selalu mengasihi kita.",
      "c. Tuhan.",
      "d. Teman-teman yang ada di sekeliling kita.",
      "e. Pendeta atau pelayan Tuhan di gereja.",
    ],
    answer: 2, // Kunci Jawaban: C
  },
];

// SOAL APPS 2.pdf & SOAL APPS 3.pdf (15 Soal)
const essayQuestions = [
  // Dari SOAL APPS 2.pdf
  {
    type: "essay",
    question:
      "1. Jelaskan bagaimana kedua konsep ibadah yang sejati (Surat Yakobus 1:26-27 dan Roma 12:1-2) saling berkaitan dalam kehidupan Kristen!",
  },
  {
    type: "essay",
    question:
      "2. Jelaskan perbedaan utama antara Doa Syafaat dan Doa Pengakuan Dosa!",
  },
  {
    type: "essay",
    question:
      "3. Jelaskan apa saja yang dapat dinyatakan oleh orang Kristen melalui nyanyian dalam ibadah!",
  },
  {
    type: "essay",
    question:
      '4. (Soal no 4 tidak ada di PDF, lanjut ke 5) Jelaskan perbedaan mendasar antara kedua cara bernyanyi (asal bunyi vs menghayati) dan apa yang membuat nyanyian yang "asal bunyi" menjadi tidak ada gunanya!',
  },
  {
    type: "essay",
    question:
      "5. Sebutkan dan jelaskan dua alasan utama mengapa kita perlu memuliakan Tuhan!",
  },
  {
    type: "essay",
    question:
      "6. Sebutkan tiga manfaat (dari membaca Alkitab) yang dapat kamu rasakan dalam kehidupan sehari-hari, khususnya saat menghadapi godaan atau kesusahan!",
  },
  {
    type: "essay",
    question:
      "7. Mengapa kita tidak boleh memamerkan sikap doa di tempat umum untuk tujuan menonjolkan diri? Apa yang sesungguhnya dilihat oleh Tuhan ketika seseorang berdoa?",
  },
  {
    type: "essay",
    question:
      "8. Jelaskan apa maksud dari pernyataan: \"saat memberi sesuatu itu 'hilang', namun 'maksud baik kita dan perbuatan baik kita tetap ada di dalam diri kita'\"!",
  },
  {
    type: "essay",
    question:
      "9. Jelaskan mengapa bersyukur saat susah, seperti gagal pelajaran, menjadi tidak mudah dilakukan!",
  },
  // Dari SOAL APPS 3.pdf
  {
    type: "essay",
    question:
      "10. Mengapa ibadah yang sejati tidak dapat dibatasi hanya pada kegiatan di gereja pada hari Minggu? Uraikan jawabanmu secara lengkap!",
  },
  {
    type: "essay",
    question:
      "11. bagaimana seharusnya sikap kita dalam beribadah agar kita dapat sungguh-sungguh merasakan kehadiran Tuhan dan kebaikan-Nya?",
  },
  {
    type: "essay",
    question:
      "12. Uraikan, bagaimana pemahaman tentang tuntunan Allah (di masa lalu, kini, dan akan datang) dapat mengubah caramu bersikap dan bertindak di sekolah dan di rumah!",
  },
  {
    type: "essay",
    question:
      '13. Uraikan secara lengkap hubungan antara "sumber segala sesuatu yang kita miliki berasal dari Tuhan" dengan tindakan kita memberi persembahan!',
  },
  {
    type: "essay",
    question:
      '14. Mengapa tindakan memberi itu disebut sebagai "wujud terima kasih", dan bagaimana seharusnya sikap hati kita saat melakukannya?',
  },
  {
    type: "essay",
    question:
      '15. Uraikan secara lengkap, apa yang dimaksud dengan "Bersyukur kepada Tuhan adalah wujud rasa terima kasih kita atas penyertaan dan berkat Tuhan"?',
  },
];

// --- 2. LOGIKA LOGIN ---
loginBtn.addEventListener("click", () => {
  studentName = document.getElementById("namaSiswa").value;
  studentClass = document.getElementById("kelasSiswa").value;
  const password = document.getElementById("password").value;
  const loginError = document.getElementById("login-error");

  if (studentName.trim() === "" || studentClass.trim() === "") {
    loginError.textContent = "Nama dan Kelas tidak boleh kosong.";
    return;
  }

  // Password di-hardcode sesuai permintaan
  if (password === "1234") {
    // Hapus kelas 'login-page' dari body untuk mematikan video bg
    document.body.classList.remove("login-page");

    document.getElementById("student-name-display").textContent = studentName;
    loginContainer.classList.remove("active");
    instructionsContainer.classList.add("active");
  } else {
    loginError.textContent = "Password salah. Silakan coba lagi.";
  }
});

// --- 3. LOGIKA MEMULAI UJIAN ---
startExamBtn.addEventListener("click", () => {
  // Cek belah layar (split screen) sebelum memulai
  if (
    window.innerHeight < screen.height * 0.8 ||
    window.innerWidth < screen.width * 0.8
  ) {
    alert(
      "UJIAN DIBATALKAN. Anda terdeteksi menggunakan belah layar (split-screen) atau browser tidak dimaksimalkan. Harap maksimalkan jendela browser Anda dan coba lagi."
    );
    return;
  }

  startExam();
});

function startExam() {
  // 1. Masuk ke mode Fullscreen
  document.documentElement.requestFullscreen().catch((err) => {
    alert(
      `Gagal masuk mode fullscreen. Ujian tidak bisa dimulai. Error: ${err.message}`
    );
    return;
  });

  // 2. Siapkan Soal
  mcqCount = mcqQuestions.length; // 35 soal
  // Gabungkan soal PG dan Esai
  allQuestions = [...mcqQuestions, ...essayQuestions];

  // !! FUNGSI ACAK DINONAKTIFKAN SESUAI PERMINTAAN !!
  // allQuestions = shuffleArray(allQuestions);

  userAnswers = new Array(allQuestions.length).fill(null);

  // 3. Tampilkan Halaman Ujian
  instructionsContainer.classList.remove("active");
  examContainer.classList.add("active");

  // 4. Mulai Timer
  startTimer();

  // 5. Tampilkan Soal Pertama
  displayQuestion(currentQuestionIndex);

  // 6. Pasang Detektor Kecurangan
  setupCheatDetection();
}

// Fungsi untuk mengacak array (Fisher-Yates Shuffle) - Tidak dipakai, tapi biarkan saja
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- 4. LOGIKA NAVIGASI SOAL ---
function displayQuestion(index) {
  const question = allQuestions[index];
  questionContainer.innerHTML = ""; // Bersihkan soal sebelumnya

  let html = `<div class="question-card">`;
  // Tampilkan nomor soal (misal: "Soal 1 dari 50")
  html += `<p class="question-text">Soal ${index + 1} dari ${
    allQuestions.length
  }<br><br>${question.question}</p>`;

  if (question.type === "mcq") {
    html += `<div class="options-container">`;
    question.options.forEach((option, i) => {
      const isSelected = userAnswers[index] === i;
      html += `
                <label class="option ${
                  isSelected ? "selected" : ""
                }" data-index="${i}">
                    <input type="radio" name="option" value="${i}" ${
        isSelected ? "checked" : ""
      }>
                    ${option}
                </label>
            `;
    });
    html += `</div>`;
  } else if (question.type === "essay") {
    const savedAnswer = userAnswers[index] || "";
    html += `<textarea class="essay-answer" placeholder="Ketik jawaban esai Anda di sini...">${savedAnswer}</textarea>`;
  }

  html += `</div>`;
  questionContainer.innerHTML = html;

  // Update tombol navigasi
  prevBtn.style.display = index === 0 ? "none" : "inline-block";
  nextBtn.style.display =
    index === allQuestions.length - 1 ? "none" : "inline-block";
  submitBtn.style.display =
    index === allQuestions.length - 1 ? "inline-block" : "none";

  // Tambahkan event listener untuk opsi MCQ
  if (question.type === "mcq") {
    document.querySelectorAll(".option").forEach((label) => {
      label.addEventListener("click", (e) => {
        // Hapus seleksi lama
        document
          .querySelectorAll(".option")
          .forEach((l) => l.classList.remove("selected"));
        // Tambah seleksi baru
        label.classList.add("selected");
        // Simpan jawaban
        userAnswers[index] = parseInt(label.dataset.index);
      });
    });
  } else {
    // Simpan jawaban esai saat diketik
    document.querySelector(".essay-answer").addEventListener("input", (e) => {
      userAnswers[index] = e.target.value;
    });
  }
}

prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < allQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
});

submitBtn.addEventListener("click", () => {
  const confirmSubmit = confirm("Apakah Anda yakin ingin menyelesaikan ujian?");
  if (confirmSubmit) {
    submitExam();
  }
});

// --- 5. LOGIKA TIMER ---
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Waktu habis! Ujian akan dikumpulkan secara otomatis.");
      submitExam();
    }
  }, 1000);
}

// --- 6. LOGIKA ANTI-CURANG ---
function setupCheatDetection() {
  // 1. Deteksi Pindah Tab / Minimize
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      handleCheat("Pindah Tab / Minimize");
    }
  });

  // 2. Deteksi Keluar Fullscreen
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      handleCheat("Keluar dari Mode Layar Penuh");
    }
  });
}

function handleCheat(reason) {
  if (cheatingDetected) return; // Hanya jalankan sekali

  cheatingDetected = true;
  cheatStatus = `Terdeteksi: ${reason}`;

  alert(
    `KECURANGAN TERDETEKSI!\n\nAlasan: ${reason}\nUjian Anda akan segera dihentikan dan dikumpulkan.`
  );

  submitExam();
}

// --- 7. LOGIKA SUBMIT UJIAN ---
function submitExam() {
  // Hentikan semua listener
  clearInterval(timer);
  document.removeEventListener("visibilitychange", () => {});
  document.removeEventListener("fullscreenchange", () => {});

  // Keluar dari fullscreen jika masih di dalam
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  // Hitung Skor
  let correctAnswers = 0;
  const totalMCQ = mcqCount; // 35

  // Pisahkan data untuk pengiriman
  let essayData = [];

  allQuestions.forEach((question, index) => {
    const userAnswer = userAnswers[index];

    if (question.type === "mcq") {
      if (userAnswer === question.answer) {
        correctAnswers++;
      }
    } else if (question.type === "essay") {
      essayData.push({
        type: "Esai",
        question: question.question,
        answer: userAnswer || "(Tidak Dijawab)",
      });
    }
  });

  const finalScore = (correctAnswers / totalMCQ) * 100;

  // Tampilkan Halaman Hasil
  examContainer.classList.remove("active");
  resultsContainer.classList.add("active");

  document.getElementById("student-name-final").textContent = studentName;
  document.getElementById("correct-score").textContent = correctAnswers;
  document.getElementById("total-questions").textContent = totalMCQ;
  document.getElementById("final-score").textContent = finalScore.toFixed(0);

  if (cheatingDetected) {
    const cheatMessage = document.getElementById("cheat-status-message");
    cheatMessage.textContent = `CATATAN: ${cheatStatus}. Skor Anda mungkin dibatalkan.`;
    cheatMessage.style.display = "block";
  }

  // Siapkan data untuk dikirim ke Google Sheet
  const scoreDataPayload = {
    correct: correctAnswers,
    total: totalMCQ,
    finalScore: finalScore.toFixed(0),
    cheatStatus: cheatStatus,
  };

  const fullPayload = {
    action: "submitExam",
    user: studentName,
    class: studentClass,
    scoreData: scoreDataPayload,
    essayData: essayData,
  };

  // Kirim data ke Google Apps Script
  // Nonaktifkan tombol untuk mencegah kirim ulang
  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim...";

  fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors", // Mode 'no-cors' diperlukan untuk GAS Web App
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fullPayload),
  }).catch((error) => {
    console.error("Error:", error);
    alert(
      "Gagal mengirim data. Harap screenshot hasil Anda dan kirim ke guru."
    );
  });
}
