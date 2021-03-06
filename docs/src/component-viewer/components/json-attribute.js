import { toHTML } from '../../utils/to-html';
import { debounce } from '../../utils/debounce';

export const jsonAttribute = (name, astNode, parent, renderCallback) => {
  let matchingAttr = astNode.attrs.find(a => a.name === name);

  let value = parse(matchingAttr ? matchingAttr.value : '', 2);

  let element = toHTML(`
    <label>
        <span>${name}:</span>
        <textarea rows="6">${value}</textarea>
    </label>`);

  element.addEventListener(
    'input',
    debounce(event => {
      let value = parse(event.target.value);

      if (matchingAttr) {
        matchingAttr.value = value;
      } else if (value) {
        astNode.attrs.push({ name: name, value });
      } else {
        astNode.attrs = astNode.attrs.filter(a => a.name !== name);
      }

      renderCallback();
    }, 2000)
  );

  parent.appendChild(element);
};

function parse(json, indent = 0) {
  try {
    return JSON.stringify(JSON.parse(json), null, indent);
  } catch (e) {
    console.error('Error while parsing json attribute: ', e);
    return json;
  }
}
