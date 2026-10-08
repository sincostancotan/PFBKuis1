/*
  REVIEW JAVASCRIPT — validasi form register (tanpa regex, tanpa "required")

  ALUR:
  1. Ambil elemen (document.getElementById)
  2. Pasang event "submit" di form (addEventListener)
  3. Di handler: event.preventDefault() -> cegah form terkirim/reload dulu
  4. Jalankan 1 fungsi validasi per field; masing-masing return "" (valid) atau pesan error
  5. Kalau SEMUA valid -> tampilkan sukses; kalau ada yang salah -> tampilkan pesan error di bawah field

  KONSEP:
  - DOM        : pohon elemen HTML yang bisa dibaca/diubah JS
  - .value     : isi input (selalu STRING)
  - .trim()    : buang spasi di awal/akhir (agar "    " dianggap kosong)
  - .length    : panjang string
  - .checked   : status checkbox/radio (true/false)
  - const/let  : const = tidak diassign ulang, let = boleh berubah
*/

// ===== 1. AMBIL ELEMEN =====
const form = document.getElementById("registerForm");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const dob = document.getElementById("dob");
const terms = document.getElementById("terms");
const successMessage = document.getElementById("successMessage");

// ===== 2. FUNGSI VALIDASI: return string pesan error, atau "" kalau valid =====

function validateUsername() {
    const value = username.value.trim();
    if (value === "") return "Username must not be empty.";
    if (value.length < 4) return "Username must be at least 4 characters long.";
    return "";
}

// Email tanpa regex: cek aturan satu per satu pakai method string.
function validateEmail() {
    const value = email.value;                  // TIDAK di-trim: spasi di email harus dianggap salah
    if (value === "") return "Email must not be empty.";
    if (value.indexOf(" ") !== -1) return "Email must not contain spaces.";     // indexOf = -1 -> tidak ditemukan
    if (value.startsWith("@") || value.startsWith(".")) return "Email must not start with '@' or '.'.";
    if (value.endsWith(".")) return "Email must not end with '.'.";

    const at = value.indexOf("@");              // posisi '@' pertama
    if (at === -1) return "Email must contain '@'.";

    const dot = value.lastIndexOf(".");         // posisi '.' terakhir
    if (dot === -1 || dot < at) return "Email must contain '.' after '@'.";
    if (dot - at < 2) return "Email must have at least one character between '@' and '.'.";  // contoh a@.com salah

    return "";
}

function validatePassword() {
    const value = password.value;
    if (value === "") return "Password must not be empty.";
    if (value.length < 6) return "Password must be at least 6 characters long.";
    return "";
}

function validateConfirmPassword() {
    const value = confirmPassword.value;
    if (value === "") return "Confirm password must not be empty.";
    if (value !== password.value) return "Confirm password must match the password.";   // !== beda nilai/tipe
    return "";
}

// "Older than 13": tanggal lahir harus SEBELUM (hari ini - 13 tahun).
function validateDob() {
    if (dob.value === "") return "Date of birth must be filled.";

    const birth = new Date(dob.value);          // string "YYYY-MM-DD" -> objek Date
    const limit = new Date();                   // sekarang
    limit.setFullYear(limit.getFullYear() - 13);// mundur 13 tahun

    if (birth >= limit) return "You must be older than 13 years old.";   // Date bisa dibandingkan dengan < >
    return "";
}

// Radio: tidak ada .value tunggal untuk grup -> cek setiap radio, ada yang .checked?
function validateGender() {
    const radios = document.getElementsByName("gender");    // kumpulan elemen ber-name sama
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) return "";
    }
    return "Please select your gender.";
}

function validateTerms() {
    if (!terms.checked) return "You must agree to the Terms and Conditions.";    // ! = NOT
    return "";
}

// ===== 3. HELPER TAMPILAN =====
// Tulis pesan ke <small id="...Error"> & beri/hapus class .invalid pada input.
function showError(fieldId, message) {
    document.getElementById(fieldId + "Error").textContent = message;   // textContent aman (bukan innerHTML)
    const input = document.getElementById(fieldId);
    if (input) {                                                        // gender tak punya id sendiri -> skip
        if (message === "") input.classList.remove("invalid");
        else input.classList.add("invalid");
    }
}

// ===== 4. EVENT SUBMIT =====
form.addEventListener("submit", function (event) {
    event.preventDefault();                     // cegah submit default (halaman reload)

    // Jalankan SEMUA validasi (bukan berhenti di error pertama) supaya semua pesan muncul sekaligus.
    const results = {
        username: validateUsername(),
        email: validateEmail(),
        password: validatePassword(),
        confirmPassword: validateConfirmPassword(),
        dob: validateDob(),
        gender: validateGender(),
        terms: validateTerms()
    };

    let allValid = true;
    for (const field in results) {              // for...in: loop setiap key objek
        showError(field, results[field]);
        if (results[field] !== "") allValid = false;
    }

    if (allValid) {
        successMessage.textContent = "Registration successful! Welcome to hamstlOVer.";
        form.reset();                           // kosongkan form
    } else {
        successMessage.textContent = "";
    }
});
