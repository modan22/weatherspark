const apiKey = 'a1798b8da9d8e618da2e0d744fa4e88a'; 
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';


document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
  e.preventDefault();  // Prevent the default form submission behavior

  const zip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;

  if (!zip || !feelings) {
    alert('Please enter both zip code and feelings.');
    return;
  }

  console.log("Fetching weather for ZIP:", zip);
  getWeather(baseURL, zip, apiKey)
    .then(data => {
      console.log("Weather data received:", data);
      if (data && data.cod === 200) {
        return postData('/add', {
          temperature: data.main.temp,
          date: new Date().toLocaleDateString(),
          userResponse: feelings
        });
      } else {
        throw new Error(data.message || 'Error fetching weather data');
      }
    })
    .then(() => updateUI())
    .catch(error => console.log("Error:", error));
}

// Function to GET Web API Data
const getWeather = async (baseURL, zip, apiKey) => {
  try {
    const res = await fetch(`${baseURL}?zip=${zip}&appid=${apiKey}&units=imperial`);
    const data = await res.json();
    console.log("API response:", data);
    if (data.cod === 200) {
      return data;
    } else {
      console.log("Error fetching weather data:", data.message);
      return null;
    }
  } catch (error) {
    console.log("Fetch error:", error);
    return null;
  }
};

// Function to POST data
const postData = async (url = '', data = {}) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const newData = await response.json();
    console.log("Data posted:", newData);
    return newData;
  } catch (error) {
    console.log("Error posting data:", error);
  }
};

// Function to GET Project Data and update UI
const updateUI = async () => {
  try {
    const request = await fetch('/all');
    const allData = await request.json();
    console.log("UI data:", allData);
    document.getElementById('temp').innerHTML = `Temperature: ${allData.temperature || 'N/A'}°F`;
    document.getElementById('date').innerHTML = `Date: ${allData.date || 'N/A'}`;
    document.getElementById('content').innerHTML = `Feelings: ${allData.userResponse || 'N/A'}`;
  } catch (error) {
    console.log("Update UI error:", error);
  }
};
