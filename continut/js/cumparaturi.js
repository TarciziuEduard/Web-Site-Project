function Produs(name,cant,id){
    this.nume=name;
    this.cantitate=cant;
    this.id=id;
}
const produse=[];

function adaugaProdus(nume,cantitate){
    const produs=new Produs(nume,cantitate,produse.length+1);
    produse.push(produs);
    localStorage.setItem("produs",produs);
    const myWorker = new Worker("js/worker.js");
    myWorker.postMessage(JSON.stringify({"nume":produs.nume, "cantitate":produs.cantitate, "id": produs.id}));
    console.log("Message posted to worker");
    myWorker.onmessage = (e) => {
        var result = e.data;
        console.log("Message received from worker");
        var table = document.getElementById("listaCumparaturi");
        var tr= table.insertRow(produse.length);
        for(let i =0;i<3;i++){
        var cell=tr.insertCell(i);
            if(i==0) cell.innerHTML= result.id;
            else if(i==1) cell.innerHTML=result.nume;
            else if(i==2) cell.innerHTML=result.cantitate;
        }
    };
}