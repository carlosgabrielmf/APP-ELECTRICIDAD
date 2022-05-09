'use strict';

//Se crea una funcion asincrona para obtener la API
const getData = async () => {
  try {
    const response = await fetch(
      'https://api.allorigins.win/get?url=https://api.preciodelaluz.org/v1/prices/all?zone=PCB'
    );
    const data = await response.json();

    //Se obtiene el contenido de la API que almacena los datos necesitados
    const dataLocal = data.contents;

    //Se almacen los datos de la API en el localstorage
    localStorage.setItem('dataLocal', dataLocal);
  } catch (error) {
    console.log(error);
  }
};
getData();

//esta función se encarga de comprobar si debe pedir los datos o mostrar la caché local
/*
async function loadData(e) {
    try {
      //Cargamos la caché local en localStorage
      const localData = JSON.parse(localStorage.getItem("data"));
  
      let data;
  
      // Si existe cache local y la diferencia en milisegundos entre la hora actual y la hora de la ultima caché es menor de un minuto (60000 milisegundos) mostramos datos locales
      if (localData && Date.now() - localData.lastUpdated < 60000) {
        result.innerHTML = "Usamos datos locales";
        data = localData.data;
      } else {
        // Si no pedimos datos de nuevo al servidor
        result.innerHTML = "Pedimos datos al servidor";
        data = await getData();
        localStorage.setItem(
          "data",
          JSON.stringify({
            lastUpdated: Date.now(),
            data: data
          })
        );
      }
  
      // Mosramos los datos en la página
      output.innerText = data;
    } catch (error) {
      result.innerHTML = "Hubo un error";
    }
  }
  
  button.addEventListener("click", loadData);
  
  */

//Mediante esta funcion obtenemos el STRING alojado en el localstorage y lo convertimos a OBJETO
function getDataLocal() {
  const data = localStorage.getItem('dataLocal');
  const dataObj = JSON.parse(data);
  return dataObj;
}

//Obtenemos las propiedades necesarias y Creamos el array de elementos
function getProperties() {
  const data = getDataLocal();
  let allInf = [];

  //allInf = [Hora: 00-00, precio por MW: xxx€ ]
  for (const key in data) {
    allInf.push([data[key].hour, data[key].price]);
  }

  //Retornamos el Array[Hora , precio por MW]
  return allInf;
}

function getOnlyPrice() {
  const data = getDataLocal();
  let onlyPrice = [];

  for (const key in data) {
    onlyPrice.push(data[key].price);
  }

  return onlyPrice;
}

console.log(getOnlyPrice());

const min = (array) => {
  const p = document.querySelector('#precio-bajo');

  const minimo = Math.min(...array);

  p.textContent = minimo;

  return minimo;
};

const max = (array) => {
  const p = document.querySelector('#precio-alto');

  const maximo = Math.max(...array);

  p.textContent = maximo;
  return maximo;
};

console.log(
  `Precio mas bajo:${min(getOnlyPrice())} y Precio mas alto:${max(
    getOnlyPrice()
  )}`
);

const pPrice = document.querySelector('#precio-act');

//Obtenemos el precio actual de la luz
let currentPrice = () => {
  const time = new Date();
  const hour = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const time_act = `${hour}:${minutes}:${seconds}`;

  const h2 = document.querySelector('#hora-act');

  h2.textContent = time_act;

  //Agregamos el precio actual a un P
  pPrice.textContent = `${getProperties()[hour][1]}`;

  //Retornamos el precio actual de la luz
  return getProperties()[hour][1];
};

//Convertimos el precio actual de MWh a kWh
function convertPrice(currentHour) {
  return currentHour / 1000;
}

//Llamamos la funcion y le pasamos de argumento otra funcion que obtiene el precio actual de la hora
convertPrice(currentPrice());

//Creamos un fragmento para ir agrengando los divs
const frag = document.createDocumentFragment();

//Mediante esta funcion creamos los divs corrrespondiente para cada objeto
const dateObj = (priceObj) => {
  //Array con informacion de cada objeto, su nombre y su consumo de kWh/h
  const arrayProducts = [
    {
      name: 'Ordenador',
      price: '0.019',
    },
    {
      name: 'Tv',
      price: '0.03',
    },
    {
      name: 'Nevera',
      price: ' 0.077',
    },
    {
      name: 'Horno-Electrico',
      price: '0.027',
    },
    {
      name: 'Lavadora',
      price: '0.03',
    },
  ];

  //Obtenemos la seccio donde agregaremos los divs
  const section = document.querySelector('.main');

  //Recorremos el array de objetos para crear un Div de cada uno
  for (const key of arrayProducts) {
    const div = document.createElement(`div`);

    div.innerHTML = ` <h3>${key.name}</h3>
                      <img src="./img/${key.name}.jpg" alt="Imagen de ${
      key.name
    }" class="img">
                      <p class="pProducts">El consumo actual durante una hora es de <strong>:${
                        key.price * priceObj
                      }€<strong></p>
                      `;

    //Agregamos cada div al fragmento
    frag.appendChild(div);
  }
  //agregaremos el frag a la section
  section.append(frag);
};

//Llamamaos a la funcion
dateObj(convertPrice(currentPrice()));
