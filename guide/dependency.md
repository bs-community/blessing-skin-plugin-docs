---
title: 声明插件依赖
---

# {{ $page.title }}

::: warning

此特性需要 Blessing Skin v3.5.0 或更高版本

:::

[[toc]]

在开发的过程中，一个插件依赖于另一个插件是很常见的事；此外，您还可能希望插件对 Blessing Skin 的版本作出要求（例如您可能需要某个 Blessing Skin 版本才拥有的特性或功能）。

从 Blessing Skin v3.5.0 开始，Blessing Skin 的插件系统允许您在 `package.json` 中声明您的插件的依赖。

## 在哪里声明？

您只需在 `package.json` 中添加 `require` 字段，该字段的值是一个键值对。键为依赖的名称，值为版本。值得注意的是，声明依赖的版本时，可以使用语义化版本（Semantic Version），Blessing Skin 内部使用 `composer/semver` 对其进行解析。

## 明确 Blessing Skin 的版本

尽管这不是必须的，但我们还是建议您声明您要求 Blessing Skin 的版本，因为 Blessing Skin 在遇到没有明确声明 Blessing Skin 版本的插件，在启用插件时会提示一个警告，这对用户不友好。

插件系统是从 Blessing Skin v3.2.0 开始加入的，因此如果您的插件没有特别的版本要求，您可以填写 `^3.2.0`，`package.json`  例子如下：

```json
{
  "require": {
    "blessing-skin-server": "^3.2.0"
  }
}
```

但由于语义化版本的存在，如果填写 `^3.2.0`，Blessing Skin 会阻止您的插件在 Blessing Skin v4 及更高版本上运行。如果您的插件足够简单，可以直接填写 `*`：

```json
{
  "require": {
    "blessing-skin-server": "*"
  }
}
```

也可以填写 `^3.2.0 || ^4.0.0`。（但产生的作用与 `*` 不同）

## 声明对其它插件的依赖

声明对其它插件的依赖的方法与上面类似，只不过您应该指定具体的插件 `name` 值（切记是 `name` 值而不是插件的名称）。

例如，我们假设您在编写 `a` 插件，而 `a` 插件依赖于 `b` 插件，版本为 `^1.0.0`，则可以像下面这样写：

```json
{
  "require": {
    "b": "^1.0.0"
  }
}
```

如此声明之后，如果用户在启用 `a` 插件时，`b` 插件没有被启用或版本不符合要求，就不能启用 `a` 插件。
