"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Input from "@/components/Input";
import { X } from "lucide-react";

const Map = dynamic(() => import("@/components/DirectionMap"), { ssr: false });

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [showDistance, setShowDistance] = useState(false);
  const [distanceError, setDistanceError] = useState(false);
  const [waypoints, setWayPoints] = useState<google.maps.DirectionsWaypoint[]>(
    []
  );

  const handleDistanceChange = (dist: string) => {
    if (dist !== "Error") {
      setDistance(dist);
      setDistanceError(false);
    } else {
      setDistance("");
      setDistanceError(true);
    }
  };

  const handleSetOrigin = (place: string) => {
    setOrigin(place);
    setDistance("");
    setShowDistance(false);
    setDistanceError(false);
  };

  const handleDestination = (place: string) => {
    setDestination(place);
    setDistance("");
    setShowDistance(false);
    setDistanceError(false);
  };

  const handleAddWayPoint = (place: string) => {
    const newWayPoint: google.maps.DirectionsWaypoint = {
      location: place,
      stopover: true,
    };
    setWayPoints((prevWaypoints) => [...prevWaypoints, newWayPoint]);
  };

  const handleRemoveWayPoint = (location: string) => {
    setWayPoints((prevWaypoints) =>
      prevWaypoints.filter(
        (waypoint) => waypoint.location?.toString() !== location
      )
    );
  };

  return (
    <div className="w-full h-full lg:h-[calc(100vh-4rem)] flex items-center justify-center flex-col gap-8 bg-[#F4F8FA] p-12">
      <p className="text-[#1B31A8] font-sans text-xl tracking-normal font-normal">
        Let&apos;s calculate <span className="font-medium">distance</span> from
        Google Maps
      </p>

      <div className="lg:min-w-[1200px] grid lg:grid-cols-2 grid-cols-1 gap-4">
        <div className="flex items-start flex-col gap-6 w-full">
          <div className="flex-col gap-8 flex lg:flex-row w-full ">
            <div className="w-full flex flex-col gap-y-6">
              <Input
                label="Origin"
                id="origin"
                onPlaceSelected={handleSetOrigin}
                onChange={() => setShowDistance(false)}
              />
              <Input
                label="Destination"
                id="destination"
                onPlaceSelected={handleDestination}
                onChange={() => setShowDistance(false)}
              />
              {waypoints.length > 0 && (
                <div className="flex flex-col gap-2 text-black">
                  <p className="text-lg font-medium">Stops:</p>
                  {waypoints.map((waypoint, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-x-2 items-center"
                    >
                      <div className="h-2 aspect-square bg-black rounded-full" />
                      <p>{waypoint.location?.toString()}</p>
                      <button
                        className="text-rose-400"
                        onClick={() => {
                          handleRemoveWayPoint(
                            waypoint.location?.toString() as string
                          );
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <Input
                  label="Add Stops"
                  id="waypoint"
                  onPlaceSelected={handleAddWayPoint}
                />
              </div>
            </div>

            <div className="w-full h-full flex items-center justify-center">
              <button
                className="px-6 py-3 text-lg rounded-3xl bg-[#1B31A8] text-white"
                onClick={() => setShowDistance(true)}
              >
                Calculate
              </button>
            </div>
          </div>

          {showDistance && (
            <div className="w-full lg:max-w-[500px] rounded-lg border mt-auto">
              <div className="w-full p-4 flex items-center justify-between bg-[#FFFFFF] text-black rounded-t-lg">
                <p className="text-lg font-medium">Distance</p>
                {distanceError ? (
                  <p className="text-rose-400">Error fetching Distance</p>
                ) : (
                  <p className="text-xl font-bold text-[#0079FF]">{distance}</p>
                )}
              </div>
              <div className="p-4 items-center rounded-b-lg">
                {distanceError ? (
                  <p className="text-rose-400">Error fetching Distance</p>
                ) : (
                  <p className="text-base text-black">
                    The distance between{" "}
                    <span className="font-medium">{origin}</span> and{" "}
                    <span className="font-medium">{destination}</span> via
                    selected route is{" "}
                    <span className="font-medium">{distance}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <Map
            origin={origin}
            destination={destination}
            className=""
            onDistanceChange={handleDistanceChange}
            // @ts-ignore
            waypoints={waypoints}
          />
        </div>
      </div>
    </div>
  );
}
