import PropTypes from 'prop-types';
import { useState } from 'react';
import Image from 'next/image';

import Vimeo from './Vimeo';
import Youtube from './Youtube';
import playIcon from '/public/icons/svg/play.svg';

const Video = ({
  youtubeId = '',
  vimeoId = '',
  thumbnail,
  videoThumb,
  width = 1920,
  height = 1080,
}) => {
  const [thumbnailIsActive, setThumbnailActive] = useState(true);

  if (thumbnailIsActive) {
    return (
      <div className="w-full relative cursor-pointer">
        <div className="absolute inset-0 bg-black/50 z-[1]" />

        <button
          className="absolute top-1/2 left-1/2 text-5xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-all hover:duration-200 hover:ease-in-out z-10"
          onClick={() => setThumbnailActive(false)}
          aria-label="Reproduzir vídeo"
        >
          <Image src={playIcon} alt="" width={48} height={48} />
        </button>
        {videoThumb ? (
          <video
            className="w-full h-auto object-contain cursor-pointer"
            width={width}
            height={height}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoThumb} type="video/mp4" />
            Seu navegador não suporta vídeos incorporados.
          </video>
        ) : (
          <Image
            src={`/images/thumbnails/${thumbnail}`}
            alt="Clique para assistir"
            className="w-full h-auto object-contain cursor-pointer"
            width={width}
            height={height}
            priority
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {youtubeId ? (
        <Youtube youtubeId={youtubeId} width={width} height={height} />
      ) : (
        <Vimeo vimeoId={vimeoId} width={width} height={height} />
      )}
    </div>
  );
};

Video.propTypes = {
  thumbnail: PropTypes.string,
  videoThumb: PropTypes.string,
  youtubeId: PropTypes.string,
  vimeoId: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};

Video.defaultProps = {
  youtubeId: '',
  vimeoId: '',
  width: 1920,
  height: 1080,
};

export default Video;
