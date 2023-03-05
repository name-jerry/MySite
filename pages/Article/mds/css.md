# css

css笔记

## scss
- 主功能 嵌套,&父类,变量$,混入@mixin name{},模块

引入模块
```powershell
npm  install sass -D
```
- @mixin 混入定义时@mixin name(prop:default){@content},使用时@include name($prop);

- @content 为@include花括号的出口
<details>
<summary>案列代码</summary>

```scss
@mixin phone {
  @media (max-width: 500px) {
    @content;
  }
}
@mixin ipad {
  @media (min-width: 501px) and (max-width: 1024px) {
    @content;
  }
}
@mixin pc {
  @media (min-width: 1025px) {
    @content;
  }
}
body {
  @include phone {
    background: green;
  }
  @include ipad {
    background: red;
  }
  @include pc {
    background: blue;
  }
}
```
</details>

