

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/cv/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.B5NBHSDZ.js","_app/immutable/chunks/BdJn3BNB.js","_app/immutable/chunks/DXLwiZ0H.js"];
export const stylesheets = ["_app/immutable/assets/3.DMvYIrVE.css"];
export const fonts = [];
