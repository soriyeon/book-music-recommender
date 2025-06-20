export function saveRecommendation(format, purpose, videoId) {
  try {
    const saved = JSON.parse(localStorage.getItem("savedRecommendations") || "[]");

    const today = getToday(); 

    const isDuplicate = saved.some(
      (entry) =>
        entry.date === today &&
        entry.videoId === videoId &&
        entry.format === format &&
        entry.purpose === purpose
    );

    if (isDuplicate) {
      alert("❗이 추천은 이미 저장되어 있어요!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      format,
      purpose,
      videoId,
      date: today
    };

    localStorage.setItem("savedRecommendations", JSON.stringify([newEntry, ...saved]));
    return { success: true, message: "❤️ 추천이 저장되었습니다!" };
  } catch (err) {
    console.error("저장 오류:", err);
    return { success: false, message: "❌ 저장 중 오류 발생" };
  }
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadSavedRecommendations() {
  return JSON.parse(localStorage.getItem("savedRecommendations") || "[]");
}

export function deleteRecommendation(id) {
  const saved = loadSavedRecommendations();
  const filtered = saved.filter((entry) => entry.id !== id);
  localStorage.setItem("savedRecommendations", JSON.stringify(filtered));
}
