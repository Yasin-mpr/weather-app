// ip api -------------------------------------------------

get_current_address = "http://ip-api.com/json/?fields=country,city,lat,lon,timezone";

const getLoc = async() => {

  const response = await fetch(get_current_address);
  const data = await response.json();

  return data;
}

// weather api ------------------------------------------------

const getWeather = async( lat , lon) => {

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0b789574a9e77d3bdceb8c65aa008f62`
 
  
  const response = await fetch(url);  
  const data = await response.json();

  return data;
}


// get weather data ---------------------------------------------

function getDayOrNight(time , sunrise , sunset)
{
  if(time > sunset || time <= sunrise)
  {
    return "night";
  }
  else
  {
    return "day";
  }
}

function getSkyType(weData)
{
  let icon;

  const skyType = weData.weather[0].main;
  const dayOrNight = getDayOrNight(weData.dt , weData.sys.sunrise , weData.sys.sunset);

  if(skyType == "Clear")
  {
    icon = `${skyType}-${dayOrNight}.svg`;
  }
  else
  {
    icon = `${skyType}.svg`;
  }


  return icon;
}

function getTemp(weTemp)
{
  const kelvin = weTemp;
  const farenheit = (kelvin - 273.15) * 9/5 + 32;
  const celsius = kelvin - 273.15;

  temp = {
    tKelvin : Math.floor(kelvin),
    tFarenheit : Math.floor(farenheit),
    tCelsius : Math.floor(celsius) 
  };

  return temp;
}


let loc = document.querySelector("#loacationName");
let sky = document.querySelector("#skyType h2");
let skyIcon = document.querySelector("#skyType img");
let c_deg = document.querySelector("#cdegreeNumber");
let f_deg = document.querySelector("#fdegreeNumber");
let k_deg = document.querySelector("#kdegreeNumber");


const get_info = (weData) =>
  {

    const temp = getTemp(weData.main.temp);
    console.log(weData);

    sky.textContent = weData.weather[0].description;
    skyIcon.alt = weData.weather[0].description;
    skyIcon.src = `image/${getSkyType(weData)}`

    c_deg.textContent = `${temp.tCelsius}°`;
    k_deg.textContent = `${temp.tKelvin}°`;
    f_deg.textContent = `${temp.tFarenheit}°`;
  }

getLoc()
.then(locData => {
  const country = locData.country;
  const city = locData.city;
  loc.textContent = `${country} / ${city}`;


  return getWeather(locData.lat , locData.lon);
}).then(get_info)








// get city api----------------------------------------------------------


const get_city_loc = async(name) =>
{
  const url = `http://api.positionstack.com/v1/forward?access_key=2cfa490041313e51f239f9939b00f6ee&query=${name}`;

  const response = await fetch(url);
  const data = response.json();

  return data;
}


// setting --------------------------------------------------------------


const sBtn = document.querySelector('.sidebarBTN');
const sidebar = document.querySelector('.sidebar');
const pollets = document.querySelector('.pollets');
const body = document.querySelector('main');
let a = 0;

const forsidebar = function()
{
    sidebar.classList.toggle('active');
}

sBtn.addEventListener('click' , forsidebar)

pollets.addEventListener('click' , function(ev)
{
    if(ev.target.getAttribute('class').split(' ').length>1 && ev.target.getAttribute('class').includes('pollet'))
    {
        body.style.background = getComputedStyle(ev.target).background;
        forsidebar();
    }
})


const input = document.querySelector("#getCityName");
const btn = document.querySelector("#btn");

btn.addEventListener("click" , ()=>
{
  
  if(input.value != "")
  {
    get_city_loc(input.value)
    .then(cityData =>
      {
        console.log(cityData);
        const country = cityData.data[0].country;
        const city = cityData.data[0].name;
        loc.textContent = `${country} / ${city}`;
        return getWeather(cityData.data[0].latitude , cityData.data[0].longitude);
      }).then(get_info)
  }
  input.value = ""
  forsidebar()
})


const c = document.querySelector("#celsius");
const k = document.querySelector("#kelvin");
const f = document.querySelector("#farenheit");


const c_degree = document.querySelector("#c_degree");
const k_degree = document.querySelector("#k_degree");
const f_degree = document.querySelector("#f_degree");



const dataType = (ev) => 
{
  if(c_degree.className.includes("active"))
  {
    c_degree.classList.remove("active");
  }
  if(k_degree.className.includes("active"))
  {
    k_degree.classList.remove("active");
  }
  if(f_degree.className.includes("active"))
  {
    f_degree.classList.remove("active");
  }

  if(ev.target == c)
  {
    c_degree.classList.add("active");
  }
  if(ev.target == k)
  {
    k_degree.classList.add("active");
  }
  if(ev.target == f)
  {
    f_degree.classList.add("active");
  }
}

f.addEventListener("click" , dataType);
c.addEventListener("click" , dataType);
k.addEventListener("click" , dataType);


input.addEventListener("keydown" , (ev)=>
{
  if(ev.keyCode == 13)
  {
    get_city_loc(input.value)
    .then(cityData =>
      {
        console.log(cityData);
        const country = cityData.data[0].country;
        const city = cityData.data[0].name;
        loc.textContent = `${country} / ${city}`;
        return getWeather(cityData.data[0].latitude , cityData.data[0].longitude);
      }).then(get_info)
    input.value = ""
    forsidebar()
    ev.preventDefault()
  }
})