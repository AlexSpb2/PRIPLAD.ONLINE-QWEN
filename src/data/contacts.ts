export interface Contact {
  label: string;
  href: string;
  handle: string;
}

// Mock-контакты. Реальные значения добавит владелец.
export const CONTACTS: Contact[] = [
  {
    label: "Telegram",
    href: "https://t.me/priplad",
    handle: "@priplad",
  },
  {
    label: "VK",
    href: "https://vk.com/priplad",
    handle: "vk.com/priplad",
  },
];

export const PHONE = "+7 (000) 000-00-00";
