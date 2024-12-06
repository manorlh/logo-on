export function calculatePrice(imageCount: number, isILS: boolean): number {
  if (imageCount <= 2) return 0;
  if (imageCount <= 10) return isILS ? 10 : 3;
  if (imageCount <= 20) return isILS ? 15 : 4;
  if (imageCount <= 30) return isILS ? 20 : 5;
  return isILS ? 40 : 10;
}

export function formatPrice(amount: number, isILS: boolean): string {
  return isILS ? `₪${amount}` : `$${amount}`;
} 