function start() {
    document.getElementById("algo-flow-button").innerText = "Další krok";
    alert('Začínáme s abecedou nebo množinou znaků, které chceme zakódovat. Každý znak má přiřazenou'+
    ' frekvenci výskytu (kolikrát se vyskytuje). Seřadíme znaky podle frekvence od nejvyšší po nejnižší a '+
    'vytvoříme tabulku, kde každý řádek obsahuje jeden znak a jeho frekvenci. Postupuj dál pomocí tlačítka.')
    document.getElementById("algo-flow-button").onclick = step1;
}

function step1(){    
    //1) E+F=>EF
    const F = document.getElementById("F");
    const E = document.getElementById("E");

    document.getElementById("F-node").style.display = "flex";
    document.getElementById("E-node").style.display = "flex";
    E.style.animation = "move-right 2s forwards, move-bottom 2s ease-out 2s forwards";
    F.style.animation = "move-right 2s forwards, move-top 2s ease-out 2s forwards";
    E.addEventListener("animationend",
     (event) => { 
        if(event.animationName === "move-bottom")
            {
                document.getElementById("EF-node").style.display = "flex";
                document.getElementsByClassName("connection-4-5")[0].style.display = "flex";
                const EF = document.getElementById("EF");
                EF.style.display = "flex";
                EF.style.animation = "appear 3s forwards";
                EF.addEventListener("animationend",
                     (e) => {if(e.animationName === "appear"){
                        document.getElementById("algo-flow-button").onclick = step2;
                        alert('Postup je jednoduchý. V každém kroce spojujeme uzly s nejnižší frekvencí do nových uzlů, '+
                        'a to dokud nezískáme jeden kořenový uzel, který bude na vrcholu stromu.')
                        }
                    });
            }
        },
    false);
}

function step2(){
    //2) EF + D => EFD
    const EF = document.getElementById("EF");
    const D = document.getElementById("D");

    document.getElementById("EF-node").style.display = "flex";
    document.getElementById("D-node").style.display = "flex";
    EF.style.animation = "move-right 2s forwards, move-bottom 2s ease-out 2s forwards";
    D.style.animation = "move-right 2s forwards, move-top 2s ease-out 2s forwards";
    EF.addEventListener("animationend",
     (event) => { 
        if(event.animationName === "move-bottom")
            {
                document.getElementsByClassName("row-3")[0].style.display = "flex";
                document.getElementsByClassName("connection-3-4")[0].style.display = "flex";
                const EFD = document.getElementById("EFD");
                EFD.style.display = "flex";
                EFD.style.animation = "appear 3s forwards";
                EFD.addEventListener("animationend",
                     (e) => {if(e.animationName === "appear"){
                        document.getElementById("algo-flow-button").onclick = step3;}
                    });
            }
        },
    false);
}

function step3(){
    //2) B + C => BC
    const B = document.getElementById("B");
    const C = document.getElementById("C");

    B.style.animation = "move-right 2s forwards, move-bottom 2s ease-out 2s forwards";
    C.style.animation = "move-right 2s forwards, move-top 2s ease-out 2s forwards";
    B.addEventListener("animationend",
     (event) => { 
        if(event.animationName === "move-bottom")
            {
                document.getElementById("BC-node").style.display = "flex";
                document.getElementsByClassName("connection-2-3")[0].querySelector('.BC').style.display = "flex";
                const BC = document.getElementById("BC");
                BC.style.display = "flex";
                BC.style.animation = "appear 3s forwards";
                BC.addEventListener("animationend",
                     (e) => {if(e.animationName === "appear"){
                        document.getElementById("algo-flow-button").onclick = step4;}
                    });
            }
        },
    false);
}

function step4(){
    //2) EFD + A => AEFD
    const EFD = document.getElementById("EFD");
    const A = document.getElementById("A");

    EFD.style.animation = "move-right 2s forwards, move-bottom 2s ease-out 2s forwards";
    A.style.animation = "move-right 2s forwards, move-top 2s ease-out 2s forwards";
    EFD.addEventListener("animationend",
     (event) => { 
        if(event.animationName === "move-bottom")
            {
                document.getElementById("AEFD-node").style.display = "flex";
                document.getElementsByClassName("connection-2-3")[0].querySelector('.AEFD').style.display = "flex";
                const AEFD = document.getElementById("AEFD");
                AEFD.style.display = "flex";
                AEFD.style.animation = "appear 3s forwards";
                AEFD.addEventListener("animationend",
                     (e) => {if(e.animationName === "appear"){
                        document.getElementById("algo-flow-button").onclick = step5;}
                    });
            }
        },
    false);
}

function step5(){
    // AEFD + BC => AEFDBC 
    const AEFD = document.getElementById("AEFD");
    const BC = document.getElementById("BC");

    AEFD.style.animation = "move-right 2s forwards, move-bottom 2s ease-out 2s forwards";
    BC.style.animation = "move-right 2s forwards, move-top 2s ease-out 2s forwards";
    AEFD.addEventListener("animationend",
     (event) => { 
        if(event.animationName === "move-bottom")
            {
                document.getElementById("AEFDBC-node").style.display = "flex";
                document.getElementsByClassName("connection-1-2")[0].style.display = "flex";
                const AEFDBC = document.getElementById("AEFDBC");
                AEFDBC.style.display = "flex";
                AEFDBC.style.animation = "appear 3s forwards";
                AEFDBC.addEventListener("animationend",
                     (e) => {if(e.animationName === "appear"){
                        document.getElementById("algo-flow-button").onclick = step6;}
                    });
            }
        },
    false);
}

function step6(){
    var elements = document.getElementsByClassName("bits");
    const AEFDBC = document.getElementById("AEFDBC");
    AEFDBC.style.display = "none";

    for (var i = 0; i < elements.length; i++) {
        var currentElement = elements[i];
        currentElement.style.animation = "bits-appear 2s forwards";
    }
    alert('Každému uzlu vytvořenému ve stromu přiřadíme binární hodnotu. Například, pokud jdeme vlevo,'+
    ' přiřadíme 1, pokud jdeme vpravo, přiřadíme 0.')
    document.getElementById("algo-flow-button").onclick = step7;
}

function step7(){
    var encoding = document.getElementsByClassName("encoding")[0]
    encoding.style.display = "flex";
    encoding.style.animation = "appear 1s forwards";    
    document.getElementById("algo-flow-button").onclick = step8;
    alert('Binární kód pro každý znak je pak cesta z kořenového uzlu stromu až k uzlu, který představuje daný znak.')
}

function step8(){
    alert("Konec.")

}

function reset(){
    location.reload()
}