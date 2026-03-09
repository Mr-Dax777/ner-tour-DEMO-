// console.log("NER Tour Loaded");



document.addEventListener("DOMContentLoaded", () => {

    console.log("NER Tour loaded");

    setupNavbar();

});

function setupNavbar() {

    const links = document.querySelectorAll("nav a");

    links.forEach(link => {
        link.addEventListener("mouseover", () => {
            link.style.opacity = "0.7";
        });

        link.addEventListener("mouseout", () => {
            link.style.opacity = "1";
        });
    });

}