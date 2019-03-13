---
title: 迁移指南
---

# {{ $page.title }}

本节内容将指引您如何将插件从旧版本的 Blessing Skin 迁移到新的 Blessing Skin 中。

## 从 3.5.0 迁移到 4.0.0

### 底层升级

Blessing Skin v4 中，Laravel 框架的版本已升级到 5.8，同时 PHP 需要 7.1.8 或更高版本。请您确保您的插件代码与 PHP 7.1.8+ 和 Laravel 5.8 兼容。

### 用户认证

Blessing Skin v4 重构了用户认证系统，使用了 Laravel 自带的认证功能。具体用法详见 [用户认证](auth.md) 一节。这里简单展示基本用法：

```php
auth()->id();  // 获取当前用户的 UID

auth()->user();  // 获取当前用户的模型实例

auth()->check();  // 检查用户是否已登录，不过您应该考虑使用 `auth` 中间件来完成这个工作
```

### 前端浏览器兼容性

不再支持 IE，因此您可以放心使用 ES 2015 的特性，但对于 ES 2016 及更新的特性（如比较常见的 ES 2017 中的 `async/await` 函数），仍然建议使用 Babel 进行转码。

### Font Awesome

Font Awesome 已经升级到 v5，具体变化请阅读 Font Awesome 的文档。

### `Utils` 类

`App\Services\Utils` 类已被彻底移除，取而代之的是 [辅助函数](helpers.md)。

下面是原 `Utils` 类的部分方法在辅助函数中对应的名称：

| `Utils` 类中的方法名 | 辅助函数中的函数名  |
| :------------------: | :-----------------: |
|     getClientIp      |    get_client_ip    |
|   isRequestSecure    |  is_request_secure  |
|   getTimeFormatted   | get_datetime_string |
|  getStringReplaced   | get_string_replaced |

### 前端函数

由于 4.0.0 使用 webpack 进行前端构建，因此原来在 3.5.0 中大部分全局 JavaScript 函数不再可用。

#### `trans` 函数

`trans` 函数用于前端多语言，它仍然可用。

#### SweetAlert2 库的 `swal` 函数和 toastr 库的 `toastr` 函数以及 jQuery 的 $

这三个都全局可用。

#### `showModal` 和 `showMsg` 函数

这两个函数已被移至 `blessing.notify` 对象中，功能保持不变。

#### `fetch` 函数

从 4.0.0 开始 Blessing Skin 使用浏览器原生的 Fetch API 即浏览器原生的 `fetch` 函数，而 3.5.0 中的 `fetch` 是 Blessing Skin 用 `$.ajax` 覆盖过，它不是真正的 Fetch API。

如果您在插件使用了这个假的 `fetch` ，请参见 [前端网络请求](fetch.md#从-v3-迁移到-v4) 来了解如何进行迁移。另外，如果您的插件曾有手动覆盖过 `fetch` 函数的行为，请修改这部分代码！（否则会影响 Blessing Skin 本身的工作）

#### `showAjaxError` 函数

这个函数仅在 Blessing Skin 内部使用，不再对外暴露，因为您不再需要由您手动捕捉这些错误。

### DOM 修改

4.0.0 在不少页面使用了 Vue.js 来渲染页面。如果您的插件需要修改 DOM，那么您应该使用 `blessing.event.on` 来监听 `mounted` 事件，在事件被触发后再去修改 DOM。但要注意的是，请不要修改由 Vue.js 管理和控制的 DOM 元素（但可以读取），否则有可能影响 Blessing Skin 的运行。

没有使用 Vue.js 的页面不受影响，而且 `mounted` 事件也不会被触发。

关于 `mounted` 事件请阅读 [这里](frontend-event.md#mounted)。

### 前端多语言

现在所有的多语言文本都被存储在 `blessing.i18n` 下。对于插件的多语言，只需要在 `blessing.i18n` 对象下创建一个属性，**不需要指明语种**。像这样：

```javascript
blessing.i18n.configGenerator = {
  key1: 'text1'
}
```

使用时，只需要像以前那样调用全局可用的 `trans` 函数：

```javascript
trans('configGenerator.key1.text1')
```

### `User` 模型

`User` 模型实例上的 `changePasswd` 方法已被重命名为 `changePassword`，功能保持不变。

`User` 模型上的静态方法 `register` 已被移除。

`User` 模型实例上的 `getToken` 方法已被移除，因为认证系统已被重构，这个方法已经没有意义。

### `Player` 模型

由于从 4.0.0 开始，角色不再拥有「模型」的概念，即角色设置的材质是怎样的模型，JSON API 会自动正确设置模型。

因此，`Player` 模型上的 `preference`、`tid_steve` 和 `tid_alex` 字段均已被移除，取而代之，请使用新的 `tid_skin` 字段。

另外，`player_name` 字段已更名为 `name`。

### `Texture` 模型

`Texture` 模型实例上的 `setPrivacy` 已被移除，请直接更新 `$texture->public` 的值并 `$texture->save()`。

### 中间件

`admin` 中间件现在不会先运行 `CheckAuthenticated` 中间件再做权限检查，即 `admin` 中间件直接获取 `Auth::user()`。这是安全的，不会因为用户未登录而报错，前提是您必需使用 `auth` 中间件。

### 辅助函数

- 辅助函数 `get_db_type` 已被重命名为 `humanize_db_type`，功能保持不变。
- 辅助函数 `runtime_check` 已被移除，通常这不会影响插件，因为插件不应该使用这个函数。
- 辅助函数 `die_with_utf8_encoding` 已被移除，建议使用 `throw new PrettyPageException` 以获取更友好的报错界面。
- 辅助函数 `bs_announcement` 已被移除，如果有需要，请使用：`app('parsedown')->text(option_localized('announcement'));`。
- 辅助函数 `can_moderate_texture` 已被移除。
- 辅助函数 `menv` 已被移除，请使用由 Laravel 提供的全局辅助函数 `env`。

### Composer 依赖

移除了 `Datatables` 扩展包（即 `printempw/laravel-datatables-lite`）。如果您的插件依赖于这个扩展包，请在您的插件中手动安装这个依赖，Blessing Skin 会加载它。

### 事件

#### 新增

新增了 `ClosetWillBeFiltered` 事件和 `ClosetWasFiltered` 事件。

#### 更改

`EncryptUserPassword` 事件中的 `rawPasswd` 属性现已更名为 `rawPassword`，类型保持不变。

## 从 3.4.0 迁移到 3.5.0

### Composer

Blessing Skin 现在支持插件使用 Composer 安装依赖，您只需要在发布插件时把 `vendor` 目录与插件一起打包发布。

### 明确 Blessing Skin 的版本

您需要在 `package.json` 中添加一个 `require` 字段用于指定插件的依赖。建议您在该字段中明确插件所支持的 Blessing Skin 的版本（具体方法见 [这里](dependency.md#明确-blessing-skin-的版本)）。如果不指明 Blessing Skin 的版本，用户在启用您的插件时会收到一个「依赖不明确」的警告，虽然这不影响插件的运行，但这对用户不友好。

### `Utils` 类废弃

`App\Services\Utils` 类已被废弃，并将在下个版本中被彻底移除。而在 3.5.0 中，`Utils` 类中的部分方法已被移除，剩余可用方法见 [app/Services/Utils.php 文件](https://github.com/printempw/blessing-skin-server/blob/v3.5.0/app/Services/Utils.php)。
