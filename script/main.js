
const BASE_API_URL = "/api/gpt";
const prompts = {
  q3: `당신은 미술관 상설 체험 프로그램에서 관람객의 감상과 생각을 자연스럽게 끌어내는 생성형 AI입니다. 변상환 작가의 작업 키워드를 바탕으로 매번 다양한 감상 질문을 생성하세요.

키워드: 신체, 무게, 시간, 운동성, 반복
주의사항:
- 질문은 1~2문장
- 부드럽고 서정적인 어조
- 마지막은 "어떤 느낌이었나요?", "어떤 감정이었나요?"등으로 끝냅니다.
- '형용사'라는 단어를 직접 사용하지 않습니다.`,

  q4: `당신은 미술관 상설 체험 프로그램에서 관람객의 감상과 기억을 환기시키는 질문을 만드는 생성형 AI입니다. 안상훈 작가의 작업 키워드를 바탕으로 잊혀진 이미지, 흐릿한 기억, 지워진 감정과 같은 감각을 떠올리게 할 질문을 생성하세요.

키워드: 흐려짐, 어긋남, 잔상, 지움, 그림
주의사항:
- 질문은 1~2문장
- 열린 서술과 부드러운 어조
- 마지막은 "어떤 감정이었나요?", "무엇이 스쳐갔나요?"등으로 끝냅니다.
- '형용사'라는 단어를 사용하지 않습니다.`,

  q5: `당신은 미술관 상설 체험 프로그램에서 관람객의 신체 기억과 감정 변화를 떠올리게 하는 질문을 만드는 AI입니다. 이병호 작가의 작업을 참고하여, 변화, 유동성, 분리, 재구성의 경험을 불러오는 질문을 생성하세요.

키워드: 유동성, 왜곡, 분리, 재구성, 순환
주의사항:
- 질문은 1~2문장
- 감각적 언어와 은유적인 표현
- 마지막은 "어떤 느낌이었나요?" 또는 "어떤 감정이 들었나요?"등으로 마무리
- '형용사'라는 단어는 제외합니다.`,

  q6: `당신은 관람객이 말로 표현되지 않는 감상, 기억, 상상을 떠올릴 수 있도록 유도하는 질문을 만드는 AI입니다. 지희킴 작가의 작업처럼 언어를 이미지로 전환하고, 단절된 기억을 상기시키는 질문을 생성하세요.

키워드: 언어 해체, 감성, 기억, 이미지, 재조합
주의사항:
- 질문은 1~2문장
- 정서적인 흐름과 비유적 표현 활용
- 마지막은 "그 감정은 어떤 결을 지녔나요?", "무엇이 마음에 남았나요?" 등으로 마무리
- '형용사' 단어는 직접 쓰지 않습니다.`,

  q7: `당신은 반복, 규칙, 리듬, 직조의 감각을 관람객이 일상과 연결해 떠올릴 수 있도록 돕는 질문을 만드는 AI입니다. 차승언 작가의 작업처럼 반복되는 패턴 속 어긋남과 감각의 틈을 상기시킬 질문을 생성하세요.

키워드: 반복, 규칙, 리듬, 직조, 변주
주의사항:
- 질문은 1~2문장
- 시적인 문장 구조와 리듬감 있는 어휘 선택
- 마지막은 "무엇이 달라졌다고 느꼈나요?", "그 순간은 어떤 감각이었나요?" 등으로 마무리
- '형용사'라는 단어는 쓰지 않습니다.`
};

async function generateQuestion(id, prompt) {
  const response = await fetch(BASE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.0",
      messages: [
        { role: "system", content: "너는 미술관 관객에게 감정과 생각을 이끌어내는 질문을 만드는 역할이야." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    })
  });

  const data = await response.json();
  console.log("응답 결과:", data);
  
  const text = data.choices?.[0]?.message?.content || "(질문을 생성할 수 없습니다)";
  document.getElementById(id).innerText = text;
}

function loadAllQuestions() {
  generateQuestion("q3-text", prompts.q3);
  generateQuestion("q4-text", prompts.q4);
  generateQuestion("q5-text", prompts.q5);
  generateQuestion("q6-text", prompts.q6);
  generateQuestion("q7-text", prompts.q7);
}

function nextScreen(nextId) {
  document.querySelectorAll('.screen').forEach(div => div.classList.remove('active'));
  document.getElementById(nextId).classList.add('active');
  
  if (nextId === 'end') {
    setupAutoRestart();
  }
}

function selectColor(colorName, colorHex) {
  document.getElementById('selectedColorText').innerText = `「${colorName}」입니다!`;
  document.getElementById('colorBlock').style.backgroundColor = colorHex;
  nextScreen('colorMatch');
}

function setupAutoRestart() {
  setTimeout(() => {
    restart();
  }, 5000); // 60000ms = 1분
}

function restart() {
  nextScreen('intro');
}
