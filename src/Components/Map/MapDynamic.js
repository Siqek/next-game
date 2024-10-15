import dynamic from "next/dynamic";

const Map = dynamic(() => import('@/Components/Map/Map'), {
    ssr: false
});

export default Map;