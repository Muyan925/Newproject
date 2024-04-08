import React, { useState, useEffect } from "react";

const GoogleMap = ({ latitude, longitude, showMap, taskId }) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // 加载 Google 地图
    const loadMap = () => {
      if (!window.google && !mapLoaded) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCvpnXHIAlE2JKSF37ypAv9-kbym9TgykQ`;
        script.defer = true;
        script.async = true;
        script.onload = () => {
          console.log('Google Maps API loaded');
          setMapLoaded(true);
        };
        document.head.appendChild(script);
      } else {
        setMapLoaded(true);
      }
    };

    loadMap();
  }, [mapLoaded]);

  useEffect(() => {
    // 初始化地图
    if (mapLoaded && showMap) {
      const map = new window.google.maps.Map(document.getElementById(`map-${taskId}`), {
        center: { lat: latitude, lng: longitude },
        zoom: 8,
      });

      // 在地图上添加标记
      new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: "Your Location",
      });
    }
  }, [mapLoaded, latitude, longitude, showMap]);

  return (
    <div>
      {showMap && (
        <div id={`map-${taskId}`} style={{ height: "300px", width: "100%" }}></div>
      )}
    </div>
  );
};

export default GoogleMap;
