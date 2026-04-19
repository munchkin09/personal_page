import { o as head } from "../../chunks/dev.js";
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("12qhfyh", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Carlos Ledesma · Software Engineer</title>`);
		});
		$$renderer.push(`<meta name="description" content="Carlos Ledesma — Senior Software Engineer. Building elegant solutions with modern web technologies."/>`);
	});
	children($$renderer);
	$$renderer.push(`<!---->`);
}
//#endregion
export { _layout as default };
