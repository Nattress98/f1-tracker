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
import { GetMeetings } from "@/api/openf1";

// Dynamically import react-globe.gl to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const trackCoords = {
  61: [1.291576701185664, 103.86399552601567], // Singapore
}

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(tracks[0]);
  const globeRef = useRef(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  // Fetch tracks data from the API
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const now = new Date();
        const data = await GetMeetings(now.getFullYear());
        setTracks(data);
        console.log("Fetched tracks:", data);
        setSelectedTrack(data[data.length-1] ); // Set the first track as default
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };

    fetchTracks();
  }, []);

  // Update the globe's point of view when the selected track changes
  useEffect(() => {
    if (globeRef.current && selectedTrack) {
      console.log(selectedTrack.circuit_key)
      const s = trackCoords[selectedTrack.circuit_key || 0] || [0, 0];
      globeRef.current.pointOfView(
        { lat: s[0], lng: s[1], altitude: 1 },
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
      <div className="flex items-right justify-end p-4 absolute right-0 top-0 z-10">
        <Select 
          value={tracks.indexOf(selectedTrack)} 
          onValueChange={(value) => setSelectedTrack(tracks[value])} 
          disabled={tracks.length === 0}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a track" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Track</SelectLabel>
              {tracks.map((x, key) => (
                <SelectItem key={key} value={key}>
                  {x.meeting_name}
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
          enablePointerInteraction={false}
        />
      </div>
    </div>
  );
}
