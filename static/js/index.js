// Autoplay the muted comparison videos only while they are on screen, so the
// page does not download every clip up front. Videos keep their controls, so
// they remain playable if this script does not run.
(function () {
  var videos = Array.prototype.slice.call(document.querySelectorAll('video.lazy-video'));
  if (videos.length === 0) return;

  function safePlay(video) {
    video.muted = true;
    var p = video.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  if (!('IntersectionObserver' in window)) {
    videos.forEach(safePlay);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var video = entry.target;
      if (entry.isIntersecting) {
        safePlay(video);
      } else if (!video.paused) {
        video.pause();
      }
    });
  }, { threshold: 0.25 });

  videos.forEach(function (video) { observer.observe(video); });
})();
