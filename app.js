const state = { task: "qa", lastText: "" };

const taskInfo = {
  qa: {
    label: "Ask a question",
    placeholder: "Example: What is the difference between RAM and ROM?",
    button: "Ask EduGenie",
    title: "Answer",
    endpoint: "/qa",
    sample: "What is the largest ocean in the world?"
  },
  explain: {
    label: "What should I explain?",
    placeholder: "Example: Explain the Pythagoras theorem to a beginner.",
    button: "Explain",
    title: "Explanation",
    endpoint: "/explain",
    sample: "Explain the Pythagoras theorem to a beginner."
  },
  quiz: {
    label: "Paste a topic or study material",
    placeholder: "Paste a passage or enter a topic for a 3-question quiz.",
    button: "Generate Quiz",
    title: "Quiz",
    endpoint: "/quiz",
    sample: "Photosynthesis is the process by which green plants use sunlight, water and carbon dioxide to produce glucose and oxygen. Chlorophyll absorbs light energy needed for the process."
  },
  summarize: {
    label: "Text to summarize",
    placeholder: "Paste your notes, chapter, or educational passage here.",
    button: "Summarize",
    title: "Summary",
    endpoint: "/summarize",
    sample: "The water cycle describes the continuous movement of water on, above, and below the surface of Earth. Water evaporates because of heat from the Sun, condenses into clouds, falls as precipitation, and can collect in rivers, lakes, oceans, and groundwater."
  },
  learn: {
    label: "Learning topic",
    placeholder: "Example: SQL, Python, Machine Learning, Biology…",
    button: "Build Learning Path",
    title: "Learning Path",
    endpoint: "/learn/recommendations",
    sample: "SQL"
  }
};

const tasks = document.querySelectorAll(".task");
const input = document.querySelector("#inputText");
const label = document.querySelector("#inputLabel");
const submitBtn = document.querySelector("#submitBtn");
const sampleBtn = document.querySelector("#sampleBtn");
const resultCard = document.querySelector("#resultCard");
const result = document.querySelector("#result");
const resultTitle = document.querySelector("#resultTitle");
const loading = document.querySelector("#loading");
const copyBtn = document.querySelector("#copyBtn");

function setTask(task) {
  state.task = task;
  const info = taskInfo[task];
  tasks.forEach(btn => btn.classList.toggle("active", btn.dataset.task === task));
  label.textContent = info.label;
  input.placeholder = info.placeholder;
  submitBtn.textContent = info.button;
  resultTitle.textContent = info.title;
  input.value = "";
  resultCard.classList.add("hidden");
}

tasks.forEach(btn => btn.addEventListener("click", () => setTask(btn.dataset.task)));
sampleBtn.addEventListener("click", () => input.value = taskInfo[state.task].sample);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderText(text) {
  result.innerHTML = `<div class="result-body">${escapeHtml(text)}</div>`;
}

function renderQuiz(quiz) {
  result.innerHTML = "";
  quiz.forEach((q, index) => {
    const box = document.createElement("div");
    box.className = "quiz-question";
    box.innerHTML = `<h3>${index + 1}. ${escapeHtml(q.question)}</h3>`;
    q.options.forEach(option => {
      const button = document.createElement("button");
      button.className = "option";
      button.textContent = option;
      button.addEventListener("click", () => {
        box.querySelectorAll(".option").forEach(b => {
          b.disabled = true;
          if (b.textContent === q.answer) b.classList.add("correct");
        });
        if (option !== q.answer) button.classList.add("wrong");
        const explanation = document.createElement("div");
        explanation.className = "explanation";
        explanation.innerHTML = `<strong>${option === q.answer ? "Correct!" : "Not quite."}</strong> ${escapeHtml(q.explanation)}`;
        box.appendChild(explanation);
      });
      box.appendChild(button);
    });
    result.appendChild(box);
  });
}

async function run() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  state.lastText = text;
  resultCard.classList.add("hidden");
  loading.classList.remove("hidden");
  submitBtn.disabled = true;

  try {
    const response = await fetch(taskInfo[state.task].endpoint, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Something went wrong.");

    resultTitle.textContent = taskInfo[state.task].title;
    if (state.task === "quiz") renderQuiz(data.quiz);
    else renderText(data.result);

    resultCard.classList.remove("hidden");
    resultCard.scrollIntoView({behavior: "smooth", block: "start"});
  } catch (error) {
    resultTitle.textContent = "Error";
    renderText(error.message);
    resultCard.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
    submitBtn.disabled = false;
  }
}

submitBtn.addEventListener("click", run);

input.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run();
});

copyBtn.addEventListener("click", async () => {
  const text = result.innerText;
  await navigator.clipboard.writeText(text);
  copyBtn.textContent = "✓";
  setTimeout(() => copyBtn.textContent = "📋", 1200);
});
