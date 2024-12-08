'use client';

import { Input, Slider } from "@nextui-org/react";
import { useLanguage } from "../LanguageContext";

interface LogoControlsProps {
  logoSize: { width: number; height: number };
  logoPosition: { x: number; y: number };
  maintainAspectRatio: boolean;
  onSizeChange: (value: number, dimension: 'width' | 'height') => void;
  onPositionChange: (value: number, axis: 'x' | 'y') => void;
  onAspectRatioChange: (value: boolean) => void;
  maxWidth: number;
  maxHeight: number;
}

export function LogoControls({
  logoSize,
  logoPosition,
  maintainAspectRatio,
  onSizeChange,
  onPositionChange,
  onAspectRatioChange,
  maxWidth,
  maxHeight
}: LogoControlsProps) {
  const { t } = useLanguage();

  const handlePositionChange = (value: number, axis: 'x' | 'y') => {
    const maxPos = axis === 'x' ? 
      Math.max(0, maxWidth - logoSize.width) : 
      Math.max(0, maxHeight - logoSize.height);
    
    const boundedValue = Math.max(0, Math.min(Math.round(value), maxPos));
    onPositionChange(boundedValue, axis);
  };

  // Calculate max positions for sliders
  const maxPosX = Math.max(0, maxWidth - logoSize.width);
  const maxPosY = Math.max(0, maxHeight - logoSize.height);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl mb-2">{t.logoSize.title}</h2>
        <div className="mb-3 text-sm text-gray-600">
          <p>{t.logoSize.sliders}</p>
          <p>{t.logoSize.ratio}</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <label className="w-20">{t.logoSize.width}</label>
            <Slider
              size="sm"
              step={1}
              maxValue={maxWidth}
              minValue={10}
              value={logoSize.width}
              onChange={(value) => onSizeChange(Number(value), 'width')}
              className="flex-grow"
            />
            <Input
              type="number"
              value={logoSize.width.toString()}
              onChange={(e) => onSizeChange(Number(e.target.value), 'width')}
              className="w-24"
              min={10}
              max={maxWidth}
            />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <label className="w-20">{t.logoSize.height}</label>
            <Slider
              size="sm"
              step={1}
              maxValue={maxHeight}
              minValue={10}
              value={logoSize.height}
              onChange={(value) => onSizeChange(Number(value), 'height')}
              className="flex-grow"
            />
            <Input
              type="number"
              value={logoSize.height.toString()}
              onChange={(e) => onSizeChange(Number(e.target.value), 'height')}
              className="w-24"
              min={10}
              max={maxHeight}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={maintainAspectRatio}
              onChange={(e) => onAspectRatioChange(e.target.checked)}
              id="aspectRatio"
            />
            <label htmlFor="aspectRatio">{t.logoSize.maintainRatio}</label>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl mb-2">{t.logoPosition.title}</h2>
        <div className="mb-3 text-sm text-gray-600">
          <p>{t.logoPosition.drag}</p>
          <p>{t.logoPosition.instructions}</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <label className="w-20">X {t.logoPosition.position}</label>
            <Slider
              size="sm"
              step={1}
              maxValue={maxPosX}
              minValue={0}
              value={logoPosition.x}
              onChange={(value) => handlePositionChange(Number(value), 'x')}
              className="flex-grow"
            />
            <Input
              type="number"
              value={Math.round(logoPosition.x).toString()}
              onChange={(e) => handlePositionChange(Number(e.target.value), 'x')}
              className="w-24"
              min={0}
              max={maxPosX}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-20">Y {t.logoPosition.position}</label>
            <Slider
              size="sm"
              step={1}
              maxValue={maxPosY}
              minValue={0}
              value={logoPosition.y}
              onChange={(value) => handlePositionChange(Number(value), 'y')}
              className="flex-grow"
            />
            <Input
              type="number"
              value={Math.round(logoPosition.y).toString()}
              onChange={(e) => handlePositionChange(Number(e.target.value), 'y')}
              className="w-24"
              min={0}
              max={maxPosY}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 