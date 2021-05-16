import { useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faViruses } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import '../Styles/App.css';

const Header = () => (
  <Container fluid>
    <Row className="row-header bg-primary text-white">
      <Col className="col-header d-flex justify-content-center">
        <h1>
          <FontAwesomeIcon icon={faViruses} />
          <strong>Covid-19 Tracker</strong>
        </h1>
      </Col>
    </Row>
    <Row className="row-header bg-primary text-white">
      <Col className="col-header d-flex justify-content-center">
        <div>
          API by:
          {' '}
          <a className="text-light" href="https://www.covid19api.com">covid19api.com</a>
        </div>
      </Col>
    </Row>
  </Container>
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
      <Container>
        <Row>
          <Col className="d-flex justify-content-center">
            <h3>{selectedCountryData.Country}</h3>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <div>
              {moment(selectedCountryData.Date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <div className="w-100 mb-2 text-center p-5 border rounded-3 bg-lightblue">
              <strong>Cases</strong>
              <div>
                {`New: ${selectedCountryData.NewConfirmed}`}
              </div>
              <div>
                {`Total: ${selectedCountryData.TotalConfirmed}`}
              </div>
            </div>
          </Col>
          <Col className="d-flex justify-content-center">
            <div className="w-100 mb-2 text-center p-5 border rounded-3 bg-lightred">
              <strong>Deaths</strong>
              <div>
                {`New: ${selectedCountryData.NewDeaths}`}
              </div>
              <div>
                {`Total: ${selectedCountryData.TotalDeaths}`}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Control as="select" value={selectedCountry} onChange={handleSelectCountry}>
                <option value="Global">Global</option>
                {data.Countries.map((country) => (
                  <option key={country.Slug} value={country.Slug}>{country.Country}</option>
                ))}
              </Form.Control>
            </Form>
          </Col>
        </Row>
      </Container>
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
