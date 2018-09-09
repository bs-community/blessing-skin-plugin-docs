---
title: 使用 Composer
---

# {{ $page.title }}

::: warning

此特性需要 Blessing Skin v3.5.0 或更高版本

:::

有些时候，您的插件可能需要一些 PHP 库。通常的做法是使用 Composer 来安装这些依赖。

Composer 会把依赖下载并解压在工程目录的 `vendor` 目录下，而 Blessing Skin 会自动扫描并加载 `vendor` 目录，因此您不需要任何的配置，即可轻松享受包管理带来的便利。

## 使用

在您的插件目录下，执行 `composer` 来安装依赖，例如：

```sh
$ composer require vendor/package
```

尽管 Composer 将会生成 `composer.json` 和 `composer.lock` 文件，但 Blessing Skin 不会用到这些文件，也不影响 Blessing Skin 的工作。

接着在您的插件代码中正常地使用您刚刚安装的库即可。

**要注意的是，当您要打包您的插件以便发布或共享的时候，务必要将 `vendor` 目录打包进去，否则您的插件将不能正常运行。**
