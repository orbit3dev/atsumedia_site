import { useEffect } from "react";

const useResizeBannerImages = (containerRef: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const images = containerRef.current.querySelectorAll("img");

    images.forEach((img) => {
      img.style.maxHeight = "300px"; // Limit max height to 300px
      img.style.width = "auto"; // Maintain aspect ratio
      img.style.objectFit = "contain"; // Prevent cutting off parts of the image
      img.style.display = "block"; // Prevent inline overlap
      img.style.margin = "auto"; // Center horizontally
      img.style.alignSelf = "center"; // Center vertically
    });

    // Ensure the container is flexible and centers images
    containerRef.current.style.overflow = "hidden";
    containerRef.current.style.display = "flex";
    containerRef.current.style.flexWrap = "wrap"; // Prevents overflow
    containerRef.current.style.justifyContent = "center"; // Center images horizontally
    containerRef.current.style.alignItems = "center"; // Center images vertically
    containerRef.current.style.gap = "10px"; // Adds spacing
  }, [containerRef]);
};

export default useResizeBannerImages;
