function initNavToggle() {
    const toggleBtn = document.getElementById("nav-toggle-btn");
    const nav = document.querySelector("header nav");
    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", function () {
        nav.classList.toggle("nav-open");
    });
}

// Kolom yang dipakai sebagai "nama" data (default: kolom pertama).
// Bisa diubah lewat atribut data-kolom-nama pada <table>.
function getKolomNama(table) {
    return parseInt(table.dataset.kolomNama || "0", 10);
}

// Event delegation: tombol Hapus ada di baris yang dibuat setelah halaman dimuat
function initHapusConfirm() {
    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".button-hapus");
        if (!btn) return;

        const table = btn.closest("table");
        const row = btn.closest("tr");
        let nama = "data ini";
        if (row && table) {
            const cell = row.querySelectorAll("td")[getKolomNama(table)];
            if (cell) nama = cell.textContent.trim();
        }

        const yakin = confirm('Yakin ingin menghapus "' + nama + '"?');
        if (yakin && row) {
            row.remove();
            updateCounter();
        }
    });
}

function initTableFilter() {
    const input = document.getElementById("search-input");
    const table = document.querySelector(".table-responsive table");
    if (!input || !table) return;

    const kolom = getKolomNama(table);

    input.addEventListener("keyup", function () {
        const keyword = input.value.toLowerCase();
        const rows = table.querySelectorAll("tbody tr:not(.row-pesan)");
        rows.forEach(function (row) {
            const cell = row.querySelectorAll("td")[kolom];
            const teks = cell ? cell.textContent.toLowerCase() : "";
            row.style.display = teks.includes(keyword) ? "" : "none";
        });
        updateCounter();
    });
}

function tampilkanError(input, pesan) {
    hapusError(input);
    const span = document.createElement("span");
    span.className = "error";
    span.textContent = pesan;
    input.insertAdjacentElement("afterend", span);
}

function hapusError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error")) {
        next.remove();
    }
}

function updateCounter() {
    const table = document.querySelector(".table-responsive table");
    const infoArea = document.getElementById("table-info");
    if (!table || !infoArea) return;

    const rows = table.querySelectorAll("tbody tr:not(.row-pesan)");
    let visibleRows = 0;

    rows.forEach(function (row) {
        if (row.style.display !== "none") visibleRows++;
    });

    const label = infoArea.dataset.label || "buku";
    infoArea.textContent = `Menampilkan ${visibleRows} dari ${rows.length} ${label}`;
}

function initValidasiForm() {
    const form = document.getElementById("form-tambah");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        let valid = true;

        const fieldWajib = [
            { selector: "[name='judul']", pesan: "Judul wajib diisi." },
            { selector: "[name='nama']", pesan: "Nama wajib diisi." },
            { selector: "[name='pengarang']", pesan: "Pengarang wajib diisi." },
            { selector: "[name='no_anggota']", pesan: "No. Anggota wajib diisi." }
        ];

        fieldWajib.forEach(function (item) {
            const elemen = form.querySelector(item.selector);
            if (!elemen) return;
            if (elemen.value.trim() === "") {
                tampilkanError(elemen, item.pesan);
                valid = false;
            } else {
                hapusError(elemen);
            }
        });

        const tahun = form.querySelector("[name='tahun']");
        if (tahun) {
            const tahunIni = new Date().getFullYear();
            const nilai = parseInt(tahun.value, 10);
            if (isNaN(nilai) || nilai < 1900 || nilai > tahunIni) {
                tampilkanError(tahun, "Tahun harus di antara 1900-" + tahunIni + ".");
                valid = false;
            } else {
                hapusError(tahun);
            }
        }

        const stok = form.querySelector("[name='stok']");
        if (stok) {
            const nilai = parseInt(stok.value, 10);
            if (isNaN(nilai) || nilai < 0) {
                tampilkanError(stok, "Stok tidak boleh negatif.");
                valid = false;
            } else {
                hapusError(stok);
            }
        }

        const isbn = form.querySelector("[name='isbn']");
        if (isbn) {
            if (isbn.value.trim() !== "" && !/^[0-9-]+$/.test(isbn.value)) {
                tampilkanError(isbn, "ISBN hanya boleh berisi angka dan tanda hubung.");
                valid = false;
            } else {
                hapusError(isbn);
            }
        }

        if (!valid) {
            e.preventDefault();
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initHapusConfirm();
    initTableFilter();
    initValidasiForm();
    updateCounter();
});