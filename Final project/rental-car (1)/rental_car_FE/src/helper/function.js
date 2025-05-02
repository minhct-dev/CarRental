export function formatVND(amount) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export const formatNumber = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

export const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatISODate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString();
}
export const convertHtmlToText = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || ""; // Trả về văn bản thuần túy
};

export const formatPrice = (value) => {
  if (typeof value === 'number') {
    value = value.toString();
  }
  if (!value) {
    return '';
  }
  let rawValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const deFormatPrice = (value) =>  {
  let rawValue = value.replace(/\./g, "").replace(/[^0-9]/g, "");
  return parseInt(rawValue);
}