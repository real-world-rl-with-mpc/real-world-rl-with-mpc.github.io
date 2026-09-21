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

// The main supplementary video starts on click only. Its first frame may be
// black, so show a frame from one second in as the poster and rewind on first play.
(function () {
  var supp = document.getElementById('supp-video');
  if (!supp) return;
  var POSTER_TIME = 1.0;
  var rewound = false;

  supp.addEventListener('loadedmetadata', function () {
    if (supp.duration > POSTER_TIME) supp.currentTime = POSTER_TIME;
  });

  supp.addEventListener('play', function () {
    if (!rewound) {
      rewound = true;
      if (Math.abs(supp.currentTime - POSTER_TIME) < 0.25) supp.currentTime = 0;
    }
  });
})();
