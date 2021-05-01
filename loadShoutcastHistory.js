// Configuration
const config = {
  shoutcasts: ["http://shoutcastexample.com"],
  historyPath: "/played.html",
  phpFilePath: "/php",
  corsAllowed: false,
  // loadInterval: 15000,
};
//

async function loadShoutcastHistory() {
  var shoutcastSongs = [];

  for (let index = 0; index < config.shoutcasts.length; index++) {
    const shoutcast = config.shoutcasts[index];
    let shoutcastUrl = shoutcast + config.historyPath;

    const response = await fetch(
      config.corsAllowed
        ? shoutcastUrl
        : `${config.phpFilePath}/getShoutcastHTML.php`,
      {
        method: config.corsAllowed ? "GET" : "POST",
        body: JSON.stringify({ url: shoutcastUrl }),
      }
    );

    if (response.ok)
      shoutcastSongs[index] = formatSongList(await response.text());
    else console.error("Shoutcast History: " + response.statusText);
  }
  return shoutcastSongs;
}

function formatSongList(html) {
  let formattedList = { played: [], playing: {} };

  if (html && html.includes("<html>")) {
    // Create dom element
    let element = document.createElement("html");
    element.innerHTML = html;
    let tables = element.getElementsByTagName("table");

    // Get songs elements
    let songList = [
      ...tables.item(tables.length - 1).getElementsByTagName("tr"),
    ];
    songList.splice(0, 1); // Remove information row: "Played ..."

    // Format the elements
    songList.forEach((songElement) => {
      let songData = songElement.getElementsByTagName("td");
      if (songData.length >= 2) {
        formattedList["played"].push({
          time: songData[0].innerHTML,
          name: songData[1].innerHTML,
        });
      }
    });

    // Store the current song in a specific field
    // and removes it from the history list
    if (formattedList["played"].length > 0) {
      formattedList["playing"] = formattedList["played"][0];
      formattedList["played"].splice(0, 1);
    }
  }
  return formattedList;
}
