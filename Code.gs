function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
    const data = sheet.getDataRange().getValues();
    
    // Header: 題號, 題目, A, B, C, D, 解答
    const headers = data[0];
    const questions = [];
    
    for (let i = 1; i < data.length; i++) {
      let row = data[i];
      if (row[0] !== "") { // 確保有題號
        questions.push({
          id: row[0],
          question: row[1],
          options: {
            A: row[2],
            B: row[3],
            C: row[4],
            D: row[5]
          }
          // 不回傳解答
        });
      }
    }
    
    // 隨機打亂並取 N 題
    const count = parseInt(e.parameter.count) || 5;
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);
    
    return ContentService.createTextOutput(JSON.stringify(selected))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const userId = payload.id;
    const userAnswers = payload.answers; // [{ id: "1", answer: "A" }, ...]
    const passThreshold = parseInt(payload.passThreshold) || 3;
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const qSheet = spreadsheet.getSheetByName("題目");
    const aSheet = spreadsheet.getSheetByName("回答");
    
    // 計算成績
    const qData = qSheet.getDataRange().getValues();
    const answerMap = {};
    for (let i = 1; i < qData.length; i++) {
      if (qData[i][0] !== "") {
        answerMap[qData[i][0].toString()] = qData[i][6].toString(); // 題號對應解答
      }
    }
    
    let score = 0;
    userAnswers.forEach(ans => {
      if (answerMap[ans.id.toString()] === ans.answer.toString()) {
        score++;
      }
    });
    
    // 處理成績紀錄
    const aData = aSheet.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < aData.length; i++) {
      if (aData[i][0].toString() === userId.toString()) {
        rowIndex = i + 1; // 1-based index
        break;
      }
    }
    
    const now = new Date();
    const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    
    let resultData = { score: score, passed: score >= passThreshold };
    
    if (rowIndex === -1) {
      // 新增使用者
      // 欄位: ID, 闖關次數, 總分, 最高分, 第一次通關分數, 花了幾次通關, 最近施測時間
      const tryCount = 1;
      const firstClearScore = score >= passThreshold ? score : "";
      const triesToClear = score >= passThreshold ? 1 : "";
      
      aSheet.appendRow([
        userId,
        tryCount,
        score,
        score, // highest
        firstClearScore,
        triesToClear,
        formattedDate
      ]);
    } else {
      // 更新使用者
      const rowData = aData[rowIndex - 1]; // 0-based index
      const currentTryCount = parseInt(rowData[1]) || 0;
      const currentHighest = parseInt(rowData[3]) || 0;
      const currentFirstClear = rowData[4];
      
      const newTryCount = currentTryCount + 1;
      const newHighest = Math.max(currentHighest, score);
      
      let newFirstClear = currentFirstClear;
      let newTriesToClear = rowData[5];
      
      if ((newFirstClear === "" || newFirstClear === undefined) && score >= passThreshold) {
        newFirstClear = score;
        newTriesToClear = newTryCount;
      }
      
      // 更新列資料 (ID, 闖關次數, 總分, 最高分, 第一次通關分數, 花了幾次通關, 最近施測時間)
      aSheet.getRange(rowIndex, 2).setValue(newTryCount);
      aSheet.getRange(rowIndex, 3).setValue(score);
      aSheet.getRange(rowIndex, 4).setValue(newHighest);
      aSheet.getRange(rowIndex, 5).setValue(newFirstClear);
      aSheet.getRange(rowIndex, 6).setValue(newTriesToClear);
      aSheet.getRange(rowIndex, 7).setValue(formattedDate);
    }
    
    return ContentService.createTextOutput(JSON.stringify(resultData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 處理 CORS 預檢請求
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}
