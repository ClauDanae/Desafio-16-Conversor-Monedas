const tipo_monedas = ["uf", "ivp", "dolar", "dolar_intercambio", "euro", "ipc", "utm", "imacec", "tpm", "libra_cobre", "tasa_desempleo", "bitcoin"]
const select = document.querySelector("#moneda_conv")
const pesos = document.querySelector("#pesos")
const resultado = document.querySelector("#resultado")

let chart = null
for (const tipo of tipo_monedas) {
    select.innerHTML += `
        <option value="${tipo}">${tipo}</option>
    `
}

async function convertir(){
    let pes = pesos.value
    let pesos_int = parseInt(pes)
    let moneda = select.value
    console.log(pes, pesos_int, moneda)
    try {
        const res = await
            fetch("https://mindicador.cl/api/");    
            
        const monedas_res = await res.json();  

        let result_api = monedas_res[moneda].valor * pesos_int


        resultado.innerHTML = `
            Resultado: $${result_api}
        `
        // Grafico
        renderGrafica(moneda)
    } catch (error) {
        resultado.innerHTML = "<h1>Ha ocurrido un error inesperado, intente nuevamente</h1>" 
    }
}

async function getAndCreateDataToChart(moneda) {
    const res = await
        fetch("https://mindicador.cl/api/"+moneda);
    const moneda_res = await res.json();
    let serie = moneda_res.serie.reverse()
    const labels = serie.map((mon) => {
        let d = new Date(mon.fecha)
        return d.toLocaleDateString();
    });
    const data = serie.map((mon) => {
        return mon.valor;
    });
    const datasets = [
        {
            label: moneda,
            borderColor: "rgb(255, 99, 132)",
            data
        }
    ];
    return { labels, datasets };

}

async function renderGrafica(moneda) {
    const data = await getAndCreateDataToChart(moneda);
    const config = {
        type: "line",
        data
    };
    
    const grafica = document.getElementById("grafica");
    grafica.innerHTML = `
        <canvas id="myChart"></canvas>
    `
    
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    
    
    chart = new Chart(myChart, config);
    
}
//renderGrafica();
//getMonedas();