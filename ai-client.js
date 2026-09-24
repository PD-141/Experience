// Experience Lab AI client
// AI requests go through /api/ai so the Gemini key is never exposed in GitHub Pages.
async function experienceAI(prompt, history = []) {
  const response = await fetch('/api/ai', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({prompt, history})
  });
  const data = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(data.error || 'Không thể kết nối AI');
  return data.text;
}
