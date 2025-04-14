/**
 * Helper for making Elements with attributes
 *
 * @param  {string} tagName           - new Element tag name
 * @param  {Array|string} classNames  - list or name of CSS class
 * @param  {object} attributes        - any attributes
 * @returns {Element}
 */
export function make(tagName, classNames, attributes) {
	const el = document.createElement(tagName);

	if (Array.isArray(classNames)) {
		el.classList.add(...classNames);
	} else if (classNames) {
		el.classList.add(classNames);
	}

	for (const attrName in attributes) {
		// eslint-disable-next-line no-prototype-builtins
		if (attributes.hasOwnProperty(attrName)) {
			el[attrName] = attributes[attrName];
		}
	}

	return el;
}
