# 树结构和BST树

## 树结构

树的特点

- 树通常有一个根。连接着根的是树干
- 树干到上面之后会进行分叉成树枝，树枝还会分又成更小的树枝
- 在树枝的最后是叶子

树的抽象

- 树可以模拟生活中的很多场景，比如：公司组织架构、家谱、DOM Tree、电脑文件夹架构

> 优秀的哈希函数（补充）
>
> - 快速计算：霍纳法则
> - 均匀分布：质数（长度、幂的底）

### 数据结构对比

数组

- 优点
  - 数组的主要优点是根据 **下标值访问** 效率会很高
  - 但是如果我们希望根据元素来查找对应的位置呢？
  - 比较好的方式先对数组进行排序，再进行二分查找
- 缺点
  - 需要 **先对数组进行排序，生成有序数组**，才能提高查找效率
  - 另外数组和插入和删除数据时，需要有大量的位移操作（插入到首位或者中间位置的时候）效率很低

链表

- 优点
  - 链表的插入和删除操作效率都很高
- 缺点
  - **查找效率很低**，需要从头开始依次访问链表中的每个数据项，直到找到
  - 而且即使插入和删除操作操作效率很高，但是如果要插入和删除中间位置的数据，还是需要从头先找到对应的数据

哈希表

- 优点
  - 哈希表的插入、查询、删除效率都是非常高的
- 缺点
  - **空间利用率不高**，底层使用的数组，并且某些单元是没有被利用的
  - 哈希表中的元素是无序的，不能安装固定的顺序来遍历哈希表中的元素
  - 不能快速的找出哈希表中的 **最大值或最小值** 这些特殊的值

树

- 不能说树结构比其他结构都要好，因为 **每种数据结构都有自己的特定的应用场景**
- 但是树确实综合了上面的数据结构的优点，并且弥补了上面数据结构的缺点

而且模拟某些场景，我们使用树结构会更加方便

- 因为数结构的非线性，可以表示一对多的关系
- 比如：文件的目录结构

### 树的术语

不过大部分术语都与真实世界的树相关，或者和家庭关系相关(如父节点和子节点)

树（Tree）：n（n>=0）个节点构成的有限集合

- 当 n=0 时，称为空树

对于任一颗非空树（n>0），它具备以下性质：

- 树中有一个称为 "根（Root）" 的特殊节点，用 r 表示
- 其余节点可分为 m（m>0）个互不相交的有限集 T1、T2...Tm，其中每个集合本身又是一棵树，称为原来数的 "子树（SubTree）"

![image-20230831092517176](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831092517176.png)

1. 节点的度（Degree）：节点的子树个数
2. 树的度（Degree）：树的所有节点的最大度数
3. 叶节点（Leaf）：度为 0 的节点（也称为叶子节点）
4. 父节点（Parent）：有子树节点时其子树的根节点的父节点
5. 子节点（Child）：若 A 节点是 B 节点的父节点，则称 B 节点是 A 节点的子节点，子节点也称孩子节点
6. 兄弟节点（Sibling）：具有同一父节点的各节点彼此是兄弟节点
7. 路径和路径长度：从节点 n1 到 nk 的路径为一个节点序列 n1、n2...nk
   - ni 是 n(i+1) 的父节点
   - 路径所包含边的个数为路径的长度
8. 节点的层次（Level）：规定节点在 1 层，其它任一节点的层数是其父节点的层数+1
9. 树的深度（Depth）：树中所有节点中的最大层次是这棵树的深度

### 表示方法

![image-20230831094324866](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831094324866.png)

![image-20230831094358332](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831094358332.png)

所有的数本质上都可以使用二叉树模拟出来

![image-20230831095339522](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831095339522.png)

## 二叉树

### 二叉树分类

如果树中每个节点 **最多只能有两个子节点**，这样的数就称为 **"二叉树"**

- 二叉树可以为空，也就是没有节点
- 若不为空，则它是由根节点和称为其 **左子树TL** 和 **右子树TR** 的两个不相交的二叉树组成

![image-20230831095734913](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831095734913.png)

二叉树有几个比较重要的特性，笔试题中比较常见：

- 一颗二叉树第 i 层的最大节点树为：`2^(i-1), i>=1`
- 深度为 k 的二叉树有最大节点总数为：`2^k-1, k>=1`
- 对任何非空二叉树 T，若 n0 表示叶子点的个数，n2 是度为 2 的非叶节点个数，那么两者满足关系 n0=n2+1

完美二叉树（Perfect Binary Tree），也称满二叉树（Full Binary Tree）

- 在二叉树中，除了下一层的叶节点外，每层节点都有 2 个子节点，就构成了满二叉树

![image-20230831101407988](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831101407988.png)

完全二叉树（Complete Binary Tree）

- **除二叉树最后一层外，其它各层的节点个数都达到最大个数**
- **最后一层从左到右的叶节点连续存在，只缺右侧若干节点**
- 完美二叉树是特殊的完全二叉树

![image-20230831101851096](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831101851096.png)

### 二叉树存储

二叉树的存储常见的方式是数组和链表

![image-20230831102047188](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831102047188.png)

二叉树最常见的方式还是使用链表存储

- 每个节点封装成一个 Node，Node 中包含存储的数据，左节点的引用，右节点的引用

![image-20230831102315370](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831102315370.png)

### 二叉搜索树

二叉搜索树（BST，Binary Search Tree），也称二叉排序树或二叉查找树

二叉搜索树是一颗二叉树，可以为空，如果不为空，满足以下性质：

- 非空左子树的所有键值小于根节点的键值
- 非空右子树的所有键值大于其根节点的键值
- 左、右子树本身也都是二叉搜索树

![image-20230831144423346](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831144423346.png)

这种方式就是二分查找的思想：

- 查找所需的最大次数等于二叉搜索树的深度
- 插入节点，也利用类似的方法，一层层比较大小，找到新节点合适的位置

## 封装二叉搜索树

### 常见操作

插入操作：

- insert(value)：向树中插入一个新的数据

查找操作：

- search(value)：在树中查找一个数据，如果节点存在，则返回 true；如果不存在，则返回 false
- min：返回树中最小的值/数据
- max：返回树中最大的值/数据

遍历操作：

- inOrderTraverse：通过中序遍历方式遍历所有节点
- preOrderTraverse：通过先序遍历方式遍历所有节点
- postOrderTraverse：通过后序遍历方式遍历所有节点
- levelOrderTraverse：通过层序遍历方式遍历所有节点

删除操作：

- remove(value)：从树中移除某个数据

### 插入数据

1. 插入其他节点时，我们需要判断该值到底是插入到左边还是插入到右边
2. 判断的依据来自于新节点的 value 和原来节点的 value 值的比较
   - 如果新节点的 newValue 小于原节点的 oldValue，那么就向左边插入
   - 如果新节点的 newValue 大于原节点的 oldValue，那么就向右插入
3. 代码1位置，就是准备向左子树插入数据，但是它本身有分成两种情况
   - 情况一：左子树上原来没有内容，那么直接插入即可
   - 情况二：左子树上已经有了内容，那么久一次向下继续查找新的走向，所以使用递归调用即可
4. 代码2位置，和代码1位置几乎逻辑是相同的，只是去向右查找
   - 情况一：左右树上原来没有内容，那么直接插入即可
   - 情况二：右子树上已经有了内容，那么就一次向下继续查找新的走向，所以使用递归调用即可

```typescript
class BSTree<T> {
  private insertNode(node: TreeNode<T>, newNode: TreeNode<T>) {
    // 代码1
    if (newNode.value < node.value) {
      // 去左边继续查找空白位置
      if (node.left === null) {
        node.left = newNode
      } else {
        this.insertNode(node.left, newNode)
      }
    // 代码2
    } else {
      // 去右边继续查找空白位置
      if (node.right === null) {
        node.right = newNode
      } else {
        this.insertNode(node.right, newNode)
      }
    }
  }
}
```

### 遍历数据

- 遍历一棵树是指访问树的每个节点（也可以对每个节点进行某些操作，我们这里就是简单的打印）
- 但是树和线性结构不太一样，线性结构我们通常按照从前到后的顺序遍历，但是树呢？
- 应该从树的顶端还是底端开始呢？从左开始还是从右开始呢？

二叉树遍历常见的四种方式：

- 先序遍历
- 中序遍历
- 后序遍历
- 层序遍历

![image-20230831174022109](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831174022109.png)

先序/中序/后序：取决于访问根节点（root）的时机

- 在所有的树结构中（包括子树）都是如此

#### 先序遍历

1. 优先访问根节点
2. 之后访问左子树
3. 最后访问右子树

![image-20230831180509840](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230831180509840.png)

- 递归版本

```typescript
class TreeNode<T> extends Node<T> {
  preOrderTraverse() {
    this.preOrderTraverseNode(this.root)
  }
  private preOrderTraverseNode(node: TreeNode<T> | null) {
    if (node) {
      console.log(node.value)
      this.preOrderTraverseNode(node.left)
      this.preOrderTraverseNode(node.right)
    }
  }
}
```

- 非递归版本

```typescript
class TreeNode<T> extends Node<T> {
  preOrderTraversalNoRecursion() {
    let stack: TreeNode<T>[] = []
    let current: TreeNode<T> | null = this.root
    while (current !== null || stack.length !== 0) {
      while (current !== null) {
        console.log(current.value)
        stack.push(current)
        current = current.left
      }
      current = stack.pop()!
      current = current.right
    }
  }
}
```

#### 中序遍历

1. 优先访问左子树
2. 之后访问根节点
3. 最后访问右子树

![image-20230901102713771](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230901102713771.png)

- 递归版本

```typescript
class TreeNode<T> extends Node<T> {
	inOrderTraverse() {
    this.inOrderTraverseNode(this.root)
  }
  private inOrderTraverseNode(node: TreeNode<T> | null) {
    if (node) {
      this.inOrderTraverseNode(node.left)
      console.log(node.value)
      this.inOrderTraverseNode(node.right)
    }
  }
}
```

- 非递归版本

```typescript
class TreeNode<T> extends Node<T> {
  inOrderTraversalNoRecursion() {
    let stack: TreeNode<T>[] = []
    let current: TreeNode<T> | null = this.root
    while (current !== null || stack.length !== 0) {
      while (current !== null) {
        stack.push(current)
        current = current.left
      }
      current = stack.pop()!
      console.log(current.value)
      current = current.right
    }
  }
}
```

#### 后序遍历

1. 优先访问左子树
2. 之后访问右子树
3. 最后访问根节点

![image-20230901103316974](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230901103316974.png)

- 递归版本

```typescript
class TreeNode<T> extends Node<T> {
  postOrderTraverse() {
    this.postOrderTraverseNode(this.root)
  }
  private postOrderTraverseNode(node: TreeNode<T> | null) {
    if (node) {
      this.postOrderTraverseNode(node.left)
      this.postOrderTraverseNode(node.right)
      console.log(node.value)
    }
  }
}
```

- 非递归版本

```typescript
class TreeNode<T> extends Node<T> {
  preOrderTraversalNoRecursion() {
    let stack: TreeNode<T>[] = []
    let current: TreeNode<T> | null = this.root
    while (current !== null || stack.length !== 0) {
      while (current !== null) {
        console.log(current.value)
        current = current.left
      }
      current = stack.pop()!
      stack.push(current)
      current = current.right
    }
  }
}
```

#### 层序遍历

层序遍历很好理解，就是从上向下逐层遍历

层序遍历通常我们会借助队列来完成

- 也是队列的一个经典应用场景

![image-20230901104440111](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230901104440111.png)

```typescript
class TreeNode<T> extends Node<T> {
  levelOrderTraverse() {
    // 1.如果没有根节点，那么不需要遍历
    if (!this.root) return
    // 2.创建队列结构
    const queue: TreeNode<T>[] = []
    queue.push(this.root)
    // 3.遍历队列中所有的节点（依次出队）
    while (queue.length) {
      // 3.1.访问节点的过程
      const current = queue.shift()!
      console.log(current.value)
      // 3.2.将左子节点放入队列
      if (current.left) {
        queue.push(current.left)
      }
      // 3.3.将右子节点放入到队列
      if (current.right) {
        queue.push(current.right)
      }
    }
  }
}
```

### 最值

在二叉搜索树中搜索最值是一件非常简单的事情，其实用眼睛就可以看出来了

![image-20230901141644257](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230901141644257.png)

```typescript
class TreeNode<T> extends Node<T> {
  /** 获取最值操作：最大值 */
  getMaxValue(): T | null {
    let current = this.root
    while (current && current.right) {
      current = current.right
    }
    return current?.value ?? null
  }
  /** 获取最值操作：最小值 */
  getMinValue(): T | null {
    let current = this.root
    while (current && current.left) {
      current = current.left
    }
    return current?.value ?? null
  }
}
```

### 搜索特定的值

二叉搜索树不仅仅获取最值效率非常高，搜索特定的值效率也非常高

- 注意：这里的实现返回 boolean 类型即可

```typescript
class TreeNode<T> extends Node<T> {
  searchNoRecursion(value: T): boolean {
    let current = this.root
    while (current) {
      // 找到了节点
      if (current.value === value) return true
      if (current.value < value) {
        current = current.right
      } else {
        current = current.left
      }
    }
    return false
  }
  search(value: T): boolean {
    return this, this.searchNode(this.root, value)
  }
  searchNode(node: TreeNode<T> | null, value: T): boolean {
    // 1.如果节点为null，那么就直接退出递归
    if (node === null) return false
    // 2.判断node节点的value和传入的value的大小
    if (node.value > value) {
      return this.searchNode(node.left, value)
    } else if (node.value < value) {
      return this.searchNode(node.right, value)
    } else {
      return true
    }
  }
}
```

### 删除操作

二叉搜索树的删除有些复杂，我们一点点完成

删除节点要从查找到删除的节点开始，找到节点后，需要考虑三种情况：

- 该节点是叶节点（没有子节点，比较简单）
- 该节点有一个子节点（相对简单）
- 该节点有两个子节点（情况复杂）

我们先从查找要删除的节点入手

1. 先找到要删除的节点
2. 找到要删除节点
   1. 删除叶子节点
   2. 删除只有一个子节点
   3. 删除有两个子节点的节点

```typescript
class TreeNode<T> extends Node<T> {
  left: TreeNode<T> | null = null
  right: TreeNode<T> | null = null
  parent: TreeNode<T> | null = null
  get isLeft(): boolean {
    return !!(this.parent && this.parent.left === this)
  }
  get isRight(): boolean {
    return !!(this.parent && this.parent.right === this)
  }
}

class TreeNode<T> extends Node<T> {
  private searchNode(value: T): TreeNode<T> | null {
    let current = this.root
    let parent: TreeNode<T> | null = null
    while (current) {
      if (current.value === value) return current
      parent = current
      if (current.value < value) {
        current = current.right
      } else {
        current = current.left
      }
      if (current) current.parent = parent
    }
    return null
  }
}
```

#### 情况一：没有子节点

- 这种情况相对比较简单，我们需要检测 current 的 left 以及 right 是否都为 null
- 都为 null 之后还要检测一个东西，就是是否 current 就是根，都为 null，并且为根，那么相当于清空了根，因为只有它
- 否则就把父节点的 left 或者 right 字段设置为 null 即可

如果只有一个单独的根，直接删除即可

- 如果是叶节点，那么处理方式如下

```typescript
class TreeNode<T> extends Node<T> {
  remove(value: T): boolean {
    // 1.搜索当前是否有这个value
    const current = this.searchNode(value)
    if (!current) return false
    // 2.获取到三个东西：当前节点/父节点是否属于父节点的左子节点还是右子节点
    // 2.1.如果删除的是叶子节点
    if (current.left === null && current.right === null) {
      if (current === this.root) {
        // 根节点
        this.root = null
      } else if (current.isLeft) {
        // 父节点的左子节点
        current.parent!.left = null
      } else {
        current.parent!.right = null
      }
    }
    return true
  }
}
```

#### 情况二：一个子节点

- 这种情况也不是很难
- 要删除的 current 节点，只有 2 个连接（如果有两个子节点，就是三个连接了），一个连接父节点，一个连接唯一的子节点
- 需要从这三者之间：爷爷-自己-儿子，将自己（current）剪断，让爷爷直接连接儿子即可
- 这个过程要求改变父节点的 left 或者 right，指向要删除节点的子节点
- 当然，这个过程中还要考虑是否 current 就是根

```js
class TreeNode<T> extends Node<T> {
	remove(value: T): boolean {
		if (current.right === null) {
      // 2.2.只有一个子节点，只有左子节点
      if (current === this.root) {
        this.root = current.left
      } else if (current.isLeft) {
        current.parent!.left = current.left
      } else {
        current.parent!.right = current.left
      }
    } else if (current.left === null) {
      // 2.3.只有一个子节点，只有右子节点
      if (current === this.root) {
        this.root = current.right
      } else if (current.isLeft) {
        current.parent!.left = current.right
      } else {
        current.parent!.right = current.right
      }
    }
    return true
  }
}
```

#### 情况三：两个节点

![image-20230904100428216](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230904100428216.png)

- 情况一：删除 9 节点
  - 处理方式相对简单，将 8 位置替换到 9，或者将 10 位置替换到 9
  - 注意：这里是替换，也就是 8 位置替换到 9 时，7 指向 8，而 8 还需要指向 10
  - 找 8 或 10
- 情况二：删除 7 节点
  - 一种方式是将 5 拿到 7 的位置，3 依然指向 5，但是 5 有一个 right，需要指向 9，依然是二叉搜索树
  - 另一种方式是在右侧找一个，找 8
  - 也就是将 8 替换到 7 的位置，8 的 left 指向 5，right 指向 9，依然是二叉搜索树
  - 找 5 或 8
- 情况三：删除 15 节点，并且我希望也在右边找
  - 18 替换 15 的位置，20 的 left 指向 19，也是一个二叉搜索树
  - 找 14 或 18

```typescript
class TreeNode<T> extends Node<T> {
  private getSuccessor(delNode: TreeNode<T>) {
    // 获取右子树
    let current = delNode.right
    let successor: TreeNode<T> | null = null
    while (current) {
      successor = current
      current = current.left
      if (current) {
        current.parent = successor
      }
    }
    // 拿到后继节点
    if (successor !== delNode.right) {
      successor!.parent!.left = successor!.right
      successor!.right = delNode.right
    }

    // 将删除节点的 left，赋值给后继节点的 left
    successor!.left = delNode.left
    return successor
  }
	remove(value: T): boolean {
    else {
      // 2.4.两个子节点
      const successor = this.getSuccessor(current)
      if (current === this.root) {
        this.root = successor
      } else if (current.isLeft) {
        current.parent!.left = successor
      } else {
        current.parent!.right = successor
      }
    }
    return true
  }
}
```

### 寻找规律

如果我们要 **删除的节点有两个子节点，甚至子节点还有子节点**，这种情况下我们需要 **从下面的子节点中找到一个子节点，来替换当前的节点**

但是找到这个节点有什么特征呢？应该是 current 节点下面所有节点中 **最接近 current 节点** 的

- **要么比 current 节点小一点点，要么比 current 节点大一点点**
- 总结你最接近 current，你就可以用来替换 current 的位置

这个节点怎么找呢？

- 比 current 小一点点的节点，一定是 current 左子树的最大值
- 比 current 大一点点的节点，一定是 current 右子树的最小值

前驱和后继

- 在二叉搜索树中，这两个特别的节点，有两个特别的名字
- 比 current 小一点点的节点，称为 current 节点的 **前驱**
- 比 current 大一点点的节点，称为 current 节点的 **后继**

也就是为了能够删除有两个子节点的 current，要么找到它的前驱，要么找到它的后继

```typescript
class TreeNode<T> extends Node<T> {
	remove(value: T): boolean {
    // 1.搜索当前是否有这个value
    const current = this.searchNode(value)
    if (!current) return false
    // 2.获取到三个东西：当前节点/父节点是否属于父节点的左子节点还是右子节点
    let replaceNode: TreeNode<T> | null = null
    if (current.left === null && current.right === null) {
      // 2.1.如果删除的是叶子节点
      replaceNode = null
    } else if (current.right === null) {
      // 2.2.只有一个子节点，只有左子节点
      replaceNode = current.left
    } else if (current.left === null) {
      // 2.3.只有一个子节点，只有右子节点
      replaceNode = current.right
    } else {
      // 2.4.两个子节点
      const successor = this.getSuccessor(current)
      replaceNode = successor
    }
    if (current === this.root) {
      this.root = replaceNode
    } else if (current.isLeft) {
      current.parent!.left = replaceNode
    } else {
      current.parent!.right = replaceNode
    }
    return true
  }
}
```

删除操作非常复杂，一些程序员都尝试着避开删除操作

- 他们的做法是在 Node 类中添加一个 boolean 字段，比如名称为 isDeleted
- 要删除一个节点时，就将此字段设置为 true
- 其他操作，比如 find() 在查找之前先判断这个节点是不是标记为删除
- 这样相对比较简单，每次删除节点不会改变原有的树结构
- 但是在二叉树的存储中，还保留这那些本已经被删除掉的节点

### 完整代码

```typescript
import { btPrint } from 'hy-algokit'

class INode<T> {
  value: T
  constructor(value: T) {
    this.value = value
  }
}
class TreeNode<T> extends Node<T> {
  left: TreeNode<T> | null = null
  right: TreeNode<T> | null = null
  parent: TreeNode<T> | null = null
  get isLeft(): boolean {
    return !!(this.parent && this.parent.left === this)
  }
  get isRight(): boolean {
    return !!(this.parent && this.parent.right === this)
  }
}
class BSTree<T> {
  private root: TreeNode<T> | null = null
  print() {
    btPrint(this.root)
  }
  private searchNode(value: T): TreeNode<T> | null {
    let current = this.root
    let parent: TreeNode<T> | null = null
    while (current) {
      if (current.value === value) return current
      parent = current
      if (current.value < value) {
        current = current.right
      } else {
        current = current.left
      }
      if (current) current.parent = parent
    }
    return null
  }
  /** 插入数据的操作 */
  insert(value: T) {
    // 1.根据传入value创建Node(TreeNode)节点
    const newNode = new TreeNode(value)
    // 2.判断当前是否已经有了根节点
    if (!this.root) {
      // 当前树为空
      this.root = newNode
    } else {
      // 树中已经有其他值
      this.insertNode(this.root, newNode)
    }
  }
  private insertNode(node: TreeNode<T>, newNode: TreeNode<T>) {
    if (newNode.value < node.value) {
      // 去左边继续查找空白位置
      if (node.left === null) {
        node.left = newNode
      } else {
        this.insertNode(node.left, newNode)
      }
    } else {
      // 去右边继续查找空白位置
      if (node.right === null) {
        node.right = newNode
      } else {
        this.insertNode(node.right, newNode)
      }
    }
  }
  // 遍历的操作
  /** 先序遍历 */
  preOrderTraverse() {
    this.preOrderTraverseNode(this.root)
  }
  private preOrderTraverseNode(node: TreeNode<T> | null) {
    if (node) {
      console.log(node.value)
      this.preOrderTraverseNode(node.left)
      this.preOrderTraverseNode(node.right)
    }
  }
  /** 中序遍历 */
  inOrderTraverse() {
    this.inOrderTraverseNode(this.root)
  }
  private inOrderTraverseNode(node: TreeNode<T> | null) {
    if (node) {
      this.inOrderTraverseNode(node.left)
      console.log(node.value)
      this.inOrderTraverseNode(node.right)
    }
  }
  /** 后序遍历 */
  postOrderTraverse() {
    this.postOrderTraverseNode(this.root)
  }
  private postOrderTraverseNode(node: TreeNode<T> | null) {
    if (node) {
      this.postOrderTraverseNode(node.left)
      this.postOrderTraverseNode(node.right)
      console.log(node.value)
    }
  }
  /** 层序遍历 */
  levelOrderTraverse() {
    // 1.如果没有根节点，那么不需要遍历
    if (!this.root) return
    // 2.创建队列结构
    const queue: TreeNode<T>[] = []
    queue.push(this.root)
    // 3.遍历队列中所有的节点（依次出队）
    while (queue.length) {
      // 3.1访问节点的过程
      const current = queue.shift()!
      console.log(current.value)
      // 3.2将左子节点放入队列
      if (current.left) {
        queue.push(current.left)
      }
      // 3.3将右子节点放入到队列
      if (current.right) {
        queue.push(current.right)
      }
    }
  }
  /** 获取最值操作：最大值 */
  getMaxValue(): T | null {
    let current = this.root
    while (current && current.right) {
      current = current.right
    }
    return current?.value ?? null
  }
  /** 获取最值操作：最小值 */
  getMinValue(): T | null {
    let current = this.root
    while (current && current.left) {
      current = current.left
    }
    return current?.value ?? null
  }
  /** 搜索特定的值 */
  search(value: T): boolean {
    return !!this.searchNode(value)
  }
  searchNodeValue(node: TreeNode<T> | null, value: T): boolean {
    // 1.如果节点为null，那么就直接退出递归
    if (node === null) return false
    // 2.判断node节点的value和传入的value的大小
    if (node.value > value) {
      return this.searchNodeValue(node.left, value)
    } else if (node.value < value) {
      return this.searchNodeValue(node.right, value)
    } else {
      return true
    }
  }
  /** 删除操作 */
  private getSuccessor(delNode: TreeNode<T>) {
    // 获取右子树
    let current = delNode.right
    let successor: TreeNode<T> | null = null
    while (current) {
      successor = current
      current = current.left
      if (current) {
        current.parent = successor
      }
    }
    // 拿到后继节点
    if (successor !== delNode.right) {
      successor!.parent!.left = successor!.right
      successor!.right = delNode.right
    }

    // 将删除节点的 left，赋值给后继节点的 left
    successor!.left = delNode.left
    return successor
  }
  remove(value: T): boolean {
    // 1.搜索当前是否有这个value
    const current = this.searchNode(value)
    if (!current) return false
    // 2.获取到三个东西：当前节点/父节点是否属于父节点的左子节点还是右子节点
    let replaceNode: TreeNode<T> | null = null
    if (current.left === null && current.right === null) {
      // 2.1.如果删除的是叶子节点
      replaceNode = null
    } else if (current.right === null) {
      // 2.2.只有一个子节点，只有左子节点
      replaceNode = current.left
    } else if (current.left === null) {
      // 2.3.只有一个子节点，只有右子节点
      replaceNode = current.right
    } else {
      // 2.4.两个子节点
      const successor = this.getSuccessor(current)
      replaceNode = successor
    }
    if (current === this.root) {
      this.root = replaceNode
    } else if (current.isLeft) {
      current.parent!.left = replaceNode
    } else {
      current.parent!.right = replaceNode
    }
    return true
  }
}
```

## 平衡树

### 二叉搜索树缺陷

二叉搜索树作为数据存储的结构有重要的优势

- 可以快速地找到给定关键字的数据项，并且可以快速地插入和删除数据项

但是，二叉搜索树有一个很麻烦的问题：

- 如果插入的数据是有序的数据，比如下面的情况
- 有一颗初始化为 9、8、12 的二叉树
- 插入下面的数据：7、6、5、4、3

非平衡树

- 比较好的二叉搜索树数据应该是 **左右分布均匀** 的
- 但是插入 **连续数据** 后，分布的不均匀，称这种树为非平衡树
- 对于一颗平衡二叉树来说，插入/查找等操作的效率是 O(logN)
- 对于一颗非平衡二叉树，相当于编写了一个链表，查找效率变成了 O(N)

![image-20230904171135081](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230904171135081.png)

### 平衡性

为了能以较快的时间 O(log N)来操作一棵树，我们需要保证树总是平衡的

- 至少大部分是平衡的，那么时间复杂度也是接近 O(logN) 的
- 也就是说树中 **每个节点左边的子孙节点的个数**，应该尽可能的等于 **右边的子孙节点的个数**

AVL 树

- AVL 树是最早的一种平衡树，它有些办法保证树的平衡（每个节点存储了一个额外的数据）
- 因为 AVL 树是平衡的，所以时间复杂度也是 O(logN)
- 但是，每次插入/删除操作相对于红黑树效率都不高，所以整体效率不如红黑树

红黑树

- 红黑树也通过一些特性来保持树的平衡
- 因为是平衡树，所以时间复杂度也是 O(logN)
- 另外插入/删除等操作，红黑树的性能要优于 AVL 树，所以现在平衡树的应用基本都是红黑树