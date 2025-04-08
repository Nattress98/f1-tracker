"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-globe.gl to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const tracks = [
  { name: "Albert Park - Aus", coordinates: [-37.8497, 144.968] },
  { name: "Shanghai - China", coordinates: [31.3389, 121.22] },
  { name: "Suzuka - Japan", coordinates: [34.8431, 136.541] },
  { name: "Bahrain - Bahrain", coordinates: [26.0325, 50.5106] },
  { name: "Miami - USA", coordinates: [25.958, -80.2389] },
  { name: "Monaco - Monaco", coordinates: [43.7347, 7.4206] },
  { name: "Montreal - Canada", coordinates: [45.5, -73.5228] },
  { name: "Silverstone - UK", coordinates: [52.0733, -1.0142] },
  { name: "Hungaroring - Hungary", coordinates: [47.5789, 19.2486] },
  { name: "Spa-Francorchamps - Belgium", coordinates: [50.4372, 5.9714] },
  { name: "Zandvoort - Netherlands", coordinates: [52.3889, 4.5406] },
  { name: "Monza - Italy", coordinates: [45.6156, 9.2811] },
  { name: "Singapore - Singapore", coordinates: [1.2914, 103.864] },
  { name: "Las Vegas - USA", coordinates: [36.1699, -115.1398] },
];

export default function Home() {
  const [selectedTrack, setSelectedTrack] = useState(tracks[0]);
  const globeRef = useRef(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Update the globe's point of view when the selected track changes
  useEffect(() => {
    if (globeRef.current && selectedTrack) {
      globeRef.current.pointOfView(
        { lat: selectedTrack.coordinates[0], lng: selectedTrack.coordinates[1], altitude: 1 },
        1000
      );
    }
  }, [selectedTrack]);

  // Set the globe dimensions to match the window size
  useEffect(() => {
    const updateDimensions = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    updateDimensions(); // Set initial dimensions
    window.addEventListener("resize", updateDimensions); // Update on window resize
    return () => window.removeEventListener("resize", updateDimensions); // Cleanup
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Select Dropdown */}
      <div className="flex items-right justify-end p-4 absolute right-0 top-0 z-10">
        <Select onValueChange={(value) => setSelectedTrack(tracks[value])} defaultValue={0}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a track" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Track</SelectLabel>
              {tracks.map((x, key) => (
                <SelectItem key={key} value={key}>
                  {x.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Globe */}
      <div className="absolute top-0 left-0 w-full h-full">
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="rgb(110, 110, 110, 0)"
          animateIn={true}
          width={windowWidth} // Dynamically set width
          height={windowHeight} // Dynamically set height
        />
      </div>
    </div>
  );
}
