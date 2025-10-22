import ReactVimeo from '@u-wave/react-vimeo';
import PropTypes from 'prop-types';

const Vimeo = ({ vimeoId, width = 1920, height = 1080 }) => (
  <ReactVimeo
    className="w-full"
    allowFullScreen
    autoplay={true}
    video={vimeoId}
    responsive
  />
);

Vimeo.propTypes = {
  vimeoId: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Vimeo;
