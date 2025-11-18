/*
 * ============================================
 * SCRIPT LOGIKA UJIAN - KELAS 5
 * ============================================
 * Berisi 25 Soal PG dan 5 Soal Esai
 * Sumber: ASAS_PAK_Ganjil_Kelas_5_(24-25)_edit_dup[1].doc
 */

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!           MASUKKAN URL APLIKASI WEB ANDA DI SINI            !!
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

// --- 1. DATABASE SOAL (KELAS 5) ---
//
const mcqQuestions = [
  {
    type: "mcq",
    question:
      "1. Keluarga Kristen akan mengajarkan pendidikan bagi anggota keluarganya sesuai dengan nilai-nilai ... .",
    options: [
      "a. ajaran Kristiani",
      "b. kemanusiaan",
      "c. budaya",
      "d. Pancasila",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question:
      "2. Di bawah ini merupakan contoh belajar yang bisa merubah pikiran yaitu dari ... .",
    options: [
      "a. belum bisa membaca menjadi bisa",
      "b. bersikap rendah diri menjadi berani",
      "c. pemarah menjadi penyabar",
      "d. sifat egois menjadi suka berteman",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question:
      "3. Suatu hari temanku mengajak untuk bermain game online tanpa berhenti, maka yang seharusnya aku katakan padanya adalah ... .",
    options: [
      "a. Mari kita bermain, tapi jangan ketahuan orang, ya",
      "b. Mari kita bermain, tapi jika menang, dibayar ya",
      "c. Aku tidak mau karena aku tidak punya hp",
      "d. Aku tidak mau karena harus menyelesaikan PR",
    ],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question: "4. Sekolah tempat kita belajar merupakan pendidikan ... .",
    options: ["a. non formal", "b. formal", "c. swasta", "d. negeri"],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "5. Nilai-nilai Kristiani diajarkan di sekolah untuk melatih hidup sesuai dengan ajaran ... .",
    options: [
      "a. pendidikan orang tua",
      "b. ajaran bapak pendeta",
      "c. iman kristen",
      "d. ajaran gereja",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "6. Menerapkan nilai-nilai Kristiani dari sikap berbudi luhur, contohnya adalah... .",
    options: [
      "a. Saya hanya akan menolong teman yang pernah menolong saya",
      "b. Saya akan bermain dengan teman yang kusukai",
      "c. Saya akan membantu teman yang sedang sendirian merawat neneknya",
      "d. Saya akan menanyakan, jika belum memahami penjelasan guru",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "7. Allah memelihara seluruh ciptaan-Nya, termasuk manusia dengan ... .",
    options: [
      "a. sepenuh hati",
      "b. semangat yang tinggi",
      "c. cinta kasih-Nya",
      "d. sungguh-sungguh",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "8. Allah adalah satu-satunya pemelihara hidup manusia, buktinya ketika kita sedang lemah, Ia memberi ... .",
    options: ["a. kekuatan", "b. kemakmuran", "c. kelebihan", "d. kekayaan"],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question:
      "9. Allah memelihara hidupku dengan cara menumbuhkan tanaman di sekitarku, yang akan aku lakukan adalah ... .",
    options: [
      "a. menjaga tanaman agar tidak bisa dicabut orang",
      "b. menjaga dan merawat alam sekitarku",
      "c. memberi pupuk tanaman terus-menerus",
      "d. mengairi tanaman terus-menerus",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "10. Latar belakang keputusan Allah untuk mengutus anak-Nya yang tunggal yaitu Yesus datang ke dunia adalah ... .",
    options: [
      "a. manusia pertama sudah berbuat dosa",
      "b. Kasih Allah yang begitu besar kepada manusia agar tidak binasa",
      "c. Kasih Allah kepada Adam dan Hawa",
      "d. Adam dan Hawa melanggar kehendak Allah",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "11. Yesus Kristus telah lahir menyelamatkan kita dari dosa. Sikap yang paling tepat dilakukan agar kita tidak jatuh dalam dosa adalah ... .",
    options: [
      "a. taat melakukan perintah Tuhan setiap saat",
      "b. menjauhi teman yang tidak jujur",
      "c. bergaul dengan teman yang baik",
      "d. waspada agar tidak tergoda ajakan teman melanggar peraturaan sekolah",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question:
      "12. Setiap orang yang percaya kepada Tuhan Yesus tidak binasa, tetapi memperoleh hidup yang ... .",
    options: ["a. damai", "b. kekal", "c. aman", "d. tentram"],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question: "13. Dosa membuat hubungan manusia dengan Allah menjadi ... .",
    options: ["a. putus", "b. panas", "c. pecah", "d. pulih"],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question:
      "14. Setiap orang yang menyesali dosanya, bertobat, dan memohon pengampunan dosa, maka Tuhan akan ... dirinya.",
    options: ["a. mengetahui", "b. menebus", "c. mengingat", "d. memahami"],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "15. Pengampunan yang diberikan Tuhan Yesus kepada kita, hendaknya bisa mendorong untuk mau ... sesama.",
    options: [
      "a. menghargai",
      "b. memperhatikan",
      "c. mengampuni",
      "d. mengerti",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "16. Perubahan sikap seseorang kepada hal yang tidak benar, bisa terjadi jika seseorang tidak ... perintah Allah",
    options: ["a. melihat", "b. menaati", "c. mengingat", "d. menghafal"],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question: "17. Di bawah ini merupakan contoh hidup dalam kekudusan ... .",
    options: [
      "a. mempersilahkan duduk pada tamu",
      "b. menyontek pekerjaan teman",
      "c. menyerobot antrian",
      "d. mengambil barang orang lain",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question:
      "18. Perhatikan pernyataan di bawah ini!<br>  1. Beranjang sana<br>  2. Berdamai dengan semua orang<br>  3. Perbuatan marah, geram, kejahatan<br>  4. Kata kata kotor yang keluar dari mulut<br>  5. Berdusta<br><br>Ciri- ciri manusia lama menurut Kolose 3: 8-9 adalah ... .",
    options: [
      "a. 1, 2 dan 3",
      "b. 1, 3 dan 4",
      "c. 2, 4 dan 5",
      "d. 3, 4 dan 5",
    ],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question:
      "19. Aku sudah menjadi manusia baru karena aku sudah hidup baru sesuai dengan ... .",
    options: [
      "a. kehendak Tuhan",
      "b. kemauanku sendiri",
      "c. kemauan orang tua",
      "d. pengarahan bapak ibu guru",
    ],
    answer: 0, // Kunci Jawaban A
  },
  {
    type: "mcq",
    question: "20. Dengan rajin berdoa maka aku semakin ... .",
    options: [
      "a. mengagumi kelebihan hidupku",
      "b. merasakan kasih Tuhan",
      "c. mengasihi diriku sendiri",
      "d. mengingat jasa orang tuaku",
    ],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "21. Kita harus mengasihi Tuhan dengan segenap hati sesuai dengan Kitab Ulangan 6: 4-9 yang diajarkan oleh Nabi … .",
    options: ["a. Daud", "b. Musa", "c. Yoel", "d. Amos"],
    answer: 1, // Kunci Jawaban B
  },
  {
    type: "mcq",
    question:
      "22. Mempunyai banyak teman, jika menemui kesulitan akan mudah … .",
    options: [
      "a. dibicarakan",
      "b. dilaporkan",
      "c. diselesaikan",
      "d. dipikirkan",
    ],
    answer: 2, // Kunci Jawaban C
  },
  {
    type: "mcq",
    question:
      "23. Agar sembuh, Naaman harus mandi sebanyak 7 kali di sungai … .",
    options: ["a. Kerit", "b. Nil", "c. Efrat", "d. Yordan"],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question: "24. Kebangkitan Tuhan Yesus membuktikan bahwa … .",
    options: [
      "a. banyak orang akan merasa heran",
      "b. sebuah harapan baru akan datang",
      "c. semua orang akan mengalami mati",
      "d. kuasa dosa sudah dikalahkan",
    ],
    answer: 3, // Kunci Jawaban D
  },
  {
    type: "mcq",
    question: "25. Hidup lama adalah hidup yang dikuasai … .",
    options: ["a. keinginan", "b. kemauan", "c. darah", "d. dosa"],
    answer: 3, // Kunci Jawaban D
  },
];

const essayQuestions = [
  {
    type: "essay",
    question: "1. Sebutkan 5 sikap orang tua yang bisa kamu teladani!",
  },
  {
    type: "essay",
    question: "2. Mengapa manusia perlu bersosialisasi dengan orang lain!",
  },
  {
    type: "essay",
    question: "3. Jelaskan yang dimaksud Allah memelihara hidup manusia!",
  },
  {
    type: "essay",
    question:
      "4. Sebutkan nilai-nilai yang diajarkan di sekolah untuk dilakukan para siswa!",
  },
  {
    type: "essay",
    question: "5. Sebutkan 5 hal cara hidup yang berkenan kepada Tuhan!",
  },
];
// [end of cite: 1]

// --- 2. LOGIKA LOGIN ---
// (Kode ini sama persis dengan Kelas 6)
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
// (Kode ini sama persis dengan Kelas 6)
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

  mcqCount = mcqQuestions.length; // Hitung jumlah soal PG (25)
  allQuestions = [...mcqQuestions, ...essayQuestions]; // Gabungkan (total 30 soal)
  userAnswers = new Array(allQuestions.length).fill(null);

  instructionsContainer.classList.remove("active");
  examContainer.classList.add("active");

  startTimer();
  displayQuestion(currentQuestionIndex);
  setupCheatDetection();
}

// --- 4. LOGIKA NAVIGASI SOAL ---
// (Kode ini sama persis dengan Kelas 6)
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
    html += `<textarea class="essay-answer" placeholder="Ketik jawaban esai Anda di sini...">${savedAnswer}</textarea>`;
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
// (Kode ini sama persis dengan Kelas 6)
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
// (Kode ini sama persis dengan Kelas 6)
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
// (Kode ini sama persis dengan Kelas 6, tapi perhitungan skor akan otomatis)
function submitExam() {
  clearInterval(timer);
  document.removeEventListener("visibilitychange", () => {});
  document.removeEventListener("fullscreenchange", () => {});

  if (document.fullscreenElement) {
    document.exitFullscreen();
  }

  let correctAnswers = 0;
  const totalMCQ = mcqCount; // 25
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
