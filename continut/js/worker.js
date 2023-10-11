onmessage = (e) => {
    console.log("Message received from main script");
    var rezultat=JSON.parse(e.data);
    console.log(rezultat);
    postMessage(rezultat);
  };