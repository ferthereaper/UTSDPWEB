const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function escapeHtml(teks) {
    const div = document.createElement("div");
    div.textContent = teks;
    return div.innerHTML;
}

function pesanTabel(tbody, pesan) {
    tbody.innerHTML =
        '<tr class="row-pesan"><td colspan="6">' + escapeHtml(pesan) + "</td></tr>";
}

function renderAnggota(tbody, daftarAnggota) {
    if (daftarAnggota.length === 0) {
        pesanTabel(tbody, "Belum ada data anggota.");
        return;
    }

    tbody.innerHTML = daftarAnggota
        .map(function (a) {
            return `
                <tr>
                    <td>${escapeHtml(a.no_anggota)}</td>
                    <td>${escapeHtml(a.nama)}</td>
                    <td>${escapeHtml(a.alamat)}</td>
                    <td>${escapeHtml(a.no_hp)}</td>
                    <td>${escapeHtml(a.tgl_bergabung)}</td>
                    <td>
                        <button type="button" class="button-edit">Edit</button>
                        <button type="button" class="button-detail">Detail</button>
                        <button type="button" class="button-hapus">Hapus</button>
                    </td>
                </tr>`;
        })
        .join("");
}

async function muatAnggota() {
    const tbody = document.querySelector(".table-responsive tbody");
    const loading = document.getElementById("loading-indicator");
    if (!tbody) return;

    if (loading) loading.hidden = false;

    try {
        await delay(600); // simulasi latensi jaringan
        const response = await fetch("../data/anggota.json");
        if (!response.ok) {
            throw new Error("Server merespons dengan status " + response.status);
        }
        const data = await response.json();
        renderAnggota(tbody, data);
    } catch (error) {
        console.error(error);
        pesanTabel(tbody, "Gagal memuat data anggota: " + error.message);
    } finally {
        if (loading) loading.hidden = true;
        updateCounter();
    }
}

document.addEventListener("DOMContentLoaded", muatAnggota);