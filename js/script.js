// Контейнеры 
let weatherContainer = document.getElementsByClassName("weatherContainer")[0]
let cityContainer = document.getElementsByClassName("cityContainer")[0]
let errorContainer = document.getElementsByClassName("errorContainer")[0]

// Получение блоков для вывода температуры
let temperatureValue = document.getElementsByClassName("temperatureValue")[0]
let weatherInCity = document.getElementsByClassName("weatherInCity")[0]

// Функция показа контейнера с погодой
function showWeatherContainer() {
    weatherContainer.style.display = "flex"
    cityContainer.style.display = "none"
    errorContainer.style.display = "none"
}

// Функция показа контейнера с городом
function showCityContainer() {
    weatherContainer.style.display = "none"
    cityContainer.style.display = "flex"
    errorContainer.style.display = "none"
}

// Функция показа контейнера с ошибкой
function showErrorContainer() {
    weatherContainer.style.display = "none"
    cityContainer.style.display = "none"
    errorContainer.style.display = "flex"
}

// Кнопка для перехода на ввод города с окна погоды
let changeCityButton = document.getElementById("changeCityButton")
changeCityButton.onclick = function() {
    // Изменение текущего окна
    showCityContainer()
}

// Кнопка поиска температуры по городу
let findCityButton = document.getElementById("findCityButton")
findCityButton.onclick = function() {
    // Изменение текущего окна
    showWeatherContainer()

    let enteredCity = document.getElementById("inputToFindCity").value
    getCoordsFromCity(enteredCity)
}

// Кнопка для перехода на ввод города с окна ошибки
let tryAgainButton = document.getElementById("tryAgainButton")
tryAgainButton.onclick = function() {
    showCityContainer();
}

// Автоматическое определение местоположения и погоды пользователя
navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure)

// Если пользователь разрешил доступ к геолокации
function geolocationSuccess(position) {
	getWeatherFromCoords(position.coords.latitude, position.coords.longitude, null)
}

// Если пользователь запретил доступ к геолокации
function geolocationFailure(positionError) {
    fetch('https://api.ipify.org?format=json')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            getCityFromIp(data.ip)
        })
        .catch(error => {
            console.error("Произошла ошибка при определении погоды: " + error.message)
            showErrorContainer()
        })
}

// Функция определения координат города по ip
function getCityFromIp(ip) {
    fetch('https://geo.ipify.org/api/v2/country,city?apiKey=at_ISXaZUxRVDqIABeOyYv6ey7EiI3HN&ipAddress=' + ip)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            
            getWeatherFromCoords(data.location.lat, data.location.lng, null)
        })
        .catch(error => {
            console.error("Произошла ошибка при определении города: " + error.message)
            showErrorContainer()
        })
}

// Функция определения погоды по координатам
function getWeatherFromCoords(lat, lon, cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&appid=bd69def61e044b12aa285f853e73965f')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            
            // Изменение текущего окна
            showWeatherContainer()

            // Получение необходимых данных из Json
            let temp = data.main.temp
            let description = data.weather[0].description
            let city
            if (cityName == null) {
                city = data.name
            }
            else {
                city = cityName
            }

            // Преобразование первой буквы описания погоды в заглавную
            description = description[0].toUpperCase() + description.slice(1)

            // Вывод полученной температуры
            temperatureValue.innerHTML = ''
            temperatureValue.append(temp + " ℃")

            // Вывод полученного описания погоды и города
            weatherInCity.innerHTML = ''
            weatherInCity.append(description + " in " + city)
        })
        .catch(error => {
            console.error("Произошла ошибка при определении погоды: " + error.message)
            showErrorContainer()
        })
}

// Функция определения координат города
function getCoordsFromCity(city) {
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=bd69def61e044b12aa285f853e73965f')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)

            // Получение координат из Json
            let lat = data[0].lat
            let lon = data[0].lon
            let cityName = data[0].name

            // Определение погоды по координатам
            getWeatherFromCoords(lat, lon, cityName)
        })
        .catch(error => {
            console.error("Произошла ошибка при определении местоположения города: " + error.message)
            showErrorContainer()
        })
}