import { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'

const Body = () => {
  const [data, setData] = useState({})
  const [selectedCountry, setSelectedCountry] = useState('Global')
  const [selectedCountryData, setSelectedCountryData] = useState({})

  const handleSelectCountry = (event) => {
    setSelectedCountry(event.target.value)
  }

  useEffect(() => {
    const config = {
      method: 'get',
      url: 'https://api.covid19api.com/summary',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    axios(config)
      .then((response) => {
        const countries = response.data.Countries.reduce((accumul, country) => (
          {
            ...accumul,
            [country.Slug]: country,
          }
        ), {})

        return {
          Global: response.data.Global,
          Countries: Object.keys(countries).sort().map((country) => countries[country]),
        }
      })
      .then((response) => setData(
        response,
      ))
  }, [])

  useEffect(() => {
    if (data.Countries) {
      const countryData = selectedCountry === 'Global' ? ({
        Country: 'Global',
        ...data.Global,
      }) : data.Countries.find((country) => country.Slug === selectedCountry)
      setSelectedCountryData(countryData)
    }
  }, [selectedCountry, data])

  return (
    data.Countries ? (
      <div className="container">
        <div className="row">
          <div className="col d-flex justify-content-center">
            <h3>{selectedCountryData.Country}</h3>
          </div>
        </div>
        <div className="row">
          <div className="col d-flex justify-content-center">
            <div>
              {moment(selectedCountryData.Date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col d-flex justify-content-center">
            <div className="w-100 mb-2 text-center p-5 border rounded-3 bg-warning bg-gradient">
              <strong>Cases</strong>
              <div>
                <span>New: </span>
                {selectedCountryData.NewConfirmed}
              </div>
              <div>
                <span>Total: </span>
                {selectedCountryData.TotalConfirmed}
              </div>
            </div>
          </div>
          <div className="col d-flex justify-content-center">
            <div className="w-100 mb-2 text-center p-5 border rounded-3 bg-success bg-gradient">
              <strong>Recovered</strong>
              <div>
                <span>New: </span>
                {selectedCountryData.NewRecovered}
              </div>
              <div>
                <span>Total: </span>
                {selectedCountryData.TotalRecovered}
              </div>
            </div>
          </div>
          <div className="col d-flex justify-content-center">
            <div className="w-100 mb-2 text-center p-5 border rounded-3 bg-danger bg-gradient">
              <strong>Deaths</strong>
              <div>
                <span>New: </span>
                {selectedCountryData.NewDeaths}
              </div>
              <div>
                <span>Total: </span>
                {selectedCountryData.TotalDeaths}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <form>
              <select name="" id="" className="w-100" value={selectedCountry} onChange={handleSelectCountry}>
                <option value="Global">Global</option>
                {data.Countries.map((country) => (
                  <option key={country.Slug} value={country.Slug}>{country.Country}</option>
                ))}
              </select>
            </form>
          </div>
        </div>
      </div>
    ) : 'Loading data, please wait...'
  )
}

export default Body
