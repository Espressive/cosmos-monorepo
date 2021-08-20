/**
 * Conditionally prepare label props in terms of the isLabeled flag:
 *
 * if true, the label is returned as id so it matches the htmlFor in rendered label tag,
 * otherwise, the label is returned as an aria-label so the node is still accessible
 *
 * @param {String} label The labelfor the node
 * @param {Boolean} isLabeled A flag that specifies if a label tag should be displayed
 * @returns {Object} conditionalLabelProps An object to be dot-spread'ed into the node
 */
export const getConditionalLabelProps = (label, isLabeled) =>
  isLabeled ? { id: label } : { 'aria-label': label };
