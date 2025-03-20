// lib/chat-logic.js
// Logic điều khiển luồng chat

import { questionnaires, emergencyMessage } from '../data/questionnaires';
import { calculateScores, getSeverityLevel } from './scoring';
import { getResourcesForSeverity, formatResourcesMessage } from '../data/resources';
import { formatDisorderInfo } from '../data/diagnostic';

// Trạng thái chat
export const CHAT_STATES = {
  GREETING: 'greeting',
  COLLECTING_ISSUE: 'collecting_issue',
  INITIAL_SCREENING: 'initial_screening',
  DETAILED_ASSESSMENT: 'detailed_assessment',
  ADDITIONAL_ASSESSMENT: 'additional_assessment',
  SUICIDE_ASSESSMENT: 'suicide_assessment',
  SUMMARY: 'summary',
  RESOURCES: 'resources',
  DISORDER_INFO: 'disorder_info',
  CLOSING: 'closing'
};

// Khởi tạo trạng thái chat
export function initializeChat() {
  return {
    state: CHAT_STATES.GREETING,
    currentAssessment: null,
    currentQuestionIndex: 0,
    assessments: {},
    userResponses: {},
    scores: {},
    severityLevels: {},
    flags: {
      suicideRisk: false
    },
    botMessage: "Xin chào! Tôi là một trợ lý AI được thiết kế để hỗ trợ sàng lọc sức khỏe tâm thần. Tôi sẽ hỏi bạn một số câu hỏi để hiểu hơn về cảm xúc và trải nghiệm của bạn. Cuộc trò chuyện này hoàn toàn riêng tư và chỉ nhằm mục đích cung cấp thông tin tham khảo. Tôi không phải là chuyên gia y tế và không thay thế cho tư vấn chuyên nghiệp.\n\nTrước khi bắt đầu, bạn có thể cho tôi biết lý do bạn tìm đến dịch vụ này hôm nay không?"
  };
}

// Xử lý tin nhắn người dùng và xác định tin nhắn bot tiếp theo
export function processMessage(chatState, userMessage) {
  switch (chatState.state) {
    case CHAT_STATES.GREETING:
      return handleGreeting(chatState, userMessage);
    
    case CHAT_STATES.COLLECTING_ISSUE:
      return handleCollectingIssue(chatState, userMessage);
    
    case CHAT_STATES.INITIAL_SCREENING:
      return handleAssessment(chatState, userMessage, 'initialScreening');
    
    case CHAT_STATES.DETAILED_ASSESSMENT:
      return handleAssessment(chatState, userMessage, chatState.currentAssessment);
    
    case CHAT_STATES.ADDITIONAL_ASSESSMENT:
      return handleAssessment(chatState, userMessage, chatState.currentAssessment);
    
    case CHAT_STATES.SUICIDE_ASSESSMENT:
      return handleAssessment(chatState, userMessage, 'suicideRiskAssessment');
    
    case CHAT_STATES.SUMMARY:
      return handleSummary(chatState, userMessage);
    
    case CHAT_STATES.RESOURCES:
      return handleResources(chatState, userMessage);
    
    case CHAT_STATES.DISORDER_INFO:
      return handleDisorderInfo(chatState, userMessage);
    
    case CHAT_STATES.CLOSING:
      return handleClosing(chatState, userMessage);
    
    default:
      return {
        ...chatState,
        botMessage: "Xin lỗi, tôi không hiểu. Hãy thử lại."
      };
  }
}

// Xử lý trạng thái chào hỏi
function handleGreeting(chatState, userMessage) {
  return {
    ...chatState,
    state: CHAT_STATES.COLLECTING_ISSUE,
    botMessage: "Cảm ơn bạn đã liên hệ. Tôi hiểu rằng việc chia sẻ có thể khó khăn, và tôi đánh giá cao sự cởi mở của bạn. Bạn có thể cho tôi biết thêm về những gì bạn đang trải qua không? Điều gì khiến bạn tìm kiếm hỗ trợ vào lúc này?"
  };
}

// Xử lý trạng thái thu thập vấn đề
function handleCollectingIssue(chatState, userMessage) {
  return {
    ...chatState,
    state: CHAT_STATES.INITIAL_SCREENING,
    currentAssessment: 'initialScreening',
    currentQuestionIndex: 0,
    userIssue: userMessage,
    botMessage: "Cảm ơn bạn đã chia sẻ. Bây giờ, tôi sẽ hỏi bạn một số câu hỏi về cảm xúc và trải nghiệm của bạn trong 2 tuần qua để hiểu rõ hơn về tình hình. Vui lòng trả lời từ 0-4 tương ứng với mức độ:\n\n0: Không bao giờ\n1: Hiếm khi\n2: Thỉnh thoảng\n3: Thường xuyên\n4: Luôn luôn\n\nCâu hỏi đầu tiên: " + questionnaires.initialScreening.questions[0].text
  };
}

// Xử lý các trạng thái đánh giá
function handleAssessment(chatState, userMessage, assessmentId) {
  const assessment = questionnaires[assessmentId];
  const currentQuestion = assessment.questions[chatState.currentQuestionIndex];
  
  // Ghi lại phản hồi của người dùng
  const updatedResponses = {
    ...chatState.userResponses,
    [assessmentId]: {
      ...(chatState.userResponses[assessmentId] || {}),
      [currentQuestion.id]: parseResponse(userMessage, currentQuestion)
    }
  };
  
  // Kiểm tra cờ nguy cơ tự tử
  let updatedFlags = { ...chatState.flags };
  if (currentQuestion.flag === 'suicide_risk' && parseResponse(userMessage, currentQuestion) >= 3) {
    updatedFlags.suicideRisk = true;
  }
  
  // Kiểm tra xem đã hoàn thành đánh giá hiện tại chưa
  if (chatState.currentQuestionIndex >= assessment.questions.length - 1) {
    // Tính điểm cho đánh giá này
    const scores = calculateScores(updatedResponses[assessmentId], assessment);
    const severity = getSeverityLevel(scores, assessment);
    
    // Xác định trạng thái tiếp theo
    const nextState = determineNextState(chatState, assessment, severity, updatedFlags);
    
    return {
      ...chatState,
      ...nextState,
      userResponses: updatedResponses,
      scores: {
        ...chatState.scores,
        [assessmentId]: scores
      },
      severityLevels: {
        ...chatState.severityLevels,
        [assessmentId]: severity
      },
      flags: updatedFlags
    };
  }
  
  // Chuyển sang câu hỏi tiếp theo
  const nextQuestionIndex = chatState.currentQuestionIndex + 1;
  const nextQuestion = assessment.questions[nextQuestionIndex];
  
  return {
    ...chatState,
    currentQuestionIndex: nextQuestionIndex,
    userResponses: updatedResponses,
    flags: updatedFlags,
    botMessage: nextQuestion.text + "\n\n" + formatOptions(nextQuestion.options)
  };
}

// Định dạng hiển thị các lựa chọn
function formatOptions(options) {
  return options.map((option, index) => `${option.value}: ${option.text}`).join("\n");
}

// Hàm trợ giúp phân tích phản hồi người dùng dựa trên loại câu hỏi
function parseResponse(userMessage, question) {
  // Đối với tin nhắn dạng số
  const numValue = parseInt(userMessage);
  if (!isNaN(numValue)) {
    // Kiểm tra xem giá trị có trong phạm vi tùy chọn không
    const optionValues = question.options.map(opt => opt.value);
    if (optionValues.includes(numValue)) {
      return numValue;
    }
  }
  
  // Cố gắng khớp với văn bản tùy chọn
  const lowercaseMessage = userMessage.toLowerCase();
  for (let i = 0; i < question.options.length; i++) {
    if (lowercaseMessage.includes(question.options[i].text.toLowerCase())) {
      return question.options[i].value;
    }
  }
  
  // Hỗ trợ phản hồi đơn giản như "có/không"
  if (question.options.length === 2) {
    if (lowercaseMessage.includes('có') || 
        lowercaseMessage.includes('đúng') || 
        lowercaseMessage.includes('phải')) {
      return question.options[1].value; // Thường là "Có"
    }
    if (lowercaseMessage.includes('không') || 
        lowercaseMessage.includes('sai')) {
      return question.options[0].value; // Thường là "Không"
    }
  }
  
  // Mặc định giá trị nếu không thể phân tích
  return question.options[0].value;
}

// Xác định trạng thái tiếp theo dựa trên kết quả đánh giá
function determineNextState(chatState, assessment, severity, flags) {
  // Nếu phát hiện nguy cơ tự tử, chuyển sang đánh giá tự tử
  if (flags.suicideRisk && assessment.id !== 'suicideRiskAssessment') {
    return {
      state: CHAT_STATES.SUICIDE_ASSESSMENT,
      currentAssessment: 'suicideRiskAssessment',
      currentQuestionIndex: 0,
      botMessage: `Tôi nhận thấy bạn đã đề cập đến suy nghĩ về cái chết hoặc tự làm hại bản thân. Tôi muốn hỏi thêm một vài câu hỏi để hiểu rõ hơn tình hình.\n\n${questionnaires.suicideRiskAssessment.questions[0].text}\n\n${formatOptions(questionnaires.suicideRiskAssessment.questions[0].options)}`
    };
  }
  
  if (assessment.id === 'suicideRiskAssessment') {
    const riskLevel = severity;
    
    if (riskLevel === 'severe' || riskLevel === 'high') {
      return {
        state: CHAT_STATES.SUMMARY,
        botMessage: emergencyMessage + "\n\nTôi thực sự lo lắng về sự an toàn của bạn dựa trên thông tin bạn đã chia sẻ. Việc tìm kiếm hỗ trợ ngay là rất quan trọng. Bạn không đơn độc, và có những người sẵn sàng giúp đỡ bạn vượt qua giai đoạn khó khăn này."
      };
    }
    
    // Chuyển sang tóm tắt nếu nguy cơ thấp hơn
    return {
      state: CHAT_STATES.SUMMARY,
      botMessage: "Cảm ơn bạn đã trả lời thêm những câu hỏi này. Dựa trên câu trả lời của bạn, tôi có thể cung cấp một số thông tin sơ bộ."
    };
  }
  
  if (assessment.id === 'initialScreening') {
    // Kiểm tra các danh mục trung bình hoặc nặng
    const categories = Object.keys(severity);
    for (const category of categories) {
      if (severity[category] === 'moderate' || severity[category] === 'severe') {
        // Chuyển sang đánh giá chi tiết cho danh mục này
        const nextAssessment = assessment.nextAssessment[category];
        if (nextAssessment && questionnaires[nextAssessment]) {
          return {
            state: CHAT_STATES.DETAILED_ASSESSMENT,
            currentAssessment: nextAssessment,
            currentQuestionIndex: 0,
            botMessage: `Dựa trên câu trả lời của bạn, tôi muốn hỏi thêm một số câu hỏi cụ thể về ${category === 'depression' ? 'tâm trạng' : category === 'anxiety' ? 'lo âu' : 'căng thẳng'} của bạn.\n\n${questionnaires[nextAssessment].questions[0].text}\n\n${formatOptions(questionnaires[nextAssessment].questions[0].options)}`
          };
        }
      }
    }
    
    // Nếu không có vấn đề nghiêm trọng, chuyển sang tóm tắt
    return {
      state: CHAT_STATES.SUMMARY,
      botMessage: "Cảm ơn bạn đã trả lời các câu hỏi. Dựa trên câu trả lời của bạn, tôi có thể cung cấp một số thông tin sơ bộ."
    };
  }
  
  // Cho các đánh giá chi tiết, chuyển sang tóm tắt
  return {
    state: CHAT_STATES.SUMMARY,
    botMessage: "Cảm ơn bạn đã trả lời các câu hỏi này. Bây giờ tôi sẽ cung cấp một bản tóm tắt dựa trên thông tin bạn đã chia sẻ."
  };
}

// Xử lý trạng thái tóm tắt
function handleSummary(chatState, userMessage) {
  // Tạo tóm tắt dựa trên điểm số và mức độ nghiêm trọng
  const summary = generateSummary(chatState.scores, chatState.severityLevels);
  
  return {
    ...chatState,
    state: CHAT_STATES.RESOURCES,
    summary,
    botMessage: summary + "\n\nBạn có muốn tôi cung cấp thêm thông tin hoặc tài nguyên hỗ trợ không?"
  };
}

// Tạo tóm tắt từ điểm số
function generateSummary(scores, severityLevels) {
  let summary = "## Kết quả đánh giá sơ bộ\n\n";
  let foundAnyIssue = false;
  
  // Xử lý sàng lọc ban đầu
  if (severityLevels.initialScreening) {
    summary += "Dựa trên sàng lọc ban đầu:\n\n";
    
    Object.keys(severityLevels.initialScreening).forEach(category => {
      const level = severityLevels.initialScreening[category];
      const categoryName = category === 'depression' ? 'Trầm cảm' : 
                          category === 'anxiety' ? 'Lo âu' : 'Căng thẳng';
      
      summary += `- **${categoryName}**: ${formatSeverity(level)}\n`;
      
      if (level !== 'minimal') {
        foundAnyIssue = true;
      }
    });
    
    summary += "\n";
  }
  
  // Xử lý đánh giá chi tiết
  const detailedAssessments = Object.keys(severityLevels).filter(id => id !== 'initialScreening' && id !== 'suicideRiskAssessment');
  
  if (detailedAssessments.length > 0) {
    summary += "Kết quả đánh giá chi tiết:\n\n";
    
    detailedAssessments.forEach(assessmentId => {
      const level = severityLevels[assessmentId];
      const assessmentName = questionnaires[assessmentId].name;
      
      summary += `- **${assessmentName}**: ${formatSeverity(level)}\n`;
    });
    
    summary += "\n";
  }
  
  // Xử lý đánh giá nguy cơ tự tử
  if (severityLevels.suicideRiskAssessment) {
    const level = severityLevels.suicideRiskAssessment;
    
    if (level === 'high' || level === 'severe') {
      summary += "⚠️ **CẢNH BÁO: Phát hiện nguy cơ tự tử đáng kể** ⚠️\n\n";
      summary += "Vui lòng liên hệ ngay với các dịch vụ hỗ trợ khẩn cấp được liệt kê ở phần cuối.\n\n";
    } else if (level === 'moderate') {
      summary += "⚠️ **Lưu ý: Phát hiện một số dấu hiệu nguy cơ tự tử** ⚠️\n\n";
      summary += "Khuyến nghị tham khảo ý kiến chuyên gia sức khỏe tâm thần.\n\n";
    }
  }
  
  // Thêm lời khuyên chung
  if (foundAnyIssue) {
    summary += "### Đề xuất tiếp theo\n\n";
    summary += "Dựa trên đánh giá sơ bộ này, việc tham khảo ý kiến của chuyên gia sức khỏe tâm thần có thể mang lại lợi ích. Họ có thể cung cấp đánh giá toàn diện hơn và thảo luận về các phương án hỗ trợ phù hợp với nhu cầu cụ thể của bạn.\n\n";
  } else {
    summary += "### Đề xuất tiếp theo\n\n";
    summary += "Mặc dù bạn không có dấu hiệu đáng kể của các vấn đề sức khỏe tâm thần dựa trên đánh giá sơ bộ này, việc duy trì thói quen chăm sóc bản thân vẫn rất quan trọng. Nếu bạn tiếp tục cảm thấy lo lắng về sức khỏe tâm thần của mình, hãy cân nhắc nói chuyện với chuyên gia chăm sóc sức khỏe.\n\n";
  }
  
  summary += "### Lưu ý quan trọng\n\n";
  summary += "Thông tin này chỉ mang tính chất tham khảo và không phải là chẩn đoán chính thức. Chỉ chuyên gia sức khỏe tâm thần mới có thể đưa ra chẩn đoán chính xác.";
  
  return summary;
}

// Định dạng mức độ nghiêm trọng
function formatSeverity(level) {
  switch (level) {
    case 'minimal':
      return 'Tối thiểu';
    case 'mild':
      return 'Nhẹ';
    case 'moderate':
      return 'Trung bình';
    case 'moderatelySevere':
      return 'Trung bình đến nặng';
    case 'severe':
      return 'Nặng';
    case 'extremelySevere':
      return 'Cực kỳ nặng';
    case 'low':
      return 'Thấp';
    case 'high':
      return 'Cao';
    default:
      return level;
  }
}

// Xử lý trạng thái tài nguyên
function handleResources(chatState, userMessage) {
  // Nếu người dùng muốn tài nguyên
  if (userMessage.toLowerCase().includes('có') || 
      userMessage.toLowerCase().includes('vâng') ||
      userMessage.toLowerCase().includes('đồng ý') ||
      userMessage.toLowerCase().includes('muốn')) {
    
    // Xác định tài nguyên phù hợp
    const resourceList = [];
    let primaryDisorder = 'depression'; // Mặc định
    let primarySeverity = 'mild'; // Mặc định
    
    // Xác định rối loạn chính và mức độ nghiêm trọng
    if (chatState.severityLevels.initialScreening) {
      const initialScreening = chatState.severityLevels.initialScreening;
      
      // Tìm danh mục nghiêm trọng nhất
      const categories = Object.keys(initialScreening);
      let maxSeverity = 'minimal';
      
      for (const category of categories) {
        const severity = initialScreening[category];
        if (severityWeight(severity) > severityWeight(maxSeverity)) {
          maxSeverity = severity;
          primaryDisorder = category;
        }
      }
      
      primarySeverity = maxSeverity;
    }
    
    // Sử dụng đánh giá chi tiết nếu có
    const detailedAssessments = Object.keys(chatState.severityLevels)
      .filter(id => id !== 'initialScreening' && id !== 'suicideRiskAssessment');
    
    if (detailedAssessments.length > 0) {
      // Lấy đánh giá chi tiết đầu tiên
      const assessmentId = detailedAssessments[0];
      
      if (assessmentId === 'phq9') {
        primaryDisorder = 'depression';
      } else if (assessmentId === 'gad7') {
        primaryDisorder = 'anxiety';
      } else if (assessmentId === 'dass21_stress') {
        primaryDisorder = 'stress';
      }
      
      primarySeverity = chatState.severityLevels[assessmentId];
    }
    
    // Lấy tài nguyên phù hợp
    const resources = getResourcesForSeverity(primaryDisorder, primarySeverity);
    const resourcesMessage = formatResourcesMessage(resources);
    
    return {
      ...chatState,
      state: CHAT_STATES.DISORDER_INFO,
      resources,
      primaryDisorder,
      botMessage: resourcesMessage + "\n\nBạn có muốn biết thêm thông tin về " + 
        (primaryDisorder === 'depression' ? 'trầm cảm' : 
         primaryDisorder === 'anxiety' ? 'lo âu' : 'căng thẳng') + " không?"
    };
  }
  
  // Nếu người dùng không muốn tài nguyên
  return {
    ...chatState,
    state: CHAT_STATES.CLOSING,
    botMessage: "Tôi hiểu. Bạn có câu hỏi nào khác không?"
  };
}

// Hàm trợ giúp đánh giá mức độ nghiêm trọng
function severityWeight(severity) {
  const weights = {
    'minimal': 0,
    'low': 1,
    'mild': 2,
    'moderate': 3,
    'moderatelySevere': 4,
    'severe': 5,
    'high': 5,
    'extremelySevere': 6
  };
  
  return weights[severity] || 0;
}

// Xử lý trạng thái thông tin rối loạn
function handleDisorderInfo(chatState, userMessage) {
  // Nếu người dùng muốn thông tin thêm
  if (userMessage.toLowerCase().includes('có') || 
      userMessage.toLowerCase().includes('vâng') ||
      userMessage.toLowerCase().includes('đồng ý') ||
      userMessage.toLowerCase().includes('muốn')) {
    
    const disorderInfo = formatDisorderInfo(chatState.primaryDisorder);
    
    return {
      ...chatState,
      state: CHAT_STATES.CLOSING,
      botMessage: disorderInfo + "\n\nBạn có câu hỏi nào khác không?"
    };
  }
  
  // Nếu người dùng không muốn thông tin thêm
  return {
    ...chatState,
    state: CHAT_STATES.CLOSING,
    botMessage: "Tôi hiểu. Bạn có câu hỏi nào khác không?"
  };
}

// Xử lý trạng thái kết thúc
function handleClosing(chatState, userMessage) {
  // Nếu người dùng có thêm câu hỏi, khởi động lại cuộc trò chuyện
  if (userMessage.toLowerCase().includes('có') || 
      userMessage.toLowerCase().includes('vâng') ||
      userMessage.toLowerCase().includes('câu hỏi')) {
    
    return {
      ...initializeChat(),
      botMessage: "Bạn có câu hỏi gì? Tôi sẵn sàng trợ giúp."
    };
  }
  
  // Nếu không, kết thúc cuộc trò chuyện
  return {
    ...chatState,
    botMessage: "Cảm ơn bạn đã chia sẻ với tôi hôm nay. Hãy nhớ rằng chăm sóc sức khỏe tâm thần cũng quan trọng như chăm sóc sức khỏe thể chất. Nếu bạn cảm thấy không khỏe, việc tìm kiếm sự hỗ trợ là một bước tích cực.\n\nTôi hy vọng cuộc trò chuyện này đã cung cấp cho bạn một số hiểu biết và tài nguyên hữu ích. Bạn có thể quay lại bất cứ lúc nào nếu bạn muốn nói chuyện thêm.\n\nChúc bạn một ngày tốt lành và hãy nhớ chăm sóc bản thân!"
  };
}