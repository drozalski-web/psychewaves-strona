// Przełącznik sklepu. Dopóki sklep jest „w budowie”, /sklep/ pokazuje stronę „Sklep w budowie” z zapisem na listę,
// a podstrony sklepu (odzież, materiały, Placebo Junior) pokazują tę samą stronę.
// Otwarcie sklepu: ustaw zmienną środowiskową PUBLIC_SKLEP_OTWARTY=true w Netlify (np. tylko w podglądzie do testów)
// albo zmień wartość domyślną poniżej na true.
export const SKLEP_OTWARTY = (import.meta.env.PUBLIC_SKLEP_OTWARTY ?? 'false') === 'true';
