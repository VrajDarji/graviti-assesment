import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Bike, Bus, Car, CarFront, Footprints } from "lucide-react";

type Props = {
  origin: string;
  destination: string;
  className?: string;
  waypoints: [];
  onDistanceChange: (distance: string) => void;
};

const DirectionMap = ({
  origin,
  destination,
  className,
  onDistanceChange,
  waypoints,
}: Props) => {
  
  const MapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [mode, setMode] = useState<
    "DRIVING" | "BICYCLING" | "WALKING" | "TRANSIT"
  >("DRIVING");

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (MapRef.current) {
        const googleMap = new google.maps.Map(MapRef.current, {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
        // initialising map
        setMap(googleMap);
        setDirectionsService(new google.maps.DirectionsService());
        const renderer = new google.maps.DirectionsRenderer();
        renderer.setMap(googleMap);
        setDirectionsRenderer(renderer);
        setMode("DRIVING");
      }
    });
  }, []);

  useEffect(() => {
    if (origin && destination && directionsService && directionsRenderer) {
      const travelMode = google.maps.TravelMode[mode];
      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRenderer.setDirections(result);
            const route = result.routes[0];
            let totalDist = 0;
            route.legs.forEach((leg) => {
              if (leg.distance) {
                totalDist += leg.distance?.value;
              }
            });
            // calculating total distance with waypoints
            const totalDistanceInKm = (totalDist / 1000).toFixed(2) + " km";
            onDistanceChange(totalDistanceInKm);
            console.log(totalDistanceInKm);
          } else {
            console.error(`Error fetching directions ${status}`);
            onDistanceChange("Error");
          }
        }
      );
    }
  }, [
    origin,
    destination,
    directionsService,
    directionsRenderer,
    mode,
    onDistanceChange,
    waypoints,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div ref={MapRef} className={`w-full aspect-square ${className}`} />
      <div className="flex justify-center space-x-4">
        <button
          className={`${
            mode === "DRIVING"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          } px-2 py-1 rounded-md flex flex-row text-sm gap-x-2 items-center`}
          onClick={() => setMode("DRIVING")}
        >
          Driving
          <CarFront size={16} />
        </button>
        <button
          className={`${
            mode === "BICYCLING"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          } px-2 py-1 rounded-md flex flex-row text-sm gap-x-2 items-center`}
          onClick={() => setMode("BICYCLING")}
        >
          Bicycling
          <Bike size={16} />
        </button>
        <button
          className={`${
            mode === "TRANSIT"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          } px-2 py-1 rounded-md flex flex-row text-sm gap-x-2 items-center`}
          onClick={() => setMode("TRANSIT")}
        >
          Transit
          <Bus size={16} />
        </button>
        <button
          className={`${
            mode === "WALKING"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          } px-2 py-1 rounded-md flex flex-row text-sm gap-x-2 items-center`}
          onClick={() => setMode("WALKING")}
        >
          Walking
          <Footprints size={16} />
        </button>
      </div>
    </div>
  );
};

export default DirectionMap;
