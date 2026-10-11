const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function escapeHtml(teks) {
    const div = document.createElement("div");
    div.textContent = teks;
    return div.innerHTML;
}

function pesanTabel(tbody, pesan) {
    tbody.innerHTML =
        '<tr class="row-pesan"><td colspan="5">' + escapeHtml(pesan) + "</td></tr>";
}

function renderBuku(tbody, daftarBuku) {
    if (daftarBuku.length === 0) {
        pesanTabel(tbody, "Belum ada data buku.");
        return;
    }

    tbody.innerHTML = daftarBuku
        .map(function (buku) {
            return `
                <tr>
                    <td>${escapeHtml(buku.judul)}</td>
                    <td>${escapeHtml(buku.pengarang)}</td>
                    <td>${buku.tahun}</td>
                    <td>${buku.stok}</td>
                    <td>
                        <button type="button" class="button-edit">Edit</button>
                        <button type="button" class="button-detail">Detail</button>
                        <button type="button" class="button-hapus">Hapus</button>
                    </td>
                </tr>`;
        })
        .join("");
}

async function muatBuku() {
    const tbody = document.querySelector(".table-responsive tbody");
    const loading = document.getElementById("loading-indicator");
    if (!tbody) return;

    if (loading) loading.hidden = false;

    try {
        await delay(600); // simulasi latensi jaringan
        const response = await fetch("../data/buku.json");
        if (!response.ok) {
            throw new Error("Server merespons dengan status " + response.status);
        }
        const data = await response.json();
        renderBuku(tbody, data);
    } catch (error) {
        console.error(error);
        pesanTabel(tbody, "Gagal memuat data buku: " + error.message);
    } finally {
        if (loading) loading.hidden = true;
        updateCounter();
    }
}

document.addEventListener("DOMContentLoaded", muatBuku);