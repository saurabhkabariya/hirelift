// Simple captcha generator for client-side use
export const generateCaptcha = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let captcha = '';
  
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return captcha;
};

export const generateCaptchaImage = (text) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  canvas.width = 200;
  canvas.height = 80;
  
  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#f8fafc');
  gradient.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add noise lines
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }
  
  // Add noise dots
  ctx.fillStyle = '#94a3b8';
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
  
  // Draw text
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  
  for (let i = 0; i < text.length; i++) {
    ctx.fillStyle = colors[i % colors.length];
    const x = 35 + i * 25 + (Math.random() - 0.5) * 10;
    const y = 40 + (Math.random() - 0.5) * 8;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }
  
  return canvas.toDataURL();
};

export const validateCaptcha = (userInput, actualCaptcha) => {
  return userInput.toLowerCase() === actualCaptcha.toLowerCase();
};
