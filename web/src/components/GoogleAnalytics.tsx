import Script from "next/script";

const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_ID;

export const GoogleAnalytics = () => (
  <>
    {GOOGLE_ANALYTICS_ID && (
      <>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        />
        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}');
            `}
        </Script>
      </>
    )}
  </>
);
