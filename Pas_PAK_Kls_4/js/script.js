/*
 * ============================================
 * SCRIPT LOGIKA UJIAN - KELAS 4
 * ============================================
 * Berisi 30 Soal PG dan 15 Soal Esai/Isian
 * Sumber: ASAS_PAK_KLS_4_SEM_1_(TP._2024-2025)_edit_dup[1].dot
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
let mcqCount = 0;

// --- 1. DATABASE SOAL (KELAS 4) ---

// SOAL PILIHAN GANDA (30 Soal)
const mcqQuestions = [
  {
    type: "mcq",
    question:
      "1. Kisah penciptaan Allah atas manusia tertulis di dalam kitab … .",
    options: [
      "a. Kejadian 1:1-5",
      "b. Kejadian 1:6-10",
      "c. Kejadian 1:26-27",
      "d. Kejadian 1:28-29",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "2. Meskipun secara jasmani penampilan laki-laki dan perempuan berbeda, tetapi Allah … .",
    options: [
      "a. membedakan berkat-Nya",
      "b. tidak pernah membeda-bedakan",
      "c. menempatkan laki-laki lebih tinggi",
      "d. memandang perempuan lebih rendah",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "3. Perhatikan pernyataan-pernyataan di bawah ini!<br>  1) Berkuasalah atas langit dan bumi.<br>  2) Jagalah alam yang sudah Aku ciptakan.<br>  3) Beranakcuculah dan bertambah banyaklah.<br>  4) Penuhilah bumi dan takhlukkanlah itu.<br><br>Berkat Tuhan kepada manusia, ditunjukkan oleh pernyataan nomor … .",
    options: ["a. 1) dan 2)", "b. 1) dan 3)", "c. 2) dan 3)", "d. 3) dan 4)"],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question:
      "4. Sebagai siswa laki-laki, di sekolah saya akan bersikap sopan kepada … .",
    options: [
      "a. guru laki-laki",
      "b. karyawan laki-laki",
      "c. teman laki-laki",
      "d. semua guru, karyawan dan teman",
    ],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question:
      "5. Di kelas, antara laki-laki dan perempuan memiliki kesempatan yang sama untuk … .",
    options: [
      "a. disayangi guru dan orang tua",
      "b. bermain dan melihat acara TV",
      "c. belajar dan menjadi pengurus kelas",
      "d. belajar dan makan sampai kenyang",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "6. Daud mengakui bahwa penciptaan Tuhan atas dirinya adalah peristiwa yang … .",
    options: ["a. biasa", "b. lucu", "c. ajaib", "d. aneh"],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "7. Perhatikan pernyataan-pernyataan di bawah ini!<br>  1) Setiap pagi ibu bangun dan menyiapkan sarapan untuk semua anggota keluarga.<br>  2) Ayah bekerja keras untuk mencukupi kebutuhan keluarga.<br>  3) Sebelum berangkat ke kantor, ayah selalu sarapan.<br>  4) Setelah semua pekerjaan rumah selesai, ibu beristirahat.<br><br>Bukti pemeliharaan Allah melalui orang tua ditunjukkan oleh pernyataan nomor … .",
    options: ["a. 1) dan 2)", "b. 1) dan 3)", "c. 2) dan 3)", "d. 3) dan 4)"],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question:
      "8. Ketika kita sedang sakit, Tuhan memelihara kita dengan memberikan … .",
    options: [
      "a. makanan yang enak-enak",
      "b. mainan yang lucu",
      "c. kekuatan dan kesembuhan",
      "d. perhatian yang besar",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "9. Ketika kita gagal dalam ulangan, Tuhan memelihara dengan memberikan … .",
    options: [
      "a. waktu yang panjang untuk menyalin contekan",
      "b. cara yang baik agar tidak ketahuan ketika menyontek",
      "c. waktu yang tepat agar kita istirahat dulu",
      "d. semangat untuk giat belajar",
    ],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question:
      '10. Yeremia 29:11 berbunyi, "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan … dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan".',
    options: [
      "a. damai sejahtera",
      "b. adil sentosa",
      "c. kasih dan karunia",
      "d. sukacita penuh",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question: "11. Tuhan memelihara semua anak-anak karena … .",
    options: [
      "a. anak-anak sangat manis dan lucu",
      "b. Tuhan sungguh mengasihi anak-anak",
      "c. anak-anak adalah berkat bagi dunia",
      "d. Tuhan Maha Kuasa",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "12. Ajaran Tuhan Yesus yang tertulis dalam kitab Matius 5-7, diberi judul … .",
    options: [
      "a. Perumpamaan Anak yang Hilang",
      "b. Hal Kerajaan Sorga",
      "c. Khotbah di Atas Bukit",
      "d. Ajaran Masuk Sorga",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question: "13. Burung pipit di udara bisa makan setiap hari karena … .",
    options: [
      "a. dipelihara orang",
      "b. diberi makan oleh petani",
      "c. memiliki tanaman sendiri",
      "d. dipelihara oleh Tuhan",
    ],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question:
      "14. Perhatikan beberapa hal di bawah ini!<br>  1) Rumah dan makanan.<br>  2) Pengampunan dan damai sejahtera.<br>  3) Keselamatan dan kekuatan iman.<br>  4) Mobil dan sepeda motor.<br><br>Tuhan mencukupi kebutuhan rohani manusia, misalnya … .",
    options: ["a. 1) dan 2)", "b. 1) dan 3)", "c. 2) dan 3)", "d. 3) dan 4)"],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "15. Perhatikan pernyataan-pernyataan di bawah ini!<br>  1) Setiap minggu persembahan dengan uang yang banyak.<br>  2) Setiap hari pergi ke gereja.<br>  3) Tekun membaca Alkitab dan berdoa.<br>  4) Taat kepada orang tua dan guru.<br><br>Syukur kepada Tuhan atas pemeliharaan-Nya, dapat kita nyatakan melalui pernyataan nomor … .",
    options: ["a. 1) dan 2)", "b. 1) dan 3)", "c. 2) dan 3)", "d. 3) dan 4)"],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question: "16. Ketika serigala datang hendak memangsa dombanya, Daud … .",
    options: [
      "a. lari pulang ke rumahnya",
      "b. meminta bantuan kakak-kakaknya",
      "c. bersembunyi bersama domba-dombanya",
      "d. melawan dan membunuhnya",
    ],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question:
      "17. Perhatikan pernyataan-pernyataan di bawah ini!<br>  1) Daud menggiring domba-dombanya ke padang, lalu pulang.<br>  2) Daud membawa domba-dombanya ke air yang segar.<br>  3) Daud mencari dombanya yang tersesat sampai ditemukan.<br>  4) Saat domba-dombanya berbaring, Daud juga tidur.<br><br>Sikap gembala yang baik ditunjukkan Daud melalui pernyataan nomor … .",
    options: ["a. 1) dan 2)", "b. 1) dan 3)", "c. 2) dan 3)", "d. 3) dan 4)"],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "18. Daud menggambarkan Tuhan sebagai gembala, dan dombanya adalah … .",
    options: [
      "a. domba-domba miliknya",
      "b. manusia percaya",
      "c. orang tuanya",
      "d. teman-temannya",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "19. Daud melawan serigala yang hendak memangsa dombanya dengan … .",
    options: ["a. panah", "b. pistol", "c. tombak", "d. gada"],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question:
      "20. Mazmur 23 menunjukkan bahwa Tuhan memelihara umat-Nya seperti seorang gembala yang memelihara domba-dombanya. Pemeliharaan ini ditunjukkan dengan Tuhan menuntun umat-Nya ke ... .",
    options: [
      "a. padang gurun",
      "b. padang rumput yang hijau",
      "c. lembah yang gelap",
      "d. sungai yang deras",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question: "21. Dalam hukum kasih, ada dua hal yang penting, yaitu … .",
    options: [
      "a. mengasihi Allah dan mengasihi sesama",
      "b. mengasihi sesama dengan segenap jiwa dan raga",
      "c. mengasihi orang tua dan sesama dengan tulus",
      "d. mengasihi diri sendiri dan orang tua seperti Tuhan",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question: "22. Orang Farisi menjumpai Tuhan Yesus dengan tujuan untuk … .",
    options: [
      "a. menjadi murid Yesus yang setia",
      "b. mencobai dan menjatuhkan Tuhan Yesus",
      "c. berdiskusi tentang Hukum Taurat",
      "d. bergabung dalam mengajarkan agama",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question: "23. Tujuan orang Farisi belajar Hukum Taurat adalah … .",
    options: [
      "a. menerapkannya dalam hidup sehari-hari",
      "b. memamerkan kesalehan dan mendapat pujian",
      "c. menolong orang-orang miskin dan tertindas",
      "d. memahami cinta kasih Tuhan secara lebih mendalam",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "24. Dalam memahami konsep dasar kasih, yang harus sejalan adalah … .",
    options: [
      "a. kehendak sendiri dan kehendak orang lain",
      "b. kepentingan pribadi dan kepentingan umum",
      "c. pikiran, perkataan dan tindakan",
      "d. perkataan, kenyataan dan kekayaan",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "25. Kasih tidak hanya memberi secara materi, tetapi juga memberi dengan … .",
    options: ["a. jiwa", "b. hati", "c. nyawa", "d. raga"],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question: "26. Hidup rukun harus kita wujudkan di … .",
    options: [
      "a. keluarga, sekolah dan masyarakat",
      "b. rumah, keluarga, dan gereja",
      "c. sekolah, rumah, dan keluarga",
      "d. gereja, sekolah dan masyarakat",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question:
      "27. Sikap mengalah Ishak membuat gembala-gembala di Gerar menjadi … .",
    options: [
      "a. emosinya mereda",
      "b. semakin marah",
      "c. tersinggung",
      "d. semakin tertindas",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question: "28. Janggut Harun merupakan symbol … .",
    options: [
      "a. kewibawaan",
      "b. kemenangan",
      "c. kemakmuran",
      "d. kesuburan",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question:
      "29. Mazmur 133:3 berbunyi, “Seperti embun gunung Hermon, yang turun ke atas … .”",
    options: [
      "a. seluruh Yerusalem",
      "b. gunung-gunung Sion",
      "c. bukit Zaitun",
      "d. gunung Horeb",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "30. Perhatikan pernyataan-pernyataan di bawah ini!<br>  1) Kekayaan dan kemakmuran bagi umat Israel.<br>  2) Kewibawaan Harun dan kesatuan umat Israel.<br>  3) Kedamaian dan kesejukan dari Tuhan.<br>  4) Kemenangan dan kehormatan umat Israel.<br><br>Berkat Tuhan menurut Mazmur 133 ditunjukkan oleh pernyataan nomor … .",
    options: ["a. 1) dan 2)", "b. 1) dan 3)", "c. 2) dan 3)", "d. 3) dan 4)"],
    answer: 2, // Kunci Jawaban C
  },
];

// SOAL ISIAN DAN ESAI (15 Soal)
const essayQuestions = [
  // Bagian Isian Singkat
  {
    type: "essay",
    question:
      "1. (Isian) Manusia disebut sebagai makkota ciptaan karena diciptakan … dan … dengan Allah.",
  },
  {
    type: "essay",
    question:
      "2. (Isian) Karena memiliki martabat & derajat yang sama, antara laki-laki dan perempuan harus saling … .",
  },
  {
    type: "essay",
    question:
      "3. (Isian) Allah tidak hanya menciptakan manusia, namun juga … .",
  },
  {
    type: "essay",
    question: "4. (Isian) Sandang, pangan dan papan disebut kebutuhan … .",
  },
  {
    type: "essay",
    question:
      "5. (Isian) Tuhan memberikan apa yang kita … bukan yang kita ... .",
  },
  {
    type: "essay",
    question:
      "6. (Isian) Ketika Daud menggembalakan domba, ia sering memuji Tuhan melalui … .",
  },
  {
    type: "essay",
    question: "7. (Isian) Daud melindungi dombanya dari serangan … .",
  },
  {
    type: "essay",
    question:
      "8. (Isian) Apabila teman mengingkari janji, kita tidak suka. Oleh sebab itu, jika kita berjanji juga harus … .",
  },
  {
    type: "essay",
    question: "9. (Isian) Dalam mengasihi, kita tidak boleh … .",
  },
  {
    type: "essay",
    question:
      "10. (Isian) Membeda-bedakan agama dan suku dapat memicu timbulnya … .",
  },
  // Bagian Esai
  {
    type: "essay",
    question:
      "11. (Esai) Apa pendapatmu tentang anggapan bahwa ketua kelas harus selalu laki-laki? Jelaskan jawabanmu!",
  },
  {
    type: "essay",
    question:
      "12. (Esai) Sebutkan 2 contoh bentuk pemeliharaan Tuhan yang kamu alami dalam hidupmu!",
  },
  {
    type: "essay",
    question:
      "13. (Esai) Sebutkan 2 sikap yang dapat kamu tunjukkan sebagai respons terhadap pemeliharaan Tuhan dalam hidupmu!",
  },
  {
    type: "essay",
    question: "14. (Esai) Sebutkan bunyi hukum kasih yang kedua!",
  },
  {
    type: "essay",
    question:
      "15. (Esai) Sebutkan 2 upaya yang dapat dilakukan untuk menjaga kerukunan di sekolah!",
  },
];
// [end of cite: 1]

// --- 2. LOGIKA LOGIN ---
// (Kode ini sama persis dengan Kelas 6 & 5)
loginBtn.addEventListener("click", () => {
  studentName = document.getElementById("namaSiswa").value;
  studentClass = document.getElementById("kelasSiswa").value;
  const password = document.getElementById("password").value;
  const loginError = document.getElementById("login-error");

  if (studentName.trim() === "" || studentClass.trim() === "") {
    loginError.textContent = "Nama dan Kelas tidak boleh kosong.";
    return;
  }

  // Password di-hardcode (bisa Anda ubah per kelas jika mau)
  if (password === "1234") {
    document.body.classList.remove("login-page");
    document.getElementById("student-name-display").textContent = studentName;
    loginContainer.classList.remove("active");
    instructionsContainer.classList.add("active");
  } else {
    loginError.textContent = "Password salah. Silakan coba lagi.";
  }
});

// --- 3. LOGIKA MEMULAI UJIAN ---
// (Kode ini sama persis dengan Kelas 6 & 5)
startExamBtn.addEventListener("click", () => {
  if (
    window.innerHeight < screen.height * 0.8 ||
    window.innerWidth < screen.width * 0.8
  ) {
    alert(
      "UJIAN DIBATALKAN. Anda terdeteksi menggunakan belah layar (split-screen)."
    );
    return;
  }
  startExam();
});

function startExam() {
  document.documentElement.requestFullscreen().catch((err) => {
    alert(
      `Gagal masuk mode fullscreen. Ujian tidak bisa dimulai. Error: ${err.message}`
    );
    return;
  });

  mcqCount = mcqQuestions.length; // Hitung jumlah soal PG (30)
  allQuestions = [...mcqQuestions, ...essayQuestions]; // Gabungkan (total 45 soal)
  userAnswers = new Array(allQuestions.length).fill(null);

  instructionsContainer.classList.remove("active");
  examContainer.classList.add("active");

  startTimer();
  displayQuestion(currentQuestionIndex);
  setupCheatDetection();
}

// --- 4. LOGIKA NAVIGASI SOAL ---
// (Kode ini sama persis dengan Kelas 6 & 5)
function displayQuestion(index) {
  const question = allQuestions[index];
  questionContainer.innerHTML = "";

  let html = `<div class="question-card">`;
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
    html += `<textarea class="essay-answer" placeholder="Ketik jawaban Anda di sini...">${savedAnswer}</textarea>`;
  }

  html += `</div>`;
  questionContainer.innerHTML = html;

  prevBtn.style.display = index === 0 ? "none" : "inline-block";
  nextBtn.style.display =
    index === allQuestions.length - 1 ? "none" : "inline-block";
  submitBtn.style.display =
    index === allQuestions.length - 1 ? "inline-block" : "none";

  if (question.type === "mcq") {
    document.querySelectorAll(".option").forEach((label) => {
      label.addEventListener("click", (e) => {
        document
          .querySelectorAll(".option")
          .forEach((l) => l.classList.remove("selected"));
        label.classList.add("selected");
        userAnswers[index] = parseInt(label.dataset.index);
      });
    });
  } else {
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
// (Kode ini sama persis dengan Kelas 6 & 5)
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
// (Kode ini sama persis dengan Kelas 6 & 5)
function setupCheatDetection() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      handleCheat("Pindah Tab / Minimize");
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      handleCheat("Keluar dari Mode Layar Penuh");
    }
  });
}

function handleCheat(reason) {
  if (cheatingDetected) return;
  cheatingDetected = true;
  cheatStatus = `Terdeteksi: ${reason}`;
  alert(
    `KECURANGAN TERDETEKSI!\n\nAlasan: ${reason}\nUjian Anda akan segera dihentikan.`
  );
  submitExam();
}

// --- 7. LOGIKA SUBMIT UJIAN ---
// (Kode ini sama persis dengan Kelas 6 & 5)
function submitExam() {
  clearInterval(timer);
  document.removeEventListener("visibilitychange", () => {});
  document.removeEventListener("fullscreenchange", () => {});

  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  let correctAnswers = 0;
  const totalMCQ = mcqCount; // 30
  let essayData = [];

  allQuestions.forEach((question, index) => {
    const userAnswer = userAnswers[index];

    if (question.type === "mcq") {
      if (userAnswer === question.answer) {
        correctAnswers++;
      }
    } else if (question.type === "essay") {
      essayData.push({
        type: "Esai/Isian",
        question: question.question,
        answer: userAnswer || "(Tidak Dijawab)",
      });
    }
  });

  const finalScore = (correctAnswers / totalMCQ) * 100;

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

  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim...";

  fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
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
