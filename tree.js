import Node from "./node.js";

/**
 * A binary search tree containing numbers.
 */
export default class Tree {
  /**
   * @param {Array<*>} array
   */
  constructor(array) {
    this.root = this.#buildTree(this.#processArray(array));
  }

  /**
   * Removes duplicates from the given array and sorts its unique elements.
   * @param {Array<*>} array
   * @returns {Array<number>}
   */
  #processArray(array) {
    const nums = array.map((item) => {
      if (isNaN(item)) {
        throw new Error(`Trying to convert ${item} to a number`);
      }
      return Number(item);
    });

    const data = [...new Set(nums)].sort((a, b) => a - b);

    return data;
  }

  /**
   * Builds a balanced binary search tree of unique and sorted numbers.
   * @param {Array<number>} array
   * @returns {?Node}
   */
  #buildTree(array) {
    if (array.length === 0) {
      return null;
    }

    const mid = Math.floor(array.length / 2);
    const root = new Node(array[mid]);

    root.left = this.#buildTree(array.slice(0, mid));
    root.right = this.#buildTree(array.slice(mid + 1));

    return root;
  }

  /**
   * Inserts the given numeric value to this binary search tree.
   * @param {number} value
   * @param {?Node} node
   * @returns {Node}
   */
  #insertRec(value, node) {
    if (node === null) {
      return new Node(value);
    } else if (node.data === value) {
      return node;
    } else if (node.data < value) {
      node.right = this.#insertRec(value, node.right);
    } else {
      node.left = this.#insertRec(value, node.left);
    }

    return node;
  }

  /**
   * Inserts the given value to this binary search tree if it is numeric.
   * @param {*} value
   */
  insert(value) {
    if (isNaN(value)) {
      throw new Error("Trying to insert a non-numeric value");
    }
    this.root = this.#insertRec(Number(value), this.root);
  }

  /**
   * Gets the inorder node after the given node.
   * @param {Node} node
   * @returns {?Node}
   */
  #nextItem(node) {
    node = node.right;

    while (node !== null && node.left !== null) {
      node = node.left;
    }

    return node;
  }

  /**
   * Deletes the given numeric value from this binary search tree if it exists.
   * @param {number} value
   * @param {?Node} node
   * @returns {?Node}
   */
  #deleteItemRec(value, node) {
    if (node === null) {
      return node;
    } else if (node.data < value) {
      node.right = this.#deleteItemRec(value, node.right);
    } else if (node.data > value) {
      node.left = this.#deleteItemRec(value, node.left);
    } else {
      if (node.left === null) {
        return node.right;
      }

      if (node.right === null) {
        return node.left;
      }

      const nextNode = this.#nextItem(node);

      node.data = nextNode.data;
      node.right = this.#deleteItemRec(nextNode.data, node.right);
    }

    return node;
  }

  /**
   * Deletes the given value from this binary search tree if it is numeric.
   * @param {*} value
   */
  deleteItem(value) {
    if (isNaN(value)) {
      throw new Error("Trying to delete a non-numeric value");
    }
    this.root = this.#deleteItemRec(Number(value), this.root);
  }

  /**
   * Finds the given numeric value in this binary search tree if it exists.
   * @param {number} value
   * @param {?Node} node
   * @returns {?Node}
   */
  #findRec(value, node) {
    if (node === null || node.data === value) {
      return node;
    } else if (node.data < value) {
      return this.#findRec(value, node.right);
    }
    return this.#findRec(value, node.left);
  }

  /**
   * Finds the given value in this binary search tree if it is numeric.
   * @param {*} value
   * @returns {?Node}
   */
  find(value) {
    if (isNaN(value)) {
      throw new Error("Trying to find a non-numeric value");
    }
    return this.#findRec(Number(value), this.root);
  }

  /**
   * Performs level order traversal on this binary search tree.
   * @param {function(Node)} callback
   */
  levelOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Trying to traverse without a callback function");
    }

    if (this.root === null) {
      return;
    }

    const queue = [this.root];

    let levelSize = 1;

    while (levelSize > 0) {
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();

        callback(node);

        if (node.left !== null) {
          queue.push(node.left);
        }

        if (node.right !== null) {
          queue.push(node.right);
        }
      }

      levelSize = queue.length;
    }
  }

  /**
   * Performs inorder traversal on this binary search tree.
   * @param {function(Node)} callback
   * @param {?Node} node
   */
  #inOrderRec(callback, node) {
    if (node === null) {
      return;
    }

    this.#inOrderRec(callback, node.left);
    callback(node);
    this.#inOrderRec(callback, node.right);
  }

  /**
   * Performs inorder traversal if the given callback is a function.
   * @param {*} callback
   */
  inOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Trying to traverse without a callback function");
    }
    this.#inOrderRec(callback, this.root);
  }

  /**
   * Performs preorder traversal on this binary search tree.
   * @param {function(Node)} callback
   * @param {?Node} node
   */
  #preOrderRec(callback, node) {
    if (node === null) {
      return;
    }

    callback(node);
    this.#preOrderRec(node.left);
    this.#preOrderRec(node.right);
  }

  /**
   * Performs preorder traversal if the given callback is a function.
   * @param {*} callback
   */
  preOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Trying to traverse without a callback function");
    }
    this.#preOrderRec(callback, this.root);
  }

  /**
   * Performs postorder traversal on this binary search tree.
   * @param {function(Node)} callback
   * @param {?Node} node
   */
  #postOrderRec(callback, node) {
    if (node === null) {
      return;
    }

    this.#postOrderRec(node.left);
    this.#postOrderRec(node.right);
    callback(node);
  }

  /**
   * Performs postorder traversal if the given callback is a function.
   * @param {*} callback
   */
  postOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Trying to traverse without a callback function");
    }
    this.#postOrderRec(callback, this.root);
  }

  /**
   * Gets the height of the given node.
   * A node's height is the number of edges in the longest path to a leaf node.
   * @param {?Node} node
   * @returns {number}
   */
  height(node) {
    if (node === null) {
      return 0;
    }
    return Math.max(this.height(node.left), this.height(node.right)) + 1;
  }

  /**
   * Gets the number of edges between the root node and the given node.
   * @param {?Node} node
   * @returns {number}
   */
  depth(node) {
    let result = 0;
    let currNode = this.root;

    while (currNode !== node) {
      if (currNode.data < node.data) {
        currNode = currNode.right;
      } else {
        currNode = currNode.left;
      }

      result++;
    }

    return result;
  }

  /**
   * Checks if this binary search tree is balanced at the given node.
   * A balanced tree has subtrees' heights differ by at most one in every node.
   * @param {?Node} node
   * @returns {boolean}
   */
  #isBalancedRec(node) {
    if (node === null) {
      return true;
    }

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.#isBalancedRec(node.left) &&
      this.#isBalancedRec(node.right)
    );
  }

  /**
   * Checks if this binary search tree is balanced at the root node.
   * @returns {boolean}
   */
  isBalanced() {
    return this.#isBalancedRec(this.root);
  }

  /**
   * Rebalances this binary search tree if it is unbalanced.
   */
  rebalance() {
    if (!this.isBalanced()) {
      const data = [];
      this.inOrder((node) => data.push(node.data));
      this.root = this.#buildTree(data);
    }
  }

  /**
   * Prints this binary search tree to the console in a structured format.
   * @param {?Node} node
   * @param {string} prefix
   * @param {boolean} isLeft
   */
  prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }

    if (node.right !== null) {
      const rightPrefix = isLeft ? "|   " : "    ";
      this.prettyPrint(node.right, prefix + rightPrefix, false);
    }

    const nodePrefix = isLeft ? "└── " : "┌── ";
    console.log(prefix + nodePrefix + String(node.data));

    if (node.left !== null) {
      const leftPrefix = isLeft ? "    " : "|   ";
      this.prettyPrint(node.left, prefix + leftPrefix, true);
    }
  }
}
