import { WhatsAppMessage } from '../models/WhatsAppMessage.js';

export async function sendMockWhatsAppMessage({ user, body, messageType, relatedTask }) {
  if (!user?.phone) return null;

  console.log("Mock WhatsApp Message Sent to: " + user.phone);

  return WhatsAppMessage.create({
    recipient: user._id,
    toNumber: user.phone,
    messageType,
    body,
    provider: 'disabled',
    relatedTask,
    status: 'sent',
    sentAt: new Date()
  });
}

export async function sendMockWhatsAppToUsers(users, message) {
  const results = [];
  for (const user of users) {
    const record = await sendMockWhatsAppMessage({ user, ...message });
    if (record) results.push(record);
  }
  return results;
}