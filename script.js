// Calculator JavaScript - เครื่องคิดเลข
const display = document.getElementById("display");
let currentInput = "";
let operator = "";
let previousInput = "";
let shouldResetDisplay = false;
let justCalculated = false;

// ฟังก์ชันเพิ่มตัวเลขหรือเครื่องหมาย
function append(char) {
  // ลบคลาส error ถ้ามี
  display.classList.remove('error');
  
  // ถ้าหน้าจอแสดง Error
  if (display.value === "Error") {
    display.value = "";
    shouldResetDisplay = false;
    justCalculated = false;
  }
  
  const operators = ['+', '-', '*', '/'];
  const isOperator = operators.includes(char);
  const lastChar = display.value.slice(-1);
  
  // ถ้าเพิ่งคำนวณเสร็จและกดตัวเลข ให้เริ่มใหม่
  if (justCalculated && !isOperator) {
    display.value = "";
    justCalculated = false;
  }
  
  // ถ้าเพิ่งคำนวณเสร็จและกดเครื่องหมาย ให้ใช้ผลลัพธ์ต่อ
  if (justCalculated && isOperator) {
    justCalculated = false;
  }
  
  // ถ้าควรรีเซ็ตหน้าจอ
  if (shouldResetDisplay && !isOperator) {
    display.value = "";
    shouldResetDisplay = false;
  }
  
  // ป้องกันการใส่เครื่องหมายซ้ำ
  if (isOperator && operators.includes(lastChar)) {
    // แทนที่เครื่องหมายเดิม
    display.value = display.value.slice(0, -1) + char;
    return;
  }
  
  // ป้องกันการเริ่มต้นด้วยเครื่องหมาย (ยกเว้น -)
  if (display.value === "" && isOperator && char !== '-') {
    return;
  }
  
  // ป้องกันจุดทศนิยมซ้ำ
  if (char === '.') {
    const parts = display.value.split(/[\+\-\*\/]/);
    const currentNumber = parts[parts.length - 1];
    if (currentNumber.includes('.')) {
      return;
    }
  }
  
  display.value += char;
}

// ฟังก์ชันล้างหน้าจอทั้งหมด
function clearDisplay() {
  display.value = "";
  display.classList.remove('error');
  currentInput = "";
  operator = "";
  previousInput = "";
  shouldResetDisplay = false;
  justCalculated = false;
}

// ฟังก์ชันล้างรายการปัจจุบัน
function clearEntry() {
  display.value = "";
  display.classList.remove('error');
  justCalculated = false;
}

// ฟังก์ชันลบตัวอักษรสุดท้าย
function backspace() {
  display.classList.remove('error');
  justCalculated = false;
  
  if (display.value === "Error") {
    display.value = "";
  } else {
    display.value = display.value.slice(0, -1);
  }
}

// ฟังก์ชันคำนวณ
function calculate() {
  try {
    let expression = display.value;
    
    // ตรวจสอบว่ามีข้อมูลให้คำนวณหรือไม่
    if (!expression || expression === "") {
      return;
    }
    
    // แทนที่สัญลักษณ์แสดงผลด้วยเครื่องหมายจริง
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    
    // ตรวจสอบว่าไม่ลงท้ายด้วยเครื่องหมาย
    if (/[\+\-\*\/]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
    
    // คำนวณผลลัพธ์
    let result = eval(expression);
    
    // ตรวจสอบผลลัพธ์
    if (!isFinite(result)) {
      throw new Error("Invalid calculation");
    }
    
    // แสดงผลลัพธ์ (ปัดเศษถ้าจำเป็น)
    display.value = Number(result.toFixed(10)).toString();
    justCalculated = true;
    shouldResetDisplay = false;
    
  } catch (error) {
    display.value = "Error";
    display.classList.add('error');
    shouldResetDisplay = true;
    justCalculated = false;
  }
}

// ฟังก์ชันจัดการการกดแป้นพิมพ์
document.addEventListener("keydown", function (e) {
  const key = e.key;
  
  // ตัวเลขและเครื่องหมาย
  if ("0123456789".includes(key)) {
    append(key);
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    append(key);
  } else if (key === ".") {
    append(key);
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    e.preventDefault();
    backspace();
  } else if (key === "Escape") {
    clearDisplay();
  } else if (key === "Delete") {
    clearEntry();
  }
});

// ป้องกันการพิมพ์ในช่อง input
display.addEventListener('input', function(e) {
  e.preventDefault();
  return false;
});

// เพิ่ม event listener สำหรับการคลิกที่หน้าจอ
display.addEventListener('click', function() {
  display.blur(); // ป้องกันการแสดง cursor
});