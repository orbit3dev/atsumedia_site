import { useRef } from "react";
import useResizeBannerImages from "./UseResizeBannerImages"; // Import the hook

const Banner = ({ bannerHtml }: { bannerHtml: string }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  useResizeBannerImages(bannerRef); // Apply the effect

  return (
    <div ref={bannerRef} dangerouslySetInnerHTML={{ __html: bannerHtml }} />
  );
};

export default Banner;
