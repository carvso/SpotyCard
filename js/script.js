// Constants
const artisti = ["4q3ewBCX7sLwd24euuV69X", "3TVXtAsR1Inumwj472S9r4", "1vCWHaC5f2uS3yhpwWbIA6", "1Xyo4u8uXC1ZmMpatF05PJ", "06HL4z0CvFAxyc27GXpf02", "6eUKZXaKkcviH0Ku9w2n3V", "5YGY8feqx7naU7z4HrwZM6"];
const clientId = '4f0266826bda4b02a38b3339cdcb59c2';
const clientSecret = '8d8989c32f5e4ed0a1019be04cb5fb25';
let accessToken = "";

// Functional Helpers
const fetchAccessToken = async () => {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const tokenData = {
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  };

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(tokenData),
    });
    const data = await response.json();
    accessToken = data.access_token;
    console.log("New access token:", accessToken);
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

const fetchArtists = async () => {
  const ids = artisti.join(',');
  const response = await fetch(`https://api.spotify.com/v1/artists?ids=${ids}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.json();
};

const fetchTopTracks = async (artistId) => {
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=it`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  return data.tracks;
};

const trimToMaxLength = (str, maxLength) => str.length > maxLength ? str.substring(0, maxLength) : str;

const printName = (elementId, name) => {
  const element = document.querySelector(`#${elementId}`);
  element.textContent = name !== undefined ? name : "N/D";
};

const printFollowers = (elementId, count) => {
  const element = document.querySelector(`#${elementId}`);
  element.textContent = count !== undefined ? count.toLocaleString() : "N/D";
};

const setArtistImage = (elementId, url) => {
  const element = document.querySelector(`#${elementId}`);
  element.setAttribute("src", url);
};

const printSongInfo = (elementId, text) => {
  const element = document.querySelector(`#${elementId}`);
  element.textContent = text !== undefined ? text : "N/D";
};

const printSongDuration = (elementId, ms) => {
  const element = document.querySelector(`#${elementId}`);
  element.textContent = ms !== undefined ? new Date(ms).toISOString().slice(15, 19) : "N/D";
};

// Main Functions
const fetchAndPrintArtists = async () => {
  try {
    await fetchAccessToken();
    const data = await fetchArtists();

    if (data.artists) {
      data.artists.forEach(async (artist, index) => {
        printName(`artist-name-${index + 1}`, artist.name);
        printName(`artist-genre-${index + 1}`, artist.genres[0]);
        printFollowers(`artist-follow-${index + 1}`, artist.followers.total);
        setArtistImage(`artist-img-${index + 1}`, artist.images[0].url);

        const tracks = await fetchTopTracks(artist.id);

        setArtistImage(`album-fi-${index + 1}`, tracks[0].album.images[0].url);
        setArtistImage(`album-sec-${index + 1}`, tracks[1].album.images[0].url);
        setArtistImage(`album-thi-${index + 1}`, tracks[2].album.images[0].url);

        printSongInfo(`song-fi-${index + 1}`, trimToMaxLength(tracks[0].name, 11));
        printSongInfo(`song-sec-${index + 1}`, trimToMaxLength(tracks[1].name, 11));
        printSongInfo(`song-thi-${index + 1}`, trimToMaxLength(tracks[2].name, 11));

        printSongDuration(`duration-fi-${index + 1}`, tracks[0].duration_ms);
        printSongDuration(`duration-sec-${index + 1}`, tracks[1].duration_ms);
        printSongDuration(`duration-thi-${index + 1}`, tracks[2].duration_ms);
      });
    } else {
      console.log('No artists found');
      await fetchAccessToken();
    }
  } catch (error) {
    console.error("Failed to fetch artists:", error);
  }
};

const searchArtist = async () => {
  const artistNameElement = document.querySelector(`#artist-name-searched`);
  artistNameElement.style.left = "";

  const card = document.querySelector(`.made`);
  card.style.display = "flex";

  const artistNameRaw = document.querySelector(`.src`).value;
  const artistName = artistNameRaw.replace(/ /g, "+");

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&market=IT&limit=1`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    const artist = data.artists.items[0];

    if (artist) {
      printName('artist-name-searched', artist.name);
      printName('artist-genre-searched', artist.genres[0]);
      printFollowers('artist-follow-searched', artist.followers.total);
      setArtistImage('artist-img-searched', artist.images[0].url);

      const tracks = await fetchTopTracks(artist.id);

      printSongInfo('song-fi-searched', trimToMaxLength(tracks[0].name, 11));
      printSongInfo('song-sec-searched', trimToMaxLength(tracks[1].name, 11));
      printSongInfo('song-thi-searched', trimToMaxLength(tracks[2].name, 11));

      printSongDuration('duration-fi-searched', tracks[0].duration_ms);
      printSongDuration('duration-sec-searched', tracks[1].duration_ms);
      printSongDuration('duration-thi-searched', tracks[2].duration_ms);
    }
  } catch (error) {
    console.error("Failed to search for artist:", error);
  }
};

// Event Listeners
document.querySelector(`.getartist`).addEventListener('submit', (event) => {
  event.preventDefault();
  searchArtist();
});

// Initialization
window.onload = async () => {
  await fetchAndPrintArtists();
};

