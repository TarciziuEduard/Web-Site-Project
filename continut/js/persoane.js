function incarcaPersoane() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var xmlString = this.responseText;
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xmlString, "text/xml");
      var root = xmlDoc.documentElement;
      var table = "<table><tr><th>Nume</th><th>Prenume</th><th>Varsta</th></tr>";
      var persoane = root.getElementsByTagName("persoana");
      for (var i = 0; i < persoane.length; i++) {
        var nume = persoane[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue;
        var prenume = persoane[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue;
        var varsta = persoane[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue;
        table += "<tr><td>" + nume + "</td><td>" + prenume + "</td><td>" + varsta + "</td></tr>";
      }
      table += "</table>";
      document.getElementById("tabel_persoane").innerHTML = table;

      // Adăugăm stilurile CSS direct în JS
      var css = "table1 {border-collapse: collapse; width: 500%; } th, td { text-align: left; padding: 15px; } th { background-color: #4CAF50; color: white; } tr:nth-child(even) { background-color: #ffffff; color: #000000; } tr:nth-child(odd) { background-color: #000000; color: #ffffff; }";
      var style = document.createElement("style");
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);

      document.querySelector('h1#text_load').style.display = 'none';
    }
  };
  xhttp.open("GET", "../resurse/persoane.xml", true);
  xhttp.send();
}
