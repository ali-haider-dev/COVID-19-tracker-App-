import { FormControl, MenuItem, Select } from '@material-ui/core';
import { useState, useEffect } from 'react';
import './App.css';



//https://disease.sh/v3/covid-19/countries

function App() {


  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("Worldwide")

  useEffect(() => {
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))
          setCountries(countries)
        })
    }
    getCountryData()
  }, [countries])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value
    setCountry(countryCode)
  }



  return (
    <div className="App">
      <div className="app__header">
        <h1>Covid-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            <MenuItem value={country}>{country}</MenuItem>
            {
              countries.map(Country => {
                return (
                  <MenuItem value={Country.value}>{Country.name} </MenuItem>
                )
              })
            }
          </Select>
        </FormControl>

      </div>
      <div className="app__stats"></div>

    </div>
  );
}

export default App;
