const API_URL = "https://bfcfzzm5v27k4qaiqrwa5ukqbu0bwiri.lambda-url.eu-north-1.on.aws/";

async function request(action, body = {}) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...body }),
    });

    if (!response.ok) {
      const text = await response.text();
      try {
          const errData = JSON.parse(text);
          throw new Error(errData.error || "Erro na API");
      } catch (e) {
          if (e.message !== "Erro na API") throw e;
          throw new Error("Erro na nuvem AWS (" + response.status + ")");
      }
    }
    return response.json();
  } catch (e) {
    console.error("API Request Error:", e);
    throw e;
  }
}

export async function apiCreateGame(players, location) {
  return request("createGame", { players, location });
}

export async function apiAddRound(gameId, roundScores, salemaPlayerIndex) {
  return request("addRound", { gameId, roundScores, salemaPlayerIndex });
}

export async function apiGetRanking(mes = null) {
  return request("getRanking", { month: mes });
}

export async function apiGetAllPlayers() {
  return request("getAllPlayers");
}

export async function apiGetHistory() {
  return request("getHistory");
}

export async function apiGetActiveGames() {
  return request("getActiveGames");
}

export async function apiUndoRound(gameId) {
  return request("undoRound", { gameId });
}