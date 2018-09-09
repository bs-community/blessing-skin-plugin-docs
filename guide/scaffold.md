---
title: 快速创建插件
---

# {{ $page.title }}

考虑到每次创建一个新的插件都需要进行一些如编写 `package.json` 这样的重复性机械劳动，以及一些新手可能对编写插件的 workflow 不太熟悉，我们创建了 [`generator-bs-plugin`](https://github.com/bs-community/generator-bs-plugin)。

## 介绍

这是一个用于快速创建一个新插件的脚手架。它实际上是一个 Yeoman Generator。使用此脚手架的时候，您只需要根据您的需要和目的，回答脚手架向您提出的问题，即可生成一个能运行的插件。

## 特性

- 由于此脚手架会默认帮您安装 Parcel 和 ESLint，因此您可以享受现代化的前端工作流程。新的 ES 特性会被自动编译到 ES5 而不需要任何配置（甚至不需要 `.babelrc`）。同时默认配置了 ESLint 内部的推荐配置，可以帮您在构建前发现潜在的 JavaScript 错误。
- 默认带有可用的路由、控制器以及与 Blessing Skin 风格一致的页面
- 您可以通过简单的命令在现有的插件（前提是该插件必须由此脚手架创建）继续添加路由、控制器或侧栏菜单项

## 安装

此脚手架需要 Node.js，如果您还没有安装 Node.js，请访问 [Node.js 官网](https://nodejs.org) 并下载或使用阿里的镜像以获得更快的下载速度。推荐使用 LTS 版本的 Node.js。

之后，如果您使用 Yarn，那么请在终端中运行：

```bash
$ yarn global add yo generator-bs-plugin
```

 如果没有 Yarn，则运行：

```bash
$ npm i -g yo generator-bs-plugin
```

## 使用

### 新建一个插件

执行：

```bash
$ yo bs-plugin
```

接下来根据您的需要回答问题即可。

### 编写代码

您可以在 `assets/src/index.js` 文件中编写 JavaScript 代码，支持 ES6+ 特性。

还可以在 `assets/src/index.css` 中编写 CSS 代码。

默认已生成好一个控制器和视图，您可以根据需要进行修改。

`bootstrap.php` 中已定义好一条默认的路由，您可以根据需要修改其路径，或修改中间件。

### 向已有插件添加控制器

执行：

```bash
$ yo bs-plugin:controller <控制器名称>
```

例如执行 `yo bs-plugin:controller NewController`，就会向 `src` 目录中添加 `NewController.php`。

**注意必须保证是向已有的插件添加控制器，因为要获取命名空间。**

### 向已有插件添加路由

执行：

```bash
$ yo bs-plugin:route
```

接下来根据您的需要回答问题即可。

**注意**

- 只能向现有的插件添加新的路由
- `src/routes.php` 必须存在且大致符合以下格式

```php
use App\Services\Hook;

Hook::addRoute(function ($router) {

});
```

### 向已有插件添加菜单项

执行：

```bash
$ yo bs-plugin:menu
```

接下来根据您的需要回答问题即可。

**注意只能向现有的插件添加新的菜单项。**

## 高级

*普通开发者可以跳过此部分。*

### `package.json` 中定义的依赖

- [parcel-bundler](https://github.com/parcel-bundler/parcel) - 零配置的前端打包工具
- [eslint](https://github.com/eslint/eslint) - JavaScript 代码检查
- [eslint-formatter-beauty](https://github.com/g-plane/methane/tree/master/packages/eslint-formatter-beauty) - 使 ESLint 输出漂亮的结果信息

### ESLint

默认使用了 `eslint:recommended` 配置，您可以根据需要进行覆盖该配置的规则配置，或者使用另外的配置如 `eslint-config-standard`。

### npm scripts

- `dev` - 构建您的 JavaScript 代码，同时监视您的改动并自动增量构建
- `build` - 构建并压缩您的 JavaScript 代码，此 npm script 一般是准备向生产环境发布前才执行
- `test` - 运行 ESLint 来检查您的 JavaScript 代码

## FAQ

### `bootstrap.php` 中有两行 `require`，有什么作用？可以删除吗？

此脚手架默认生成的插件是将路由定义和菜单项定义放在不同的文件里，而这两行 `require` 正是引入这些文件。除非您知道您在做什么，否则不建议删除这两行。

### 执行 `npm run build` 或 `yarn build` 后 `assets` 目录下多了个 `dist` 目录，这是什么？

这是 parcel 构建您的 JavaScript 和 CSS 文件之后生成的，请不要删除，否则您的页面将无法加载它们。

### 执行 `yo bs-plugin:route` 之后，`src/routes.php` 文件跟之前比变得奇怪？

这是因为 `src/routes.php` 是根据 AST 生成的，不是进行简单的文本修改，因此在执行 `yo bs-plugin:route` 之后，代码风格会被改变，注释也有可能被删除。