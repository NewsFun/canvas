const COLOR = '#ffffff';

export function render (ctx, spirit) {
  let type = spirit.type;
  switch (type) {
    case 'rect':
      renderRect(ctx, spirit);
      break;
    case 'arc':
      renderArc(ctx, spirit);
      break;
    case 'text':
      renderText(ctx, spirit);
      break;
    default:
      break;
  }
}

export function renderRect (ctx, spirit) {
  ctx.fillStyle = spirit.c || COLOR;
  ctx.beginPath();
  ctx.fillRect(spirit.x, spirit.y, spirit.w, spirit.l);
  ctx.closePath();
  ctx.fill();
}

export function renderArc (ctx, spirit) {
  ctx.fillStyle = spirit.c || COLOR;
  ctx.beginPath();
  ctx.arc(spirit.x, spirit.y, spirit.r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

export function renderText (ctx, spirit) {
  ctx.save();
  ctx.fillStyle = `rgba(0, 255, 0, ${spirit.opacity})`;
  ctx.fillText(spirit.text, spirit.x, spirit.y);
  ctx.restore();
}
