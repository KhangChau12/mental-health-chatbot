// lib/scoring.js
// Logic tính điểm và xác định mức độ nghiêm trọng

// Tính tổng điểm cho một bộ câu hỏi
export function calculateScores(responses, assessment) {
  if (!responses || !assessment || !assessment.scoring) {
    return null;
  }
  
  // Nếu đánh giá ban đầu, tính điểm cho từng danh mục
  if (assessment.id === 'initialScreening') {
    let categoryScores = {};
    
    // Duyệt qua từng danh mục
    Object.keys(assessment.scoring).forEach(category => {
      if (category === 'nextAssessment') return; // Bỏ qua nếu không phải danh mục
      
      // Lấy IDs câu hỏi cho danh mục này
      const questionIds = assessment.scoring[category].questions;
      
      // Tính tổng điểm
      let total = 0;
      let validResponses = 0;
      
      questionIds.forEach(qId => {
        if (responses[qId] !== undefined) {
          total += responses[qId];
          validResponses++;
        }
      });
      
      // Nếu có phản hồi hợp lệ, lưu điểm
      if (validResponses > 0) {
        categoryScores[category] = total;
      }
    });
    
    return categoryScores;
  }
  
  // Cho các bộ câu hỏi khác, tính tổng điểm
  let total = 0;
  let validResponses = 0;
  
  // Lấy danh sách ID câu hỏi từ scoring
  const questionIds = assessment.scoring.questions;
  
  questionIds.forEach(qId => {
    if (responses[qId] !== undefined) {
      total += responses[qId];
      validResponses++;
    }
  });
  
  // Nếu không có phản hồi hợp lệ, trả về null
  if (validResponses === 0) {
    return null;
  }
  
  return total;
}

// Xác định mức độ nghiêm trọng dựa trên điểm số
export function getSeverityLevel(scores, assessment) {
  if (!scores || !assessment || !assessment.scoring) {
    return null;
  }
  
  // Nếu đánh giá ban đầu, xác định mức độ nghiêm trọng cho từng danh mục
  if (assessment.id === 'initialScreening') {
    let severityLevels = {};
    
    // Duyệt qua từng danh mục
    Object.keys(assessment.scoring).forEach(category => {
      if (category === 'nextAssessment') return; // Bỏ qua nếu không phải danh mục
      
      // Lấy điểm số cho danh mục này
      const score = scores[category];
      if (score === undefined) return;
      
      // Lấy ngưỡng điểm
      const thresholds = assessment.scoring[category].thresholds;
      
      // Xác định mức độ nghiêm trọng
      severityLevels[category] = determineLevel(score, thresholds);
    });
    
    return severityLevels;
  }
  
  // Cho các bộ câu hỏi khác, xác định mức độ nghiêm trọng dựa trên tổng điểm
  const thresholds = assessment.scoring.thresholds;
  return determineLevel(scores, thresholds);
}

// Hàm trợ giúp xác định mức độ dựa trên ngưỡng
function determineLevel(score, thresholds) {
  // Sắp xếp các ngưỡng theo thứ tự giảm dần
  const levels = Object.keys(thresholds).sort((a, b) => {
    return thresholds[b] - thresholds[a];
  });
  
  // Tìm mức độ đầu tiên mà điểm số vượt qua ngưỡng
  for (const level of levels) {
    if (score >= thresholds[level]) {
      return level;
    }
  }
  
  // Mặc định trả về mức độ thấp nhất
  return levels[levels.length - 1];
}

// Kiểm tra cờ rủi ro từ phản hồi
export function checkRiskFlags(responses, assessment) {
  const flags = {
    suicideRisk: false,
    // Thêm các cờ rủi ro khác khi cần
  };
  
  // Duyệt qua tất cả câu hỏi để tìm cờ
  assessment.questions.forEach(question => {
    if (question.flag === 'suicide_risk') {
      if (responses[question.id] >= 3) { // Giá trị cao cho câu hỏi rủi ro tự tử
        flags.suicideRisk = true;
      }
    }
  });
  
  return flags;
}