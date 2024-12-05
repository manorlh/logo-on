export function calculatePrice(imageCount: number): number {
  if (imageCount <= 2) return 0;
  if (imageCount <= 10) return 10;
  if (imageCount <= 20) return 15;
  if (imageCount <= 30) return 20;
  return 40;
}

export function formatPrice(amount: number): string {
  return `${amount} ILS`;
} 