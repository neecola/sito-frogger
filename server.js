const net = require('net');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 10001;
const TCP_PORT = 10002;

const tcpclients = {};  // Mappa degli ID client -> socket


// Middleware per loggare le richieste
app.use((req, res, next) => {
    console.log(`Richiesta ricevuta: ${req.method} ${req.url}`);
    next();
});

// Servire le cartelle statiche
app.use(express.static(path.join(__dirname, 'public/')));
// app.use('/game-controller', express.static(path.join(__dirname, 'public/game-controller')));

// per gestire json
app.use(express.json())


// Reindirizzamento della root alla homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages', 'landing.html'));
});

// Gestione dinamica delle pagine nella cartella 'pages'
app.get('/:page', (req, res) => {
    const fileName = req.params.page + '.html';
    const filePath = path.join(__dirname, 'public/pages', fileName);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('404 - Pagina non trovata');
        }
    });
});


// ! creazione server tcp
const tcpServer = net.createServer((socket) => {
    console.log('Nuovo client in connessione...');

    // Ricezione dell'ID del client C
    socket.once('data', (data) => {
        let clientID = data.toString().trim();

        // Se l'ID è già in uso, rifiutiamo la connessione e chiudiamo il socket
        if (tcpclients[clientID]) {
            console.log(`⚠️ ID ${clientID} già in uso! Richiedendo un nuovo ID...`);
            socket.write("ID_DUPLICATO");  // Segnale per il client di rigenerare l'ID
            socket.end();
            return;
        }

        // Registra il nuovo client
        tcpclients[clientID] = socket;
        console.log(`✅ Client C registrato con ID: ${clientID}`);

        // Gestione disconnessione del client
        socket.on('end', () => {
            console.log(`Client C ${clientID} disconnesso.`);
            delete tcpclients[clientID];
        });

        socket.on('error', (err) => {
            console.error(`Errore con client C ${clientID}:`, err);
            delete tcpclients[clientID];
        });
    });
});

app.get('/api/get-clients', (req, res) => {
    res.json(Object.keys(tcpclients));
});


app.post('/api/controller', (req, res) => {
    console.log(req)
    console.log(req.body)
    
    const { clientID, type, ...jsonData } = req.body;

    if (!clientID || !tcpclients[clientID]) {
        return res.status(400).json({ status: "error", message: "Client C non valido o disconnesso" });
    }

    jsonData.type = type;
    const jsonString = JSON.stringify(jsonData);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(jsonString.length, 0);

    tcpclients[clientID].write(Buffer.concat([length, Buffer.from(jsonString)]));
    console.log(`📤 Messaggio inviato a ${clientID}:`, jsonData);

    res.json({ status: "success", message: `Messaggio inviato a ${clientID}`, data: jsonData });
});




// Avvio del server http
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});

// avvio server tcp
tcpServer.listen(TCP_PORT, () => {
    console.log(`Server TCP in ascolto sulla porta ${TCP_PORT}`);
});