import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

export class Maps extends React.Component {
  render() {
    const mapStyles = {
      width: '100%',
      height: '100%'
    };
    return (
      <Map
        google={this.props.google}
        zoom={15}
        // style={mapStyles}
        initialCenter={{ lat: 9.761927, lng: 79.95244 }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_KEY
})(Maps);
