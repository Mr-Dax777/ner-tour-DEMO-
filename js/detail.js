const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadDetail() {

    if (!id) return;

    const gem = await getGemById(id);

    document.getElementById("title").innerText = gem.title;
    document.getElementById("description").innerText = gem.description;
    document.getElementById("category").innerText = gem.category;
    document.getElementById("image").src = gem.imageUrl;

    const miniMap = L.map('miniMap').setView([gem.latitude, gem.longitude], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(miniMap);

    L.marker([gem.latitude, gem.longitude]).addTo(miniMap);
}

loadDetail();