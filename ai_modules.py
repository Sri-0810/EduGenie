import json
import re
from .gemini_client import generate

def explain_topic(text: str) -> str:
    prompt = f"""
You are EduGenie, a friendly educational tutor.
Explain the following topic to a beginner.

Requirements:
- Use simple language.
- Start with a short definition.
- Explain step-by-step.
- Give a small real-world example.
- Mention 3 key points at the end.
- Avoid unnecessary jargon.

Topic:
{text}
"""
    return generate(prompt)

def answer_question(text: str) -> str:
    prompt = f"""
You are EduGenie, an accurate academic question-answering assistant.
Answer the student's question clearly and concisely.

Question:
{text}

Give the direct answer first, then a short explanation.
If the question is ambiguous, state the assumption you are using.
"""
    return generate(prompt)

def summarize_text(text: str) -> str:
    prompt = f"""
Summarize the following educational text for a student.

Requirements:
- Preserve the important facts.
- Remove repetition and filler.
- Use headings or bullet points when helpful.
- Make it easy to revise quickly.
- Do not invent information.

Text:
{text}
"""
    return generate(prompt)

def learning_path(topic: str) -> str:
    prompt = f"""
Create a personalized learning path for the topic: {topic}

Structure it as:
1. Beginner foundations
2. Intermediate concepts
3. Advanced concepts
4. Suggested timeline
5. Practice/project ideas
6. Recommended resource types

For each stage, list what to learn and why.
Keep it practical and student-friendly.
Do not invent exact URLs. Mention reputable resource names only when you are confident.
"""
    return generate(prompt)

def _extract_json(text: str):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.I)
    text = re.sub(r"\s*```$", "", text)
    match = re.search(r"\[[\s\S]*\]", text)
    if not match:
        raise ValueError("The AI response did not contain a JSON array.")
    return json.loads(match.group(0))

def generate_quiz(text: str):
    prompt = f"""
Create exactly 3 multiple-choice questions from the educational content below.

Return ONLY valid JSON, with no markdown:
[
  {{
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "answer": "The exact correct option text",
    "explanation": "Brief explanation of why it is correct"
  }}
]

Rules:
- Exactly 3 questions.
- Exactly 4 options per question.
- One unambiguous correct answer.
- Questions must be answerable from the supplied content.
- Make distractors plausible.
- Do not include anything outside the JSON array.

Content:
{text}
"""
    data = _extract_json(generate(prompt))
    if len(data) != 3:
        raise ValueError("Quiz generation returned an unexpected number of questions.")
    for q in data:
        if not all(k in q for k in ("question", "options", "answer", "explanation")):
            raise ValueError("Quiz item is missing required fields.")
        if len(q["options"]) != 4:
            raise ValueError("Each quiz question must have four options.")
    return data
