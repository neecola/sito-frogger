// in teoria serve per connettere un controller fisico, per ora non interessa
// import gamecontrollerJs from "https://cdn.skypack.dev/gamecontroller.js@1.5.0";

// mostra un bordo intorno a un pulsante quando viene premuto (solo estetico) 
function toggleClass(el, val) {
  document.getElementById(el).classList.toggle("active", val)
}


// update della lista di client connessi quando si entra nella selezione della sessione di gioco
async function updateClients() {
  try {
      const response = await fetch('/api/get-clients');
      const clients = await response.json();
      const select = document.getElementById('clientSelect');
      const selectedClient = select.value; // Mantiene la selezione attuale

      // Aggiorna il menu solo se la lista è cambiata
      select.innerHTML = clients.map(client => 
          `<option value="${client}" ${client === selectedClient ? "selected" : ""}>${client}</option>`
      ).join('');
  } catch (error) {
      console.error("Errore nel recupero della lista dei client:", error);
  }
}

// Quando l'utente clicca per aprire il menu a tendina, aggiorniamo la lista
document.getElementById('clientSelect').addEventListener('focus', updateClients);




// event listener per pressione pulsanti controller
document.querySelectorAll('.control').forEach(button => {
    button.addEventListener('click', () => {
      console.log(button.id + " button pressed");
      
      const clientID = document.getElementById('clientSelect').value;
      if (!clientID) return alert("Seleziona un client!");
      
      console.log(`clientID: ${clientID}`);
      console.log(`btnId: ${button.id}`);
      console.log(`json: ${JSON.stringify({ clientID, btnId: button.id, time: Date.now(), message: `Messaggio da ${button.id}` })}`);


      fetch('/api/controller', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientID, btnId: button.id, time: Date.now(), message: `Messaggio da ${button.id}` })
      })
      .then(response => response.json())
      .then(data => console.log(`Risposta (${button.id}):`, data))
      .catch(err => console.error(`Errore (${button.id}):`, err));

      
      // fetch('/api/controller-button', {
      //   method: POST,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ command: button.id })
    
      // })
      //   .then(response => response.text())
      //   .then(data => console.log(data))
      //   .catch(err => console.error('Errore:', err));

    });

});








//? funzioni per libreria gamecontroller.js (non interessa)
// gameControl.on('connect', function(gamepad) {
//   const buttonMap = {
//     "button0": "b",
//     "button1": "a",
//     "button2": "y",
//     "button3": "x",
//     "button4": "l",
//     "button5": "r",
//     "button8": "select",
//     "button9": "start"
//   };
  
//   for (const property in buttonMap) {
//     gamepad.on(property, function() { toggleClass(buttonMap[property], true) })
//            .after(property, function() { toggleClass(buttonMap[property], false) });
//   }
// });