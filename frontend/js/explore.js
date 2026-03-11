const map = L.map('map').setView([26.2, 91.7], 7);

async function getAllGems(){

    const res = await fetch("/api/locations");
    const data = await res.json();

    if(!res.ok){
        throw new Error("Failed to fetch locations");
    }
    return data;}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let allGems;
let markers = [];

async function loadMarkers(){

    try{
        allGems = await getAllGems()
        console.log(allGems);
        renderResults(allGems);
        showMarkers(allGems.data);

    }catch{
        console.log("Failed to load markers");
    }

}

function showMarkers(gems){

    markers.forEach(m => map.removeLayer(m.marker));
    markers = [];

    gems.forEach(gem =>{

        if(!gem.latitude) return;

        const marker = L.marker(
            [gem.latitude, gem.longitude],
            { icon: icons[gem.category] || icons.village }
        ).addTo(map);

        marker.bindPopup(`
            <b>${gem.name}</b><br>
            ${gem.category}<br>
            ⭐ ${gem.rating || 0}<br>
            <button onclick="openDetail('${gem._id}')">View</button>
        `);

        markers.push({
            id: gem._id,
            marker: marker,
            lat: gem.latitude,
            lng: gem.longitude
        });

    });

}

function renderResults(gems){

    gems = gems.data;
    const container = document.getElementById("results");
    container.innerHTML = "";

    gems.forEach(gem =>{
        const div = document.createElement("div");

        div.className = "result-card";

        div.innerHTML = `
            <b>${gem.name}</b>
            <p>${gem.category}</p>
        `;

        /* CLICK → ZOOM */
        div.onclick = () => zoomToLocation(gem._id);

        /* HOVER → HIGHLIGHT MARKER */
        div.onmouseenter = () => highlightMarker(gem._id);

        container.appendChild(div);

    });

}

function highlightMarker(id){

    const item = markers.find(m => m.id === id);

    if(!item) return;

    item.marker.openPopup();

}

/* SEARCH */

document.getElementById("searchInput").addEventListener("input", filterData);

/* CATEGORY FILTER */

document.querySelectorAll(".filters input").forEach(cb => {
    cb.addEventListener("change", filterData);
});

function filterData(){

    const search = document.getElementById("searchInput").value.toLowerCase();

    const selected = [...document.querySelectorAll(".filters input:checked")]
        .map(cb => cb.value);

    const filtered = allGems.filter(gem =>{

        const matchSearch = gem.name.toLowerCase().includes(search);

        const matchCategory =
            selected.length === 0 ||
            selected.includes(gem.category.toLowerCase());

        return matchSearch && matchCategory;

    });

    renderResults(filtered);
    showMarkers(filtered);

}

function openDetail(id){
    window.location.href = `detail.html?id=${id}`;
}

const icons = {

    waterfall: L.icon({
        iconUrl: "assets/icons/icons8-waterfall.png",
        iconSize: [32, 32]
    }),

    hill: L.icon({
        iconUrl: "assets/icons/icons8-hill.png",
        iconSize: [32, 32]
    }),

    village: L.icon({
        iconUrl: "assets/icons/icons8-village.png",
        iconSize: [32, 32]
    }),

    forest: L.icon({
        iconUrl: "assets/icons/icons8-forest.png",
        iconSize: [32, 32]
    }),

    river: L.icon({
        iconUrl: "assets/icons/icons8-river.png",
        iconSize: [32, 32]
    }),

    lake: L.icon({
        iconUrl: "assets/icons/lakeMarker.png",
        iconSize: [32, 32]
    }),

    tracking: L.icon({
        iconUrl: "assets/icons/lake.png",
        iconSize: [32, 32]
    }),
    SunsetPoint: L.icon({
        iconUrl: "assets/icons/lake.png",
        iconSize: [32, 32]
    }),
    SunrisePoint: L.icon({
        iconUrl: "assets/icons/lake.png",
        iconSize: [32, 32]
    }),

    flowers: L.icon({
        iconUrl: "assets/icons/flower.png",
        iconSize: [32, 32]
    })

};

function zoomToLocation(id){

    const item = markers.find(m => m.id === id);

    if(!item) return;

    map.setView([item.lat, item.lng], 12);

    item.marker.openPopup();

}

loadMarkers();