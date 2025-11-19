import { CartItem } from '../types';

export const generateWhatsAppMessage = (items: CartItem[], total: number): string => {
  let message = 'Hello, I would like to place an order:\n\n';
  
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   - Quantity: ${item.quantity}\n`;
    if (item.customText) {
      message += `   - Custom Text: "${item.customText}"\n`;
    }
    message += `   - Price: ${item.price.toLocaleString()} UGX each\n`;
    message += `   - Subtotal: ${(item.price * item.quantity).toLocaleString()} UGX\n\n`;
  });
  
  message += `Total: ${total.toLocaleString()} UGX\n\n`;
  message += 'Please confirm availability. Thank you!';
  
  return message;
};

export const sendToWhatsApp = (items: CartItem[], total: number) => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '256778087986';
  const message = generateWhatsAppMessage(items, total);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Use full-page navigation instead of window.open to avoid popup blockers
  if (typeof window !== 'undefined') {
    window.location.href = whatsappUrl;
  }
};
