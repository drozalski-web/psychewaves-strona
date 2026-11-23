// Przełącznik zapisów na kurs i newsletter (Brevo). Dopóki konto Brevo i zmienne w Netlify nie są gotowe,
// formularze są ukryte. Włączenie: PUBLIC_ZAPISY_AKTYWNE=true w Netlify (w obu projektach) i nowe wdrożenie.
export const ZAPISY_AKTYWNE = (import.meta.env.PUBLIC_ZAPISY_AKTYWNE ?? 'false') === 'true';
