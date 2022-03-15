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