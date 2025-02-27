let clickCount = 0;

function moveButton() {
    const button = document.getElementById('downloadButton');
    clickCount++;

    if (clickCount <= 10) {
        const x = Math.random() * (window.innerWidth - button.offsetWidth);
        const y = Math.random() * (window.innerHeight - button.offsetHeight);
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        const haText = document.createElement('div');
        haText.innerText = 'HA!';
        haText.style.position = 'fixed';
        haText.style.left = '50%';
        haText.style.top = '50%';
        haText.style.transform = 'translate(-50%, -50%)';
        haText.style.fontSize = '3rem';
        haText.style.color = 'red';
        document.body.appendChild(haText);

    } else {
        const fileUrl = "../resources/archivio.tar"; // Percorso del file
        const a = document.createElement("a");  // Crea un link <a>
        a.href = fileUrl;
        a.download = "progetto.tar"; // Nome del file da scaricare
        document.body.appendChild(a);
        a.click();  // Simula il click
        document.body.removeChild(a);

        // window.location.href = '../img/favicon.ico';
    }
}
