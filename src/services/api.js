const API_URL = "https://bfcfzzm5v27k4qaiqrwa5ukqbu0bwiri.lambda-url.eu-north-1.on.aws/";

export async function apiCreateGame(players) {
  return request("createGame", { players });
}

export async function apiAddRound(gameId, roundScores) {
  return request("addRound", { gameId, roundScores });
}

async function request(action, payload = {}) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload })
    });

    if (!response.ok) throw new Error("Erro na nuvem AWS");
    return await response.json();
  } catch (e) {
    console.error("API Error:", e);
    throw e;
  }
}

export async function apiGetAllPlayers() {
  return request("getAllPlayers");
}

export async function apiGetHistory() {
  return request("getHistory");
}

export async function apiGetRanking(mes = null) {
  return request("getRanking", { month: mes });
}