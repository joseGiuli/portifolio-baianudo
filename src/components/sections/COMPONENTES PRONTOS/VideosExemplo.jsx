const { default: Video } = require('@/components/videos/Video');

<div className="w-full rounded-2xl bg-black overflow-hidden">
  <Video
    vimeoId="1024171766"
    // videoThumb="/images/thumbvideo.mp4"
    thumbnail="thumb.png"
    width={1920}
    height={1080}
  />
</div>;
