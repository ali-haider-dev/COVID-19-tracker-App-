import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './components/infoBox';
import Map from './components/Map';
import Table from './components/table'


//https://disease.sh/v3/covid-19/countries

function App() {


  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("Worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, settableData] = useState([])

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })

  }, [])



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
          settableData(data)
        })
    }
    getCountryData()
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value
    setCountry(countryCode)


    const url = countryCode === "Worldwide"

      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode)
        setCountryInfo(data)
      })

  }




  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {
                countries.map(Country => {
                  return (
                    <MenuItem value={Country.name}>{Country.name} </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>

        </div>
        <div className="app__stats">
          <InfoBox title="CoronaVirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Death" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        {/* MAP   */}

        <Map />
      </div>

      {/* Left side work */}

      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live Cases By Country</h3>
            <Table countries={tableData} />
            <h3>WorldWide New Cases</h3>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}

export default App;
