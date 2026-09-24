export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({error:'Server chưa cấu hình GEMINI_API_KEY'});
  const {prompt, history=[]} = req.body || {};
  if (!prompt || typeof prompt !== 'string') return res.status(400).json({error:'Câu hỏi không hợp lệ'});
  const previous = Array.isArray(history) ? history.slice(-12).map(x => `${x.w==='user'?'Người dùng':'Trợ lý'}: ${String(x.t||'').slice(0,3000)}`).join('\n') : '';
  const input = `Bạn là trợ lý học tập Experience Lab. Trả lời bằng tiếng Việt, rõ ràng, an toàn, dễ hiểu. Với bài học, ưu tiên giải thích từng bước.\n${previous ? '\nNgữ cảnh gần đây:\n'+previous : ''}\n\nCâu hỏi hiện tại: ${prompt.slice(0,6000)}`;
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent', {
      method:'POST', headers:{'Content-Type':'application/json','x-goog-api-key':key},
      body:JSON.stringify({contents:[{parts:[{text:input}]}],generationConfig:{temperature:0.7,maxOutputTokens:1200}})
    });
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:data?.error?.message || 'Gemini API lỗi'});
    const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
    if(!text) return res.status(502).json({error:'AI không trả về nội dung'});
    res.setHeader('Cache-Control','no-store');
    return res.status(200).json({text});
  } catch(e) { return res.status(500).json({error:'Không thể kết nối Gemini API'}); }
}
