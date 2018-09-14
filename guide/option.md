---
title: 持久化配置
---

# {{ $page.title }}

您的插件可能需要存储一些配置信息。实际上 Blessing Skin 本身也有很多配置信息和选项，它们都被保存在数据库中的 `options` 表。

不建议您直接通过读取该数据表中读取配置，而应该使用由 Blessing Skin 提供而且 Blessing Skin 内部也在使用 `Option` Facade 或 `option` 辅助函数。

## 应用

假设您的插件需要从外部 URL 获取信息，而这个 URL 可以被用户修改以便切换不同的来源。我们可以设置一个配置项，称为「data_source」，那么我们可以通过 `Option` Facade 或 `option` 辅助函数来获取或设置这个配置项。

在设置一个配置项的时候，如果这个配置项不存在，它将被自动添加，无需手动修改数据库。

## 使用 Facade

您可以使用 `Option` Facade 来操作您的配置项。

```php
use Option;

// 获取 `data_source` 的值
Option::get('data_source');

// 还可以允许返回默认值，如果该配置项不存在或值为空
Option::get('data_source', 'http://xxx/');

// 更新配置项
Option::set('data_source', 'http://xxx/');
```

## 使用辅助函数

辅助函数是全局可用的，而且使用前也不需要像使用 Facade 那样导入，因此使用起来更简单。

详细用法可阅读 [`option` 函数](helpers.md#option) 和 [`option_localized` 函数](helpers.md#option-localized)。
