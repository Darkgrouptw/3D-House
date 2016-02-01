# 修改紀錄

## 2016

### 02.01
* 改用新的XML結構語法
* 新增例子: XML=wall/no_window, wall/triangle
* 資料夾命名更動
* Node 取得方式： 

``` js
var n = scene.getNode('wall');
``` 

* 提供transform與property的修改

``` js
var n = scene.getNode('wall');
n.setWidth(10);     // setter
n.getWidht();       // getter 
n.setTranslate(2);  // for translate
```

### 01.31
* 新增幾個example

