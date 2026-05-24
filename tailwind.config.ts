/** @type {import('tailwindcss').Config} */
module.exports = {
  // १. यसले तपाइँको प्रोजेक्ट भित्रका कुन कुन फाइलमा tailwind बुझ्ने भनेर ट्र्याक गर्छ
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // यदि src फोल्डर छ भने काम गर्छ
  ],
  theme: {
    extend: {
      // २. यहाँ पार्टनर बैंक एनिमेसनको मुख्य कन्फिगरेसन थपिएको छ
      animation: {
        // ३० सेकेन्डमा एउटा चक्र पूरा हुने गरी 'marquee' नामको एनिमेसन सेट गरियो
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // ५०% मा सरेपछि लुप दोहोरिन्छ
        },
      },
    },
  },
  plugins: [],
}