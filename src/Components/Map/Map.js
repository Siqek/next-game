import 'leaflet/dist/leaflet.css';

import json from '@/resources/countries.geo.json';

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

export default function Map ({ countries, target })
{
    return (
        <MapContainer
            className='h-screen w-screen z-10 absolute top-0 left-0'
            center={[0.0, 0.0]}
            zoom={2}
            scrollWheelZoom={true}
            minZoom={2}
            maxZoom={2}
            maxBounds={[[-90.0, -180.0], [90.0, 180.0]]}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                json.features.filter(country => countries.includes(country.id) || target === country.id)?.map(country => (
                    <GeoJSON key={country.id} data={country} style={{color: `${target === country.id ? 'red' : 'blue'}`, weight: '1'}} />
                ))
            }
        </MapContainer>
    );
};