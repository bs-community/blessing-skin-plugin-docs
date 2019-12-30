# 迁移指南

本节内容将指引您如何将插件从旧版本的 Blessing Skin 迁移到新的 Blessing Skin 中。

## 从 4.3.x 或 4.4.0 迁移到 5.0.0

### 版本更新

PHP 版本要求已提升到 7.2.0，同时 Laravel 已升级到 6.x。

另外 AdminLTE 升级到 v3，而 AdminLTE 底层所使用的 Bootstrap 也因此升级到 v4。

### `User` 模型

该模型中的以下实例方法均已被移除：

- `setScore` （请手动更新用户的积分并调用 `save` 方法）
- `getStorageUsed`
- `sign`
- `getSignRemainingTime`
- `canSign`

原静态方法 `getEncryptedPwdFromEvent` 现改为实例方法，同时方法签名改为只有一个参数，即 `$raw`。

### `Player` 模型

在 BS v4 中被废弃的 `player_name` 属性现已被移除。

`Player` 模型实例上的 `getJsonProfile`、`generateJsonProfile`、`getTexture` 已被移除。

###  类导入

以下用法已被移除。按理来说影响应该不大，因为文档从来没提到过此类用法。

```php
use Arr;

use Str;

use Minecraft;
```

改为以下用法：

```php
use Illuminate\Support\Arr;

use Illuminate\Support\Str;

use App\Services\Minecraft;
```

### `bootstrap.php`

您现在可以直接在 `bootstrap.php` 定义的闭包中通过 `$plugin` 参数获取当前插件的实例：

```php
return function ($plugin) {
    // $plugin 就是这个插件的实例。

    // 可以像下面这样获取前端资源 URL：
    $plugin->assets('something.css');
};
```

另外，Blessing Skin 现在会捕捉 `bootstrap.php` 中发生的异常（不包括在其中定义的路由或监听的事件内发生异常）。
如果在执行 `bootstrap.php` 中的代码时发生异常，Blessing Skin 会在管理员访问站点时发出一条提示。

如果不希望异常被捕捉，可以在「服务提供者」中执行代码，服务提供者中出现的异常不会捕捉。

### 钩子

现在 `Hook::sendNotification` 函数的第一个参数 `$users` 可接受单个用户，不再限制为数组。

由于 Laravel 5.4 的一项更新，`addScriptFileToPage` 和 `addStyleFileToPage` 不再支持指定优先级（即第三个参数）。

### 声明冲突

这是一个新增的特性，详见 [此处](conflicts.md)。

### 自动加载服务提供者

这是一个新增的特性，详见 [此处](providers.md)。

### `Response` 宏

`Response` 上的 `png` 宏和 `jsonProfile` 宏均已被移除。

### 辅助函数

以下辅助函数已被移除：

- `format_http_date` 替代方案：调用 `Carbon` 实例上的 `toRfc7231String` 方法
- `nl2p` 替代方案：无
- ` get_client_ip` 替代方案：可以考虑这个库：https://github.com/Vectorface/whip
- ` get_string_replaced` 替代方案：无

### 配置页面

现在可以通过在 `package.json` 中 `enchants` 字段下的 `config` 字段来指定配置页面。它比根 `config` 具有更高的优先级。具体可阅读 [插件信息定义](information.md) 中的相关介绍。

### `blessing` 全局变量

`notify.showModal` 的用法与以前完全不同。具体可参考 [这里](https://github.com/bs-community/blessing-skin-server/blob/dev/resources/assets/src/scripts/modal.ts)。

### 事件

- `GetPlayerJson` 事件已被移除

### 表单

`OptionForm` 上新增一个新的实例方法 `addAlert`。它的用法与 `addMessage` 类似。

### 其它

Parsedown 已从服务容器中被移除。也就是说，`app('parsedown')` 不再可用，需要您手动构造 `Parsedown` 这个类。

##  从 4.2.0 迁移到 4.3.0

### 钩子

- `addMenuItem` 函数现支持新的类型 `explore`，该菜单位于「用户中心」下的「浏览」菜单。另外，这个函数在第三个参数中还可以通过指定 `new-tab` 为 `true` 以表示在浏览器新标签页中打开这个链接。

- 增加新的 [`addUserBadge`](https://bs-plugin.netlify.com/guide/bootstrap.html#%E6%98%BE%E7%A4%BA%E7%94%A8%E6%88%B7-badge) 方法。

- 增加新的 [`sendNotification`](https://bs-plugin.netlify.com/guide/bootstrap.html#%E5%8F%91%E9%80%81%E9%80%9A%E7%9F%A5) 方法。

- 增加新的 [`pushMiddleware`](https://bs-plugin.netlify.com/guide/bootstrap.html#%E6%B3%A8%E5%86%8C%E4%B8%AD%E9%97%B4%E4%BB%B6) 方法。

## 从 4.1.0 迁移到 4.2.0

### 事件（后端）

- 新添加了一个事件 `TextureDeleting`。

## 从 4.0.0 迁移到 4.1.0

### `json` 辅助函数（影响度：高）

辅助函数 `json` 的行为有所变动。`json` 有三种使用方式，分别为传入一个参数、两个参数和三个参数。目前，传入一个参数时的行为未更改。

在之前，如果传入两个参数，返回的响应会是这样：

```json
{
  "errno": 0,
  "msg": ""
}
```

现在已更改为：

```json
{
  "code": 0,
  "message": ""
}
```

字段的含义相同。因此请您根据需要更改前端的代码。

在之前，如果传入三个参数，如：

```php
json('text', 0, ['abc' => 123]);
```

返回的响应会是这样：

```json
{
  "errno": 0,
  "msg": "text",
  "abc": 123
}
```

在 4.1.0 中会是：

```json
{
  "code": 0,
  "message": "text",
  "data": {
    "abc": 123
  }
}
```

请您根据需要更改前端的代码。

### 事件（后端）

- 新添加了一个事件 `PlayerRetrieved`。

### 事件（前端）

- 新添加了一个事件 `i18nLoaded`。

## 从 3.5.0 迁移到 4.0.0

### 底层升级（影响度：高）

Blessing Skin v4 中，Laravel 框架的版本已升级到 5.8，同时 PHP 需要 7.1.8 或更高版本。请您确保您的插件代码与 PHP 7.1.8+ 和 Laravel 5.8 兼容。

### 用户认证（影响度：高）

Blessing Skin v4 重构了用户认证系统，使用了 Laravel 自带的认证功能。具体用法详见 [用户认证](auth.md) 一节。这里简单展示基本用法：

```php
auth()->id();  // 获取当前用户的 UID

auth()->user();  // 获取当前用户的模型实例

auth()->check();  // 检查用户是否已登录，不过您应该考虑使用 `auth` 中间件来完成这个工作
```

### 前端浏览器兼容性（影响度：低）

不再支持 IE，因此您可以放心使用 ES 2015 的特性，但对于 ES 2016 及更新的特性（如比较常见的 ES 2017 中的 `async/await` 函数），仍然建议使用 Babel 进行转码。

### Font Awesome（影响度：中）

Font Awesome 已经升级到 v5，具体变化请阅读 Font Awesome 的文档。

### `Utils` 类（影响度：高）

`App\Services\Utils` 类已被彻底移除，取而代之的是 [辅助函数](helpers.md)。

下面是原 `Utils` 类的部分方法在辅助函数中对应的名称：

| `Utils` 类中的方法名 | 辅助函数中的函数名  |
| :------------------: | :-----------------: |
|     getClientIp      |    get_client_ip    |
|   isRequestSecure    |  is_request_secure  |
|   getTimeFormatted   | get_datetime_string |
|  getStringReplaced   | get_string_replaced |

### 视图文件（影响度：中）

不再支持 `.tpl` 的后缀，请使用 `.blade.php`。

### 前端函数（影响度：高）

由于 4.0.0 使用 webpack 进行前端构建，因此原来在 3.5.0 中大部分全局 JavaScript 函数不再可用。

#### `trans` 函数

`trans` 函数用于前端多语言，它仍然可用。

#### jQuery

jQuery 全局可用。

#### `showModal` 和 `showMsg` 函数

`showModal` 已被移至 `blessing.notify` 对象中，功能保持不变。

`showMsg` 则已被移除。

`swal` 和 `toastr` 已被移除。尽管在 v3 的时候可用，但我们从未把这当作特性。

#### `fetch` 函数

从 4.0.0 开始 Blessing Skin 使用浏览器原生的 Fetch API 即浏览器原生的 `fetch` 函数，而 3.5.0 中的 `fetch` 是 Blessing Skin 用 `$.ajax` 覆盖过，它不是真正的 Fetch API。

如果您在插件使用了这个假的 `fetch` ，请参见 [前端网络请求](fetch.md#从-v3-迁移到-v4) 来了解如何进行迁移。另外，如果您的插件曾有手动覆盖过 `fetch` 函数的行为，请修改这部分代码！（否则会影响 Blessing Skin 本身的工作）

#### `showAjaxError` 函数

这个函数仅在 Blessing Skin 内部使用，不再对外暴露，因为您不再需要由您手动捕捉这些错误。

### DOM 修改（影响度：高）

4.0.0 在不少页面使用了 Vue.js 来渲染页面。如果您的插件需要修改 DOM，那么您应该使用 `blessing.event.on` 来监听 `mounted` 事件，在事件被触发后再去修改 DOM。但要注意的是，请不要修改由 Vue.js 管理和控制的 DOM 元素（但可以读取），否则有可能影响 Blessing Skin 的运行。

没有使用 Vue.js 的页面不受影响，而且 `mounted` 事件也不会被触发。

关于 `mounted` 事件请阅读 [这里](frontend-event.md#mounted)。

### 前端多语言（影响度：中）

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

### `User` 模型（影响度：中）

`User` 模型实例上的 `changePasswd` 方法已被重命名为 `changePassword`，功能保持不变。

`User` 模型上的静态方法 `register` 已被移除。

`User` 模型实例上的 `getToken` 方法已被移除，因为认证系统已被重构，这个方法已经没有意义。

`User` 模型实例上的 `setEmail` 方法已被移除。

`User` 模型实例上的 `getNickName` 方法已被移除。

`User` 模型实例上的 `setNickName` 方法已被移除。

`User` 模型实例上的 `getScore` 方法已被移除。

`User` 模型实例上的 `getAvatarId` 方法已被移除。

`User` 模型实例上的 `setAvatar` 方法已被移除。

`User` 模型实例上的 `getLastSignTime` 方法已被移除。

`User` 模型实例上的 `getPermission` 方法已被移除。

`User` 模型实例上的 `setPermission` 方法已被移除。

### `Player` 模型（影响度：高）

由于从 4.0.0 开始，角色不再拥有「模型」的概念，即角色设置的材质是怎样的模型，JSON API 会自动正确设置模型。

因此，`Player` 模型上的 `preference`、`tid_steve` 和 `tid_alex` 字段均已被移除，取而代之，请使用新的 `tid_skin` 字段。

另外，`player_name` 字段已更名为 `name`。

`Player` 模型实例上的 `rename` 方法已被移除。

`Player` 模型实例上的 `setOwner` 方法已被移除。

`Player` 模型实例上的 `clearTexture` 方法已被移除。

`Player` 模型实例上的 `setTexture` 方法已被移除。

`Player` 模型实例上的 `checkForInvalidTextures` 方法已被移除。

### `Texture` 模型（影响度：中）

`Texture` 模型实例上的 `setPrivacy` 已被移除，请直接更新 `$texture->public` 的值并 `$texture->save()`。

`likes` 字段现在是只读的。

### `Closet` 模型（影响度：高）

`Closet` 模型已被移除，请不要再使用 `App\Models\Closet`。

如果您需要访问某个用户的衣柜，您可以像下面这样调用：

```php
$user->closet()->get();
```

像上面的结果，可以获取衣柜中的所有物品，返回一个 Laravel Collection，其中每个元素是一个 `Texture` 模型实例。

另外，如果需要获取物品的名称（不是材质在皮肤库中的名称），则可以：

```php
$texture->pivot->item_name;
```

Blessing Skin 内部基于 Laravel 的模型多对多关联来实现衣柜功能，更多信息可阅读 [Laravel 文档](https://learnku.com/docs/laravel/5.8/eloquent-relationships/2295)。

### 中间件（影响度：低）

`admin` 中间件现在不会先运行 `CheckAuthenticated` 中间件再做权限检查，即 `admin` 中间件直接获取 `Auth::user()`。这是安全的，不会因为用户未登录而报错，前提是您必需使用 `auth` 中间件。

### 辅助函数（影响度：中）

- 辅助函数 `get_db_type` 已被重命名为 `humanize_db_type`，功能保持不变。
- 辅助函数 `runtime_check` 已被移除，通常这不会影响插件，因为插件不应该使用这个函数。
- 辅助函数 `die_with_utf8_encoding` 已被移除，建议使用 `throw new PrettyPageException` 以获取更友好的报错界面。
- 辅助函数 `bs_announcement` 已被移除，如果有需要，请使用：`app('parsedown')->text(option_localized('announcement'));`。
- 辅助函数 `can_moderate_texture` 已被移除。
- 辅助函数 `menv` 已被移除，请使用由 Laravel 提供的全局辅助函数 `env`。
- 辅助函数 `assets` 已被移除，通常这不会影响插件，因为插件不应该使用这个函数。
- 辅助函数 `get_current_url` 已被移除。

### Composer 依赖（影响度：低）

移除了 `Datatables` 扩展包（即 `printempw/laravel-datatables-lite`）。如果您的插件依赖于这个扩展包，请在您的插件中手动安装这个依赖，Blessing Skin 会加载它。

### 事件（影响度：低）

#### 更改

`EncryptUserPassword` 事件中的 `rawPasswd` 属性现已更名为 `raw`，类型保持不变。

### 表单验证规则（影响度：低）

在 3.5.0 中被废弃的表单验证规则现已被移除，它们是：

- `playername`

- `nickname`

- `pname_chinese`

## 从 3.4.0 迁移到 3.5.0

### Composer

Blessing Skin 现在支持插件使用 Composer 安装依赖，您只需要在发布插件时把 `vendor` 目录与插件一起打包发布。

### 明确 Blessing Skin 的版本

您需要在 `package.json` 中添加一个 `require` 字段用于指定插件的依赖。建议您在该字段中明确插件所支持的 Blessing Skin 的版本（具体方法见 [这里](dependency.md#明确-blessing-skin-的版本)）。如果不指明 Blessing Skin 的版本，用户在启用您的插件时会收到一个「依赖不明确」的警告，虽然这不影响插件的运行，但这对用户不友好。

### `Utils` 类废弃

`App\Services\Utils` 类已被废弃，并将在下个版本中被彻底移除。而在 3.5.0 中，`Utils` 类中的部分方法已被移除，剩余可用方法见 [app/Services/Utils.php 文件](https://github.com/printempw/blessing-skin-server/blob/v3.5.0/app/Services/Utils.php)。