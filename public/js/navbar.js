document.addEventListener("DOMContentLoaded", function () {
    fetch("/components/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;

            // Creiamo un osservatore per attendere che l'elemento <header> sia effettivamente nel DOM
            const observer = new MutationObserver(() => {
                const header = document.querySelector("header");
                if (header) {
                    initNavbarScrollEffect();  // Avvia lo script solo quando header esiste
                    observer.disconnect(); // Interrompe l'osservazione
                }
            });

            // Avvia l'osservazione dei cambiamenti nel DOM
            observer.observe(document.getElementById("navbar-container"), {
                childList: true, // Osserva solo i cambiamenti nei figli (es. l'aggiunta di header)
            });
        })
        .catch(error => console.error("Errore nel caricamento della navbar:", error));
});

function initNavbarScrollEffect() {
    let lastScrollTop = 0;
    const header = document.querySelector("header");

    if (!header) {
        console.error("Navbar non trovata nel DOM!");
        return;
    }

    header.classList.add("hidden"); // Nasconde la navbar all'inizio

    window.addEventListener("scroll", () => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 0) {
            header.classList.add("visible");
            header.classList.remove("hidden");
        } else {
            header.classList.remove("visible");
            header.classList.add("hidden");
        }
        lastScrollTop = scrollTop;
    });

    console.log("Navbar scroll effect attivato!");
}