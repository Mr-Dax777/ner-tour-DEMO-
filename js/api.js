async function getAllGems() {
    const res = await fetch(`${API_BASE}/gems`);
    return res.json();
}

async function getGemById(id) {
    const res = await fetch(`${API_BASE}/gems/${id}`);
    return res.json();
}

async function uploadGem(formData) {
    const res = await fetch(`${API_BASE}/gems`, {
        method: "POST",
        body: formData
    });

    return res.json();
}