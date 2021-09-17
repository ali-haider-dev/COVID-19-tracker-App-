import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useState, useEffect } from 'react';
import './App.css';
import Graph from './components/Graph';
import InfoBox from './components/infoBox';
import Table from './components/table'
import { prettyStat, sortData } from './components/utilities/util';
import "leaflet/dist/leaflet.css"

//https://disease.sh/v3/covid-19/countries

function App() {


  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("Worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, settableData] = useState([])
  const [casesType, setCaseType] = useState("cases")

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
          const sortedData = sortData(data)
          setCountries(countries)
          settableData(sortedData)
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
          <h1>COVID-19 TRACKER</h1>
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
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCaseType("cases")}
            title="CoronaVirus Cases"
            cases={prettyStat(countryInfo.todayCases)}
            total={prettyStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCaseType("recovered")}
            title="Recovered"
            cases={prettyStat(countryInfo.todayRecovered)}
            total={prettyStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={e => setCaseType("deaths")}
            title="Death"
            cases={prettyStat(countryInfo.todayDeaths)}
            total={prettyStat(countryInfo.deaths)} />
        </div>

        {/* MAP   */}

        <Card>
          <CardContent>
            <h3>WorldWide New {casesType}</h3>
            {/* Graph */}
            <Graph className="app__graph" casesType={casesType} />

          </CardContent>
        </Card>

      </div>

      {/* Left side work */}

      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live Cases By Country</h3>
            <Table countries={tableData} />


          </CardContent>
        </Card>

      </div>

    </div>
  );
}

export default App;
