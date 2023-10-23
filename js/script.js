// Inserisci gli ID degli artisti da cercare
const artisti = ["4q3ewBCX7sLwd24euuV69X", "3TVXtAsR1Inumwj472S9r4", "1vCWHaC5f2uS3yhpwWbIA6", "1Xyo4u8uXC1ZmMpatF05PJ", "06HL4z0CvFAxyc27GXpf02", "6eUKZXaKkcviH0Ku9w2n3V", "5YGY8feqx7naU7z4HrwZM6"];
// Credenziali dell'API Spotify
const clientId = '4f0266826bda4b02a38b3339cdcb59c2';
const clientSecret = '8d8989c32f5e4ed0a1019be04cb5fb25';
let accessToken = "BQDuDcthIC3wCzB5h1VYBpbaZOs6TCO8n6urqNV3YJ3h64ZzNFtshide8AsIdcERDfJyxCuuLVgS9XsUqmlGdJ9q1l8lEzC_wudQGxa6h9eP_QmBJ2s";


// Funzione per richiedere un nuovo access token
function requestAccessToken() {return new Promise((resolve, reject) => {
  const tokenUrl = "https://accounts.spotify.com/api/token";
  const tokenData = {
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  };

  fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(tokenData),
  })
    .then((response) => response.json())
    .then((data) => {
      accessToken = data.access_token;
      console.log("Nuovo access token:", accessToken);
      resolve();
    })
    .catch((error) => {
      console.error("Errore:", error);
      reject(error);
    });
});
}
window.onload = async function() {
  try {
    await requestAccessToken();
    cercareArtisti();
  } catch (error) {
    console.error("Failed to get access token:", error);
  }
}
async function getTracks(artistId) {
  const responseTopTracks = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=it`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const dataTopTracks = await responseTopTracks.json();
  const tracks = dataTopTracks.tracks;
  return tracks;
}

// Funzione per cercare gli artisti tramite l'API Spotify
async function cercareArtisti() {
  // Crea una stringa con gli ID degli artisti
  const ids = artisti.join(',');

  // Effettua la richiesta GET all'API Spotify per cercare gli artisti
  const response = await fetch(`https://api.spotify.com/v1/artists?ids=${ids}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .catch(e => {
      console.log(e);
    });
  const data = await response.json();

  // Verifica se la ricerca ha restituito risultati
  if (data.artists) {
    // Itera sui risultati della ricerca e stampa il nome e il genere di ciascun artista
    data.artists.forEach((artista, index) => {
      console.log(`Nome: ${artista.name}, Genere: ${artista.genres[0]}, Follower: ${artista.followers.total}, Url: ${artista.images[0].url}`);

      const artistNameElement = document.querySelector(`#artist-name-${index + 1}`);
      console.log(artistNameElement);
      artistNameElement.textContent = artista.name;

      const artistGenreElement = document.querySelector(`#artist-genre-${index + 1}`);
      artistGenreElement.textContent = `${artista.genres[0]}`;

      const artistFollowElement = document.querySelector(`#artist-follow-${index + 1}`);
      artistFollowElement.textContent = artista.followers.total.toLocaleString();

      const artistImgElement = document.querySelector(`#artist-img-${index + 1}`);
      artistImgElement.setAttribute("src", artista.images[0].url);
      //set top3 songs
      const artistaId = artista.id;
      const tracks = getTracks(artistaId);

      tracks.then(tracksObj => {
        //console.log(tracksObj[0])
        const firstSongImg = document.querySelector(`#album-fi-${index + 1}`);
        firstSongImg.setAttribute("src", tracksObj[0].album.images[0].url);

        const secondSongImg = document.querySelector(`#album-sec-${index + 1}`);
        secondSongImg.setAttribute("src", tracksObj[1].album.images[0].url);

        const thirdSongImg = document.querySelector(`#album-thi-${index + 1}`);
        thirdSongImg.setAttribute("src", tracksObj[2].album.images[0].url);
        //text set
        const firstSongTxt = document.querySelector(`#song-fi-${index + 1}`);
        firstSongTxt.textContent = tracksObj[0].name.replace(/\(.*?\)/g, "");

        const secondSongTxt = document.querySelector(`#song-sec-${index + 1}`);
        secondSongTxt.textContent = tracksObj[1].name.replace(/\(.*?\)/g, "").trim();

        const thirdSongTxt = document.querySelector(`#song-thi-${index + 1}`);
        thirdSongTxt.textContent = tracksObj[2].name.replace(/\(.*?\)/g, "").trim();
        //duration set
        const firstSongTime = document.querySelector(`#duration-fi-${index + 1}`);
        firstSongms = tracksObj[0].duration_ms;
        firstSongTime.textContent = new Date(firstSongms).toISOString().slice(15, 19);

        const secondSongTime = document.querySelector(`#duration-sec-${index + 1}`);
        secondSongms = tracksObj[1].duration_ms;
        secondSongTime.textContent = new Date(secondSongms).toISOString().slice(15, 19);

        const thirdSongTime = document.querySelector(`#duration-thi-${index + 1}`);
        thirdSongms = tracksObj[2].duration_ms;
        thirdSongTime.textContent = new Date(thirdSongms).toISOString().slice(15, 19);

      });

    });
  } else {
    console.log('Nessun artista trovato');
    requestAccessToken();
  }
}

// Richiesta iniziale per ottenere un access token
requestAccessToken();

// Richiesta per cercare gli artisti con il nuovo access token
cercareArtisti();

//Prende il nome dal form
document.querySelector(`.getartist`).addEventListener('submit', function (event) {
  event.preventDefault();

  const artistNameElement = document.querySelector(`#artist-name-searched`);
  artistNameElement.style.left = "";

  const card = document.querySelector(`.made`);
  card.style.display = "flex";
  //prende i valori dal form
  const artistNameRaw = document.querySelector(`.src`).value;
  const artistName = artistNameRaw.replace(/ /g, "+");
  console.log(artistName);

  async function getSearchedArtist() {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&market=IT&limit=1`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    const artisti = data.artists;

    if (artisti) {
      //set nome
      artistNameElement.textContent = artisti.items[0].name;

      const artistGenreElement = document.querySelector(`#artist-genre-searched`);
      artistGenreElement.textContent = artisti.items[0].genres[0];

      const artistFollowElement = document.querySelector(`#artist-follow-searched`);
      console.log(artisti.items[0].followers.total);

      if (artisti.items[0].followers.total < 1000000) {
        console.log("miao");
        artistNameElement.style.left = "-4em";
      }
      //set link
      const artistProfileLink = document.querySelector(".profile-link");
      artistProfileLink.href = artisti.items[0].external_urls.spotify;
      //set followers
      artistFollowElement.textContent = artisti.items[0].followers.total.toLocaleString();

      const artistImgElement = document.querySelector(`#artist-img-searched`);
      console.log(artisti.items[0].images[0].url);
      artistImgElement.setAttribute("src", artisti.items[0].images[0].url);

      //top 3 songs
      const artistId = artisti.items[0].id;
      const tracksObj = getTracks(artistId);

      tracksObj.then(tracks => {
        //image set
        const firstSongImg = document.querySelector(`.first`);
        firstSongImg.setAttribute("src", tracks[0].album.images[0].url);

        const secondSongImg = document.querySelector(`.second`);
        secondSongImg.setAttribute("src", tracks[1].album.images[0].url);

        const thirdSongImg = document.querySelector(`.last`);
        thirdSongImg.setAttribute("src", tracks[2].album.images[0].url);
        //text set
        const firstSongTxt = document.querySelector(`#song-fi-searched`);
        firstSongTxt.textContent = tracks[0].name.replace(/\(.*?\)/g, "");

        const secondSongTxt = document.querySelector(`#song-sec-searched`);
        secondSongTxt.textContent = tracks[1].name.replace(/\(.*?\)/g, "").replace(/-.*/, "").trim();

        const thirdSongTxt = document.querySelector(`#song-thi-searched`);
        thirdSongTxt.textContent = tracks[2].name.replace(/\(.*?\)/g, "").replace(/-.*/, "").trim();
        //duration set
        const firstSongTime = document.querySelector(`#duration-fi-searched`);
        firstSongms = tracks[0].duration_ms;
        firstSongTime.textContent = new Date(firstSongms).toISOString().slice(15, 19);

        const secondSongTime = document.querySelector(`#duration-sec-searched`);
        secondSongms = tracks[1].duration_ms;
        secondSongTime.textContent = new Date(secondSongms).toISOString().slice(15, 19);

        const thirdSongTime = document.querySelector(`#duration-thi-searched`);
        thirdSongms = tracks[2].duration_ms;
        thirdSongTime.textContent = new Date(thirdSongms).toISOString().slice(15, 19);
      })
      .catch(e=>{
          console.log(`Errore nella promise di tipo ${e}`);
      });
    };
  };
  getSearchedArtist();
});
