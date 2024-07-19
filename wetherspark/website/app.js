// Personal API Key for OpenWeatherMap API
const apiKey = '<your_api_key>&units=imperial'; // Replace with your actual API key
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', handleGenerateClick);

function handleGenerateClick(event) {
    event.preventDefault();
    const zipCode = document.getElementById('zip').value;
    const userFeeling = document.getElementById('feelings').value;

    if (zipCode && userFeeling) {
        fetchWeatherData(zipCode)
            .then(weatherData => {
                if (weatherData) {
                    const dataToPost = {
                        temperature: weatherData.main.temp,
                        date: new Date().toLocaleDateString(),
                        userResponse: userFeeling
                    };
                    return postJournalEntry('/add', dataToPost);
                } else {
                    throw new Error('Weather data not found');
                }
            })
            .then(() => updateJournalUI())
            .catch(error => console.error('Error:', error));
    } else {
        alert('Please enter both a zip code and your feelings.');
    }
}

async function fetchWeatherData(zipCode) {
    try {
        const response = await fetch(`${baseURL}?zip=${zipCode}&appid=${apiKey}`);
        const data = await response.json();
        if (data.cod !== 200) {
            console.error('Error fetching weather data:', data.message);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

async function postJournalEntry(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

async function updateJournalUI() {
    try {
        const response = await fetch('/all');
        const journalData = await response.json();
        document.getElementById('temp').innerHTML = `Temperature: ${journalData.temperature}°F`;
        document.getElementById('date').innerHTML = `Date: ${journalData.date}`;
        document.getElementById('content').innerHTML = `Feelings: ${journalData.userResponse}`;
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}
