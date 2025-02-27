document.addEventListener('DOMContentLoaded', () => {
    fetch("../components/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        })
        .catch(error => console.error("Errore nel caricamento della navbar:", error));

    
    
    
    const downloadButtons = document.querySelectorAll('#download button');
    downloadButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Download started for ' + button.textContent);
        });
    });
});
