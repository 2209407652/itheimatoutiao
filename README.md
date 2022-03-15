# toutiao

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

**修改过后的文件加入暂存区，并进行本地的commit提交**
`git add .`
`git commit -m "你的描述文字"`

**将本地的子分支推送到Gitee仓库中**
`git push -u origin 子分支名称`

**将本地的子分支合并到本地的主分支，并推送主分支到Gitee仓库**
`git checkout master`
`git merge 子分支名称`
`git push`

**删除本地的子分支**
`git branch -d 子分支名称`

**基于主分支，新键子分支**
`git checkout -b 子分支名称`

**查看本地分支**
`git branch`
**查看远程分支**
`git branch -a`
**切回主分支**
`git checkout master`

### Home 主页文章列表
**Home组件**
导航 -- 根据用户来决定导航信息
van-tab 组件下用来展示文章列表 将导航信息 id 传给 ArtList
ArtList 根据传递过来的 id 请求文章信息列表
通过遍历循环把文章信息列表每一项给 ArtItem 然后 ArtItem 渲染数据

**时间处理模块 - dayjs**
`npm install dayjs -S`
可以计算相对时间

**防抖和节流**
节流：单位时间内，重复的操作只会触发 1 次
防抖：频繁触发某个操作时，仅触发最后 1 次，回城多次时只会回一次计时

### Search 搜索
**搜索关键词高亮处理**
1.通过 replace 方法对搜索结果的内容进行替换，从而关键词高亮
2.通过 RegExp(this.kw, 'ig') 动态创建正则表达式
``` js
        // 根据用户关键词动态创建正则表达式
      const reg = RegExp(this.kw, 'ig')
      // 循环数据，调用字符串的 replace 方法进行关键字的高亮处理
      arr.forEach((item, index) => {
        arr[index] = item.replace(reg, val => {
          return `<span style="color: red; font-weight: bold;">${val}</span>`
        })
      }) 
```

### 文章详情和评论
**平滑滚动到评论列表区域**
`npm install popmotion@9.3.5 -S`
```js
    // 滚动到评论的列表区域
    scrollToCmtList() {
      // 1. 当前滚动条的位置
      const now = window.scrollY;
      // 2. 目标位置（文章信息区域的高度）
      const dist = document.querySelector(".article-container").offsetHeight;

      // 3. 实现滚动动画
      animate({
        from: now, // 当前的位置
        to: dist, // 目标位置
        onUpdate: (latest) => window.scrollTo(0, latest),
      });
    },
```

### 修改用户信息
**实现点击头像上传**
通过 v-show 来隐藏上传头像按钮
给上传头像绑定 ref="fileRef"
然后给头像绑定点击事件，通过触发$refs.fileRef.click() 来实现功能

### 项目优化
```html
<template>
  <div>
    <!-- 路由占位符 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
```
为了防止文章详情页面也被缓存了，所以用 watch 来监听 id ，只要 id 变了就清空文章信息，并重新请求
为了防止搜索结果页也缓存了，需要监听 kw 关键字来动态请求结果
**防止 User 页面被缓存不刷新**

```html
    <!-- Main组件 keep-alive -->
    <!-- 路由占位符 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
```
keep-alive 之后会有一个activated 和 deactivated生命周期函数
```js
// User 组件
/*   created() {
     this.initUserInfo();
    }, */
  // 该生命周期只有被 keep-alive 之后才有
  activated() {
    // 只要组件被激活了，就重新初始化用户的信息
    this.initUserInfo();
  },
```

**记录首页滚动位置**
声明 beforeRouteLeave 这个组件内的守卫，用来记录当前组件在纵向上滚动的距离
```js 
// 在路由中声明如下
{
  path: '',
  component: Home,
  name: 'home',
  meta: { isRecord: true, top: 0 }
}
// 在 home 组件中声明 beforeRouteLeave 组件守卫
  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY;
    next();
  },
// 在路由中声明全局后置钩子
// 全局后置钩子
router.afterEach((to, from) => {
  // 如果当前的路由的元信息中，isRecord 的值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      // 则把元信息中的 top 值设为滚动条纵向滚动的位置
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})
```
**highlight.js**
可实现对代码区域高亮显示