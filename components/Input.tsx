import { Loader } from "@googlemaps/js-api-loader";
import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  onPlaceSelected: (place: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  onPlaceSelected,
  ...props
}) => {
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
      libraries: ["places"],
    });
    // /initializing google maps api with places api
    loader
      .load()
      .then(() => {
        if (!google.maps || !google.maps.places) {
          console.error("Google Maps Places API not available.");
          return;
        }

        autoCompleteRef.current = new google.maps.places.Autocomplete(
          document.getElementById(id) as HTMLInputElement
        );

        autoCompleteRef.current.addListener("place_changed", () => {
          const place = autoCompleteRef.current?.getPlace();
          if (place && place.formatted_address) {
            onPlaceSelected(place.formatted_address);
          }
          // autocomplete function from places api
        });
      })
      .catch((err) => {
        console.error("Error loading Google Maps API:", err);
      });

    return () => {
      if (autoCompleteRef.current) {
        autoCompleteRef.current.unbindAll();
      }
    };
  }, [id, onPlaceSelected]);

  return (
    <div className="flex flex-col gap-y-1 text-black">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <input type="text" id={id} {...props} className="p-2 border rounded-lg" />
    </div>
  );
};

export default Input;
