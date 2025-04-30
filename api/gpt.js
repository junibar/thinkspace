// api/gpt.js
export default async function handler(req, res) {
  // CORS 헤더 추가
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("서버에서 API 호출 시작");
    
    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      console.error("API 키가 설정되지 않았습니다");
      return res.status(500).json({ error: 'API key is not configured' });
    }
    
    const { model, messages, temperature, max_tokens } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens
      })
    });
    
    const data = await response.json();
    console.log("OpenAI API 응답:", data.choices ? "성공" : "실패");
    
    if (data.error) {
      console.error("OpenAI API 오류:", data.error);
      return res.status(500).json({ error: data.error.message || 'Unknown error' });
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to generate response: ' + error.message });
  }
}
