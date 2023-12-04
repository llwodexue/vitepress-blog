# 手写Promie源码

## Promise 类基础逻辑

### 基础逻辑

1. `new Promise`：Promise 是一个类，在执行这个类的时候，需要传递一个执行器进去，执行器会立即执行

2. Promise 中有三种状态，分别为：成功（fulfilled）、失败（rejected）、等待（pending），一旦状态确定就不可更改

   **如果状态不是等待，需要阻止程序向下执行**

3. resolve 和 reject 函数是用来更改状态的

   **把 resolve 和 reject 定义为箭头函数是为了让函数内部的 this 指向，指向类的实例对象（Promise）**

4. then 方法内部做的事情就是判断状态，如果状态是成功，就调用成功的回调函数，如果状态是失败，就调用失败的回调函数。then 方法定义在原型对象上的

5. then 成功回调有一个参数，表示成功之后的值，then 失败回调有一个参数，表示失败的原因

```js
// 可复用且有提示
const PENDING = 'pending' // 等待
const FULFILLED = 'fulfilled' // 成功
const REJECTED = 'rejected' // 失败
class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
  }
  // promise 状态
  status = PENDING
  // 成功之后的值
  value = undefined
  // 失败之后的原因
  reason = undefined
  resolve = value => {
    // 如果状态不是等待，阻止程序向下执行
    if (this.status !== PENDING) return
    // 将状态更改为成功
    this.status = FULFILLED
    // 保存成功之后的值
    this.value = value
  }
  reject = reason => {
    // 如果状态不是等待，阻止程序向下执行
    if (this.status !== PENDING) return
    // 将状态更改为失败
    this.status = REJECTED
    // 保存失败之后的原因
    this.reason = reason
  }
  then(successCallback, failCallback) {
    // 判断状态
    if (this.status === FULFILLED) {
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      failCallback(this.reason)
    }
  }
}

module.exports = MyPromise
```

之后对其进行验证

```js
const MyPromise = require('./myPromise')

let promise = new MyPromise((resolve, reject) => {
  resolve('成功')
  reject('失败')
})
promise.then(
  value => {
    console.log(value)
  },
  reason => {
    console.log(reason)
  }
)
```

### 加入 then 方法和异步逻辑

**问题1：** 如果要给 resolve 或 reject 包裹一层 setTimeout，发现什么都没有输出

- 主线程是不会等待异步 setTimeout 执行完成的，then 会立即执行
- 由于当前 Promise 执行到 then 时状态为 **等待态**，而现在只判断成功与失败的状态，所以会什么都不输出

```js
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 2000)
})
promise.then(value => {
  console.log(value) // 没有输出
})
```

**问题2：** 当 then 方法被多次调用时，每一个 then 方法中传递的回调函数都是要执行的

- 同步：如果调用 then 方法时，已经知道 promise 状态为 **成功态或失败态**，就可以直接调用回调即可
- 异步：如果调用 then 方法时，promise 状态为 **等待态**，每一个 then 方法的回调函数都应该存储起来，当状态为成功或失败时，再依次调用回调函数

```js
let promise = new MyPromise((resolve, reject) => {
  resolve('成功')
})
promise.then(value => {
  console.log(value) // 成功
})
promise.then(value => {
  console.log(value) // 没有输出
})
```

接下来处理上面出现的两个问题

```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
  }
  status = PENDING
  value = undefined
  reason = undefined
  // 成功回调 undefined -> []
  successCallback = []
  // 失败回调 undefined -> []
  failCallback = []
  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    // 判断成功回调是否存在，如果存在调用
    // this.successCallback && this.successCallback(this.value)
    while (this.successCallback.length) this.successCallback.shift()(this.value)
  }
  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    // 判断失败回调是否存在，如果存在调用
    // this.failCallback && this.failCallback(this.value)
    while (this.failCallback.length) this.failCallback.shift()(this.reason)
  }
  then(successCallback, failCallback) {
    if (this.status === FULFILLED) {
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      failCallback(this.reason)
    } else {
      // 将成功回调和失败回调存储起来
      this.successCallback.push(successCallback)
      this.failCallback.push(failCallback)
    }
  }
}

module.exports = MyPromise
```

## 实现 then 链

### 链式调用

then 方法是可以被链式调用的，后面 then 方法的回调函数拿到上一个 then 方法的回调函数的返回值

```js
let promise = new MyPromise((resolve, reject) => {
  resolve('成功')
})
promise.then(value => {
  console.log(value) // 成功
  return 100
}).then(value => {
  console.log(value) // 没有输出
})
```

接下来需要实现如下需求

- 实现 then 方法链式调用（then 方法返回一个 promise）

- 如何把上一个 then 回调函数的返回值传递给下一个 then 方法的回调函数

  这里需要判断回调函数返回值是普通值还是 Promise 对象

  - 如果是普通值，直接调用 resolve
  - 如果是 promise 对象，查看 promise 对象返回的结果，根据结果决定调用 resolve 还是 reject

```js
class MyPromise {
  then(successCallback, failCallback) {
    // 返回一个新的 Promise
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        let x = successCallback(this.value)
        // 判断 x 的是普通值还是 promise 对象
        resolvePromise(x, resolve, reject)
      } else if (this.status === REJECTED) {
        failCallback(this.reason)
      } else {
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    })
    return promise2
  }
}

function resolvePromise(x, resolve, reject) {
  if (x instanceof MyPromise) {
    // promise 对象
    /* x.then(
      value => resolve(value),
      reason => reject(reason)
    ) */
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}
```

### 循环引用

如果在 p1 里返回 p1 这个 Promise，就会发生循环调用

```js
let promise = new MyPromise((resolve, reject) => {
  resolve('成功')
})
let p1 = promise.then(value => {
  console.log(value)
  return p1
})

p1.then(
  value => {
    console.log(value)
  },
  reason => {
    console.log(reason) // TypeError: Chaining cycle detected for promise #<Promise>
  }
)
```

**注意：**  举个例子 `var obj = { n: 10, x: obj.n *10 }`，因为 obj 还没有创建完，而在创建属性 x 时是获取不到 obj.n 的。因为全局作用于只声明了 obj，却没有赋值（`obj -> undefiend`），promise 也是有这样的情况的，我们可以使用异步任务，让其赋值完成

```js
class MyPromise {
  then(successCallback, failCallback) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 变为异步任务这样 promise2 就赋值完成了
        setTimeout(() => {
          let x = successCallback(this.value)
          resolvePromise(promise2, x, resolve, reject)
        }, 0)
      } else if (this.status === REJECTED) {
        failCallback(this.reason)
      } else {
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    })
    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
```

### 捕获错误

1. 当执行器（`executor`）中代码执行时发生错误，将 promise 状态改为失败态

2. 回调函数在执行时发生错误，这个错误要在下个 then 方法的回调函数中捕获到

   当代码为失败状态或等待态也需要用 `try...catch` 包裹

3. 当代码为等待态时，如果碰到异步，不能把回调函数直接 push 到数组里，这样没有办法对其进行处理，我们可以 push 一个函数进去，函数里面调用成功或失败回调

   这时就可以对进行异步和错误捕获处理了

```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    // 捕获执行器错误
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }
  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []
  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while (this.successCallback.length) this.successCallback.shift()()
  }
  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.failCallback.length) this.failCallback.shift()()
  }
  then(successCallback, failCallback) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          // 捕获回调函数发生的错误
          try {
            let x = successCallback(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        // push 函数进去，函数里面调用成功回调函数
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        // push 函数进去，函数里面调用失败回调函数
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}

module.exports = MyPromise
```

### then 方法参数变为可选

链式调用 then 时，即使不传递参数也会依次向后传递

```js
const promise = new MyPromise((resolve, reject) => {
  resolve(100)
})
promise
  .then()
  .then()
  .then(value => console.log(value)) // 100
```

其实就是判断 `successCallback` 与 `failCallback` 是否存在，如果不存在给它进行赋值

```js
class MyPromise {
  then(successCallback, failCallback) {
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback
      ? failCallback
      : reason => {
          throw reason
        }
  }
}

```

## 其他方法实现

### Promise.all

- all 方法是通过类直接调用，所以 all 方法是一个静态方法
- all 传入的必须是一个数组，如果数组中某一项不是 Promise 实例，需要把它转换为成功的 Promise 实例
- 之后每一项依次执行，只要有一项失败返回就是失败的，必须全部成功才是成功

```js
function p1() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}
function p2() {
  return new MyPromise((resolve, reject) => {
    resolve('p2')
  })
}

MyPromise.all(['a', 'b', p1(), p2(), 'c']).then(result => console.log(result)) // [ 'a', 'b', 'p1', 'p2', 'c' ]
```

注意：

- 返回结果的顺序跟传入的顺序一致（不能使用 push，因为不能确定谁先到，需要使用索引）
- for 循环执行就是一瞬间的，但是里面可能存在异步操作，需要等待所有都执行完，再执行 resolve 操作

```js
class MyPromise {
  static all(array) {
    let result = []
    let index = 0
    return new MyPromise((resolve, reject) => {
      function addData(key, value) {
        result[key] = value
        index++
        if (index === array.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < array.length; i++) {
        const current = array[i]
        if (current instanceof MyPromise) {
          // promise 对象
          current.then(
            value => addData(i, value),
            reason => reject(reason)
          )
        } else {
          // 普通值
          addData(i, array[i])
        }
      }
    })
  }
}
```

### Promise.resolve

```js
function p1() {
  return new MyPromise((resolve, reject) => {
    resolve('p1')
  })
}
Promise.resolve(10).then(value => console.log(value))
Promise.resolve(p1()).then(value => console.log(value))
```

- 如果参数是 Promise 实例，那么 `Promise.resolve` 将不做任何修改，原封不动地返回这个实例
- 有如果参数是普通值，就直接将值转换为成功的 Promise 实例

```js
class MyPromise {
  static resolve(value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
}
```

### finally

```js
function p1() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 2000)
  })
}
function p2() {
  return new MyPromise((resolve, reject) => {
    resolve('p2')
  })
}

p2()
  .finally(() => {
    console.log('finally')
    return p1()
  })
  .then(
    value => {
      console.log(value)
    },
    reason => {
      console.log(reason)
    }
  )
```

- 无论当前 Promise 最终状态是成功的还是失败的，finally 中的回调函数始终都会被执行一次
- 在 finally 方法后面链式调用 then 方法拿到当前这个 promise 最终返回的结果

```js
class MyPromise {
  finally(callback) {
    return this.then(
      value => {
        return MyPromise.resolve(callback()).then(() => value)
      },
      reason => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason()
        })
      }
    )
  }
}
```

### catch

- 处理当前 promise 为失败状态，内部调用的也是 then 方法（只注册失败回调）

```js
class MyPromise {
  catch(failCallback) {
    return this.then(undefined, failCallback)
  }
 }
```

## 完整版

```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }
  status = PENDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []
  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while (this.successCallback.length) this.successCallback.shift()()
  }
  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.failCallback.length) this.failCallback.shift()()
  }
  then(successCallback, failCallback) {
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback
      ? failCallback
      : reason => {
          throw reason
        }
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }
  finally(callback) {
    return this.then(
      value => {
        return MyPromise.resolve(callback()).then(() => value)
      },
      reason => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason()
        })
      }
    )
  }
  catch(failCallback) {
    return this.then(undefined, failCallback)
  }
  static all(array) {
    let result = []
    let index = 0
    return new MyPromise((resolve, reject) => {
      function addData(key, value) {
        result[key] = value
        index++
        if (index === array.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < array.length; i++) {
        const current = array[i]
        if (current instanceof MyPromise) {
          current.then(
            value => addData(i, value),
            reason => reject(reason)
          )
        } else {
          addData(i, array[i])
        }
      }
    })
  }
  static resolve(value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}

module.exports = MyPromise
```

