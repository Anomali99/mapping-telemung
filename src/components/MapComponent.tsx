import React, { useEffect } from "react";

import {
    MapContainer,
    TileLayer,
    Polygon,
    Polyline,
    Popup,
    Marker,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { PointType } from "@/data";
import PointCard from "@/components/PointCard";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
});

interface MapProps {
    center: [number, number];
    theme?: "default" | "satellite" | "dark";
    points?: PointType[];
    polylines?: [number, number][];
    polygons: {
        name: string;
        color?: string;
        boundary: [number, number][];
    }[];
}

const MapThemes: Record<string, React.ReactNode> = {
    default: (
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
        />
    ),
    satellite: (
        <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; <a href='https://www.esri.com/'>Esri</a>"
        />
    ),
    dark: (
        <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://carto.com/'>Carto</a>"
        />
    ),
};

const FitBounds: React.FC<{
    polygons: { boundary: [number, number][] }[];
    points: PointType[];
}> = ({ polygons, points }) => {
    const map = useMap();

    useEffect(() => {
        const coords: [number, number][] = [];

        polygons.forEach((poly) => coords.push(...poly.boundary));
        points.forEach((p) => coords.push(p.position));

        if (coords.length > 0) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [polygons, points, map]);

    return null;
};

const MapComponent: React.FC<MapProps> = ({
    center,
    theme = "default",
    points = [],
    polygons,
    polylines,
}) => {
    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{
                position: "absolute",
                height: "100dvh",
                width: "100dvw",
                zIndex: 1,
            }}
        >
            {MapThemes[theme]}

            <FitBounds polygons={polygons} points={points} />

            {polygons.map((item, index) => (
                <Polygon
                    key={index}
                    positions={item.boundary}
                    pathOptions={{
                        color: item.color || "blue",
                        fillColor: item.color || "blue",
                        fillOpacity: 0.3,
                    }}
                >
                    <Popup>{item.name}</Popup>
                </Polygon>
            ))}

            {points.map((point, index) => (
                <Marker key={index} position={point.position}>
                    <Popup maxWidth={500} minWidth={500}>
                        <div className="p-0">
                            <PointCard point={point} />
                        </div>
                    </Popup>
                </Marker>
            ))}

            {polylines && <Polyline positions={polylines} />}
        </MapContainer>
    );
};

export default MapComponent;
