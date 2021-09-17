import React from 'react'

import { Map, TileLayer } from 'react-leaflet'

function Maps() {
    return (
        <div className="map">
            <Map>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </Map>


            <h1>I am a map</h1>

        </div>
    )
}

export default Maps
