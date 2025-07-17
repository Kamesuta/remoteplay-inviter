'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

interface LocalizedSvgProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  textTranslations?: {
    [key: string]: {
      ja: string;
      en: string;
    };
  };
}

export default function LocalizedSvg({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  textTranslations = {} 
}: LocalizedSvgProps) {
  const locale = useLocale();
  const [svgContent, setSvgContent] = useState<string>('');
  
  useEffect(() => {
    // SVGファイルを読み込む
    fetch(src)
      .then(response => response.text())
      .then(svgText => {
        let localizedSvg = svgText;
        
        // テキストを置換
        Object.entries(textTranslations).forEach(([key, translations]) => {
          const japaneseText = translations.ja;
          const translatedText = translations[locale as 'ja' | 'en'];
          
          // SVGのテキスト要素内の日本語テキストを置換
          localizedSvg = localizedSvg.replace(
            new RegExp(`>${japaneseText}<`, 'g'),
            `>${translatedText}<`
          );
        });
        
        // SVG内の相対パスを絶対パスに変換
        const basePath = src.substring(0, src.lastIndexOf('/') + 1);
        
        // xlink:href属性の相対パスを絶対パスに変換
        localizedSvg = localizedSvg.replace(
          /xlink:href="([^"]+\.(?:png|jpg|jpeg|svg))"/g,
          (match, imagePath) => {
            // 既に絶対パスの場合はそのまま
            if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
              return match;
            }
            // 相対パスを絶対パスに変換
            return `xlink:href="${basePath}${imagePath}"`;
          }
        );
        
        // href属性の相対パスも同様に変換
        localizedSvg = localizedSvg.replace(
          /href="([^"]+\.(?:png|jpg|jpeg|svg))"/g,
          (match, imagePath) => {
            // 既に絶対パスの場合はそのまま
            if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
              return match;
            }
            // 相対パスを絶対パスに変換
            return `href="${basePath}${imagePath}"`;
          }
        );
        
        setSvgContent(localizedSvg);
      })
      .catch(error => {
        console.error('SVG読み込みエラー:', error);
      });
  }, [src, locale, textTranslations]);

  return (
    <div 
      className={className}
      style={{ width, height }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      role="img"
      aria-label={alt}
    />
  );
}