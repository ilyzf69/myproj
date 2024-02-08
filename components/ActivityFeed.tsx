// components/ActivityFeed.tsx
export default function ActivityFeed() {
  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <div className=" p-4 my-4 rounded-lg">
      {/* Flux d'activité avec vidéo intégrée */}
      <div className="video-responsive">
        <iframe
        
          width="560"
          height="315"
          src="https://www.youtube.com/embed/npBrRs6J0Jc"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
    </section>
  );
}
