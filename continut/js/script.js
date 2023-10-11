





function deseneaza() {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  let isDrawing = false;
  let startX, startY;

  const lineColor = document.getElementById("line-color");
  const fillColor = document.getElementById("fill-color");
  const resetButton = document.getElementById("reset");
  const saveButton = document.getElementById("save");

  canvas.addEventListener("mousedown", (event) => {
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!isDrawing) return;

    const currentX = event.offsetX;
    const currentY = event.offsetY;

    context.beginPath();
    context.rect(startX, startY, currentX - startX, currentY - startY);
    context.strokeStyle = lineColor.value;
    context.fillStyle = fillColor.value;
    context.stroke();
    context.fill();
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  canvas.addEventListener("dblclick", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;

    const size = 10; // dimensiunea pătratului
    context.beginPath();
    context.rect(x - size/2, y - size/2, size, size);
    context.strokeStyle = lineColor.value;
    context.fillStyle = fillColor.value;
    context.stroke();
    context.fill();
  });

  resetButton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  saveButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "desen.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}


function modifyTable() {
  const table = document.getElementById('my-table');
  const positionInput = document.getElementById('position');
  const colorInput = document.getElementById('color');
  const insertRowBtn = document.getElementById('insert-row');
  const insertColBtn = document.getElementById('insert-col');

  function insertRow() {
    const position = positionInput.value.split(',');
    const rowIndex = parseInt(position[0]) - 1;
    const bgColor = colorInput.value;
    
    if (rowIndex < 0 || rowIndex > table.rows.length) {
      alert('Poziția specificată nu există în tabel.');
      return;
    }
    
    const newRow = table.insertRow(rowIndex);
    
    for (let i = 0; i < table.rows[0].cells.length; i++) {
      const newCell = newRow.insertCell(i);
      newCell.style.backgroundColor = bgColor;
      newCell.innerText = 'Celle nouă';
    }
  }
  
  function insertCol() {
    const position = positionInput.value.split(',');
    const colIndex = parseInt(position[1]) - 1;
    const bgColor = colorInput.value;
  
    if (colIndex < 0 || colIndex > table.rows[0].cells.length) {
      alert('Poziția specificată nu există în tabel.');
      return;
    }
  
    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      const newCell = row.insertCell(colIndex);
      newCell.style.backgroundColor = bgColor;
      newCell.innerText = 'Celula nouă';
  
      // Actualizează indexul celulelor din rândul curent și din rândurile ulterioare
      for (let j = colIndex + 1; j < row.cells.length; j++) {
        row.cells[j].cellIndex = j;
      }
    }
  }
  
  
  insertRowBtn.addEventListener('click', insertRow);
  insertColBtn.addEventListener('click', insertCol);
}


function schimbaContinut(resursa,jsFisier,jsFunctie) 
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() 
    {
      if (this.readyState == 4 && this.status == 200) 
      {
        document.getElementById("continut").innerHTML = this.responseText;
        if (jsFisier) {
          var elementScript = document.createElement('script');
          elementScript.onload = function () {
          console.log("hello");
          if (jsFunctie) {
          window[jsFunctie]();
          }
          };
          elementScript.src = jsFisier;
          document.head.appendChild(elementScript);
          } else {
          if (jsFunctie) {
          window[jsFunctie]();
          }
          }
        if(resursa=="invat")
        {

          function showBrowserInfo() {
            const dataCurenta = new Date().toLocaleString();
          
            // Obținem adresa URL
            const adresaURL = window.location.href;
          
            // Obținem locația curentă
            const locatieCurenta = window.location.pathname;
          
            // Obținem numele și versiunea browser-ului
            const browser = `${navigator.appName} - Versiunea: ${navigator.appVersion}`;
          
            // Obținem sistemul de operare folosit de utilizator
            const sistem = navigator.platform;
          
            // Creăm lista de informații
            const infoList = `
              <li><span>Data și ora curentă: ${dataCurenta}</span></li>
              <li><span>Adresa URL: ${adresaURL}</span></li>
              <li><span>Locația curentă: ${locatieCurenta}</span></li>
              <li><span>Browser: ${browser}</span></li>
              <li><span>Sistem de operare: ${sistem}</span></li>
            `;
          
            // Actualizăm informațiile în HTML
            const infoContainer = document.getElementById("info-container");
            infoContainer.innerHTML = infoList;
          }
          setInterval(showBrowserInfo,1000);
          deseneaza();
          modifyTable();
          
        }
        if(resursa=="verifica"){
          console.log("VERIFICARE");
          // selectează butonul
		const btn = document.getElementById("verificaButton");

		// adaugă evenimentul click pe buton
		btn.addEventListener("click", function() {
      console.log("Verificare2")
      var username = document.getElementById("nume_utilizator").value;
      var password = document.getElementById("parola").value;
			// creează o cerere GET la fișierul JSON
			const xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					// afișează răspunsul în consolă
					var data = JSON.parse(this.responseText);
          var esteValid = false;
          console.log("Verificare3")
          for (var i = 0; i < data.length; i++) {
            if (data[i].utilizator === username && data[i].parola === password) {
              esteValid = true;
              break;
            }
          }
          
          if (esteValid) {
            alert("Utilizator si parola corecte");
          } else {
           alert("Utilizator sau parolă incorecte!");
          }
				}
			};
			xhttp.open("GET", "/resurse/utilizatori.json", true);
      
			xhttp.send();

		});
        }
      }
    };
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();
  }



