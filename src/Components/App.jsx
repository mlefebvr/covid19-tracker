import { useState, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faViruses } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import '../Styles/App.css';

const Header = () => (
  <div className="container-fluid header">
    <div className="row row-header">
      <div className="col col-header d-flex justify-content-center">
        <div className="fs-3 fw-bold">
          <FontAwesomeIcon icon={faViruses} />
          Covid-19 Tracker
        </div>
      </div>
    </div>
    <div className="row row-header">
      <div className="col col-header d-flex justify-content-center">
        <div>
          API by:
          {' '}
          <a href="https://www.covid19api.com">covid19api.com</a>
        </div>
      </div>
    </div>
  </div>
)

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
            <div className="w-100 mb-2 text-center p-5 border rounded-3 bg-lightblue">
              <strong>Cases</strong>
              <div>
                {`New: ${selectedCountryData.NewConfirmed}`}
              </div>
              <div>
                {`Total: ${selectedCountryData.TotalConfirmed}`}
              </div>
            </div>
          </div>
          <div className="col d-flex justify-content-center">
            <div className="w-100 mb-2 text-center p-5 border rounded-3 bg-lightred">
              <strong>Deaths</strong>
              <div>
                {`New: ${selectedCountryData.NewDeaths}`}
              </div>
              <div>
                {`Total: ${selectedCountryData.TotalDeaths}`}
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

const App = () => (
  <>
    <Header />
    <Body />
  </>
)

export default App
