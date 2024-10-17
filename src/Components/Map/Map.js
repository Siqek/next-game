import 'leaflet/dist/leaflet.css';

import json from '@/resources/countries.geo.json';

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

export default function Map ({ countries, target, current })
{
    return (
        <>
            <MapContainer
                className='h-screen w-screen z-10 absolute top-0 left-0'
                center={[0.0, 0.0]}
                zoom={2}
                scrollWheelZoom={true}
                minZoom={0}
                maxZoom={2}
                maxBounds={[[-90.0, -180.0], [90.0, 180.0]]}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    json.features.filter(country => countries.includes(country.id) || target === country.id)?.map(country => {
                        let color = 'blue';
                        switch (country.id)
                        {
                            case target:
                                color = 'red';
                                break;
                            case countries[0]:
                                color = 'green';
                                break;
                            case current:
                                color = 'purple';
                                break;
                        };
                        return <GeoJSON
                            key={country.id}
                            data={country}
                            style={{
                                color: `${color}`,
                                weight: '1'
                            }}
                        />
                    })
                }
            </MapContainer>
            <div className='absolute z-20 -bottom-0 -right-0 p-4 mb-8 rounded-l-2xl border border-[#1a1a1a] w-fit h-fit bg-[#1a1a1acc]'>
                {[
                    { textColor: 'text-white',  content: 'LEGEND' },
                    { textColor: 'text-red-500',    content: "- RED -" },
                    { textColor: 'text-red-500',    content: 'Your destination country' },
                    { textColor: 'text-green-500',  content: '- GREEN -' },
                    { textColor: 'text-green-500',  content: 'Your starting country' },
                    { textColor: 'text-purple-500',  content: '- PURPLE -' },
                    { textColor: 'text-purple-500',  content: 'Current contry' },
                    { textColor: 'text-blue-500',   content: '- BLUE -' },
                    { textColor: 'text-blue-500',   content: 'Countries you have visited' }
                ].map(({textColor, content}, index) => (
                    <h1 key={index} className={`text-right ${textColor}`}>{content}</h1>
                ))}
            </div>
        </>
    );
};