const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const COUNT = import.meta.env.VITE_QUESTION_COUNT || 5;
const THRESHOLD = import.meta.env.VITE_PASS_THRESHOLD || 3;

export const fetchQuestions = async () => {
  if (!GAS_URL) {
    console.warn("API URL not configured in .env. Using mock data.");
    return [
      { id: "1", question: "這是一個測試題目 1？", options: { A: "選項A", B: "選項B", C: "選項C", D: "選項D" } },
      { id: "2", question: "這是一個測試題目 2？", options: { A: "選項A", B: "選項B", C: "選項C", D: "選項D" } },
      { id: "3", question: "這是一個測試題目 3？", options: { A: "選項A", B: "選項B", C: "選項C", D: "選項D" } }
    ];
  }
  const response = await fetch(`${GAS_URL}?count=${COUNT}`);
  if (!response.ok) throw new Error("Failed to fetch questions");
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
};

export const submitAnswers = async (userId, userAnswers) => {
  if (!GAS_URL) {
    console.warn("API URL not configured in .env. Using mock data.");
    return { score: 3, passed: true };
  }
  
  const payload = {
    id: userId,
    answers: userAnswers,
    passThreshold: THRESHOLD
  };

  const response = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    }
  });
  
  if (!response.ok) throw new Error("Failed to submit answers");
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data;
};
