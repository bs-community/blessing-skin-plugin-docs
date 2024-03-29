# 插件目录结构

## 总览

- [目录] assets
- [目录] lang
- [目录] src
- [目录] views
- [文件] bootstrap.php
- [文件] callbacks.php
- [文件] package.json

在上面列表中，除了 `bootstrap.php` 和 `package.json` 这两个是必须的，其它都是可选的。

## 含义与作用

### `assets` 目录

这个目录存放着一些如 `CSS`，`JavaScript` 和图片等的静态资源文件。`assets` 目录内的结构可随意。

### `lang` 目录

这个目录存放的是语言文件。如果您的插件是多语言的，那么请将语言文件放在这里。目前仅支持 简体中文 和 英语 两个语言，所以 `lang` 目录下应只存在 `en` 和 `zh_CN` 两个目录。（分别代表 英语 和 简体中文）

### `src` 目录

这里包含着插件的 PHP 代码。其内部的目录结构可随意，但注意 PHP 代码中的命名空间必须按照您所布置的目录结构进行安排。

### `views` 目录

这里包含着插件的视图文件。

### `bootstrap.php` 文件

可别把这个文件与 Twitter 前端框架 Bootstrap 联系在一起！它们之间没有任何关系。

这个文件是整个插件的入口文件，插件被加载时，这个文件会首先被加载。只要插件没有被禁用，这个文件就会被加载并执行。

### `callbacks.php` 文件

这个文件是处理当插件被启用、禁用和卸载时要执行的代码。

### `package.json` 文件

这个文件记录了插件的一些基本信息。
