document.getElementById("filterForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const subject = document.getElementById("subject").value;
  const grade = document.getElementById("grade").value;
  const duration = document.getElementById("duration").value;
  const keywords = document.getElementById("keywords").value.trim();

  // Load API key from config.js
  const API_KEY = CONFIG.API_KEY;
  const MAX_RESULTS = 10;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<p><strong>Searching for videos...</strong></p>`;

  const query = `${keywords} ${subject} ${grade} education`;

  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&maxResults=${MAX_RESULTS}&q=${encodeURIComponent(
    query
  )}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      resultsDiv.innerHTML = "";

      const filteredVideos = data.items.filter((item) => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        return (
          title.includes(subject.toLowerCase()) ||
          description.includes(subject.toLowerCase())
        );
      });

      if (filteredVideos.length === 0) {
        resultsDiv.innerHTML = `<p>No matching videos found.</p>`;
        return;
      }

      filteredVideos.forEach((video) => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-result");
        videoCard.innerHTML = `
          <h4>${video.snippet.title}</h4>
          <img src="${
            video.snippet.thumbnails.medium.url
          }" alt="Thumbnail" width="100%">
          <p>${video.snippet.description.slice(0, 100)}...</p>
          <a href="https://www.youtube.com/watch?v=${
            video.id.videoId
          }" target="_blank">Watch Video</a>
          <hr/>
        `;
        resultsDiv.appendChild(videoCard);
      });
    })
    .catch((err) => {
      console.error("API Error:", err);
      resultsDiv.innerHTML = `<p style="color:red;">Failed to fetch videos. Check your API key or network connection.</p>`;
    });
});
