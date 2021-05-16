import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faViruses } from '@fortawesome/free-solid-svg-icons'

const Header = () => (
  <div className="container-fluid header text-white bg-primary bg-gradient">
    <div className="row row-header">
      <div className="col col-header d-flex justify-content-center">
        <div className="fs-3 fw-bolder">
          <FontAwesomeIcon icon={faViruses} />
          Covid-19 Tracker
        </div>
      </div>
    </div>
    <div className="row row-header">
      <div className="col col-header d-flex justify-content-center">
        <div>
          <span>API by: </span>
          <a href="https://www.covid19api.com">covid19api.com</a>
        </div>
      </div>
    </div>
  </div>
)

export default Header
