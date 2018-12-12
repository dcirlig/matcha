import React from "react";
import axios from "axios";
import Geolocation from "react-geolocation";
import Geocoder from "react-geocoder-mapbox";
import RegisterModal from "../../RegisterAndConnection/RegisterModal";
import { MDBBtn, MDBIcon } from "mdbreact";
const Geo = require("open-street-map-reverse-geo-node-client/dist");

class geolocationComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken:
        "pk.eyJ1IjoiY25haXJpIiwiYSI6ImNqcDluZWEyNTBlcGEzcHNibXV1N2dlNXcifQ.YsEIDIRvq0b-B0m8fu1SOw",
      country:
        "-4.693475439949566,42.35188757142487,8.307556696755341,51.07160220303314",
      coords: {
        latitude: sessionStorage.getItem("latitude"),
        longitude: sessionStorage.getItem("longitude")
      },
      fullAddress: "",
      errors: "",
      userId: sessionStorage.getItem("userId")
    };
    this.reverseLocation = this.reverseLocation.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.handleClearErrorMessage = this.handleClearErrorMessage.bind(this);
  }

  async componentDidMount() {
    await sessionStorage.getItem("userId");
    if (
      sessionStorage.getItem("latitude") !== "" &&
      sessionStorage.getItem("longitude") !== ""
    ) {
      await this.setState({
        userId: sessionStorage.getItem("userId"),
        coords: {
          latitude: sessionStorage.getItem("latitude"),
          longitude: sessionStorage.getItem("longitude")
        }
      });
      await this.reverseLocation(this.state);
      sessionStorage.setItem("latitude", "");
      sessionStorage.setItem("longitude", "");
      return;
    } else {
      axios
        .post(`/api/displayAddress`, sessionStorage)

        .then(async res => {
          if (res.data.success) {
            await this.setState({
              success: res.data.success,
              fullAddress: res.data.fullAddress
            });
          } else if (res.data.error) {
            await this.setState({ error: res.data.error });
          }
        })
        .catch(err => {});
    }
  }

  async onSelect(address) {
    if (address.center[0] && address.center[1]) {
      await this.setState({
        coords: {
          longitude: address.center[0],
          latitude: address.center[1]
        }
      });
      await this.reverseLocation(this.state);
    } else {
      await this.setState({
        errors: "Invalid address! Please enter a valid one."
      });
    }
  }

  async reverseLocation(coordinates) {
    const reverse = new Geo.ReverseGeocoder();

    await reverse
      .getReverse(coordinates.coords.latitude, coordinates.coords.longitude)
      .then(async location => {
        await this.setState({
          fullAddress: location.displayName,
          coords: {
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
    axios
      .post(`/api/fillAddress`, this.state)

      .then(async res => {
        if (res.data.success) {
          await this.setState({
            success: res.data.success,
            fullAddress: res.data.fullAddress
          });
        } else if (res.data.error) {
          await this.setState({ error: res.data.error });
        }
      })
      .catch(err => {});
  }

  async handleErrors(error) {
    if (error.message === "User denied Geolocation") {
      await this.setState({
        error:
          "Geolocation is inactive! Please, activate it from your browser if you want to refresh your position."
      });
    }
  }

  handleClearErrorMessage() {
    this.setState({ error: undefined });
  }

  render() {
    const { fullAddress, accessToken, country, error } = this.state;
    const manuallyAddAddress = "Enter your address";
    const inputClass = "mapboxgl-ctrl-geocoder";
    const resultsClass = "mapbox-ctrl-results";
    const resultClass = "mapbox-ctrl-result";
    return (
      <div className="geolocationBlock">
        <p className="tagIntro warm-flame-gradient">Meet people around you:</p>
        {fullAddress && <p>{fullAddress}</p>}
        <Geocoder
          accessToken={accessToken}
          onSelect={this.onSelect}
          showLoader={true}
          bbox={country}
          inputPlaceholder={manuallyAddAddress}
          inputClass={inputClass}
          resultsClass={resultsClass}
          resultClass={resultClass}
        />
        <Geolocation
          lazy
          onError={this.handleErrors}
          onSuccess={this.reverseLocation}
          render={({
            position: { coords: { latitude, longitude } = {} } = {},
            error,
            getCurrentPosition
          }) => (
            <div>
              <br />
              <p className="tagIntro warm-flame-gradient">
                or get geolocated with your browser
              </p>
              <MDBBtn
                onClick={getCurrentPosition}
                className="small-button"
                rounded
                size="lg"
                gradient="peach"
              >
                Refresh Position
                <MDBIcon icon="map-pin" className="ml-2" size="lg" />
              </MDBBtn>
            </div>
          )}
        />
        <RegisterModal
          errorMessage={error}
          handleClearErrorMessage={this.handleClearErrorMessage}
        />
      </div>
    );
  }
}

export default geolocationComponent;
