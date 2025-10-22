import YouTube from '@u-wave/react-youtube';
import PropTypes from 'prop-types';

const Youtube = ({ youtubeId, width = 1920, height = 1080 }) => (
  <YouTube
    className="w-full aspect-video"
    video={youtubeId}
    autoplay={true}
    allowFullScreen
    responsive
  />
);

Youtube.propTypes = {
  youtubeId: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Youtube;
