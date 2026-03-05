let latitude = null;
let longitude = null;

const locationBtn = document.getElementById("getLocation");
const locationText = document.getElementById("locationText");
const form = document.getElementById("uploadForm");

// Capture GPS
locationBtn.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    locationText.innerText = "Capturing location...";

    navigator.geolocation.getCurrentPosition((pos) => {

        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;

        locationText.innerText =
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

    }, () => alert("Permission denied"));
});


// Submit
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!latitude) {
        alert("Capture location first");
        return;
    }

    const formData = new FormData(form);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    try {
        await uploadGem(formData);
        alert("Uploaded!");
        form.reset();
        locationText.innerText = "";

    } catch {
        alert("Upload failed");
    }
});