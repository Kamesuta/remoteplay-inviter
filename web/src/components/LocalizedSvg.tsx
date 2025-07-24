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
        Object.entries(textTranslations).forEach(([, translations]) => {
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
        
        // SVGの幅と高さのみをレスポンシブに変更（他の属性は保持）
        localizedSvg = localizedSvg.replace(
          /<svg([^>]*)>/,
          (match, attributes) => {
            // 幅と高さのみを変更し、clip-path、viewBox等の重要な属性は保持
            let newAttributes = attributes
              .replace(/width="[^"]*"/g, 'width="100%"')
              .replace(/height="[^"]*"/g, 'height="100%"');
            
            // 元々width/heightが無い場合は追加
            if (!attributes.includes('width=')) {
              newAttributes += ' width="100%"';
            }
            if (!attributes.includes('height=')) {
              newAttributes += ' height="100%"';
            }
            
            return `<svg${newAttributes}>`;
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
      style={{ 
        width, 
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
      role="img"
      aria-label={alt}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}