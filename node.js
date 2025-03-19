/**
 * A node in a binary search tree.
 */
export default class Node {
  /**
   * @param {number} data
   * @param {?Node} left
   * @param {?Node} right
   */
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}
