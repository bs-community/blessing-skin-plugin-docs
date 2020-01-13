---
title: 事件监听（后端）
---

# {{ $page.title }}

[[toc]]

## 事件系统

Laravel 本身带有一套事件系统，因此我们能够方便地实现事件监听来执行某些操作。

在插件的 `bootstrap.php` 中所返回的函数中，如果您要监听事件，您可以像这样写：

```php
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
  // ...
};
```

## 监听事件

以上面为例，`$events` 中的 `listen` 方法可以让您监听事件。`listen` 方法接收两个参数：第一个是您要监听的事件的类，第二个参数是事件触发后要执行的回调函数。

假设我们现在要监听 `RenderingFooter` 事件，以便我们往页面添加一些内容。过程如下：

首先要知道要监听的事件的类的所在位置。Blessing Skin 本身所有的事件都位于 `App\Events` 下，因此 `listen` 方法的第一个参数为 `App\Events\RenderingFooter::class`。如果您想要监听来自 Laravel 的事件，请查阅 Laravel 文档。

第二个参数是回调函数。对于用于监听事件的回调函数，都带有一个参数，这个参数是该事件的实例。在我们这个例子中，就是 `App\Events\RenderingFooter::class` 的实例。

完整的例子如下：

```php
$events->listen(App\Events\RenderingFooter::class, function ($event) {
  // $event-> ...
});
```

## 编写事件订阅者

除了像前文所述那样通过在 `bootstrap.php` 中监听事件，您还可以编写事件订阅者。事件订阅者是一个可以在自身内部订阅多个事件的类，即能够在单个类中定义多个事件处理器。

一个事件订阅者的类中必须存在 `subscribe` 方法，它用于将事件与监听器关联起来。

举个例子，我们要在一个事件订阅者中监听 `RenderingHeader` 事件和 `RenderingFooter` 事件，两个使用不同的监听器（即事件触发后执行的代码不相同）。那么我们可以在 `src` 目录中添加这样的类：

```php
class RenderSubscriber
{
  public function onRenderingHeader($event)
  {
    //
  }

  public function onRenderingFooter($event)
  {
    //
  }

  public function subscribe($events)
  {
    // 假设我们的插件的命名空间是 `Example`

    $events->listen(
      'App\Events\RenderingHeader',
      'Example\RenderSubscriber@onRenderingHeader'
    );

    $events->listen(
      'App\Events\RenderingFooter',
      'Example\RenderSubscriber@onRenderingFooter'
    );
  }
}
```

接下来要注册这个事件订阅者，在 `bootstrap.php` 中添加以下代码：

```php
$events->subscribe(Example\RenderSubscriber::class);
```

## 所有可用的事件

这里列出了 Blessing Skin 中所有定义了的事件。通常事件的实例上会带有一个或多个属性，代表事件触发时涉及的数据。因此，我们约定，我们使用三级标题表示事件的名称，用四级标题列出该事件实例上的属性。

### ConfigureAdminMenu

::: tip 触发时机

生成管理面板中的侧栏菜单之前。

:::

#### menu

类型：数组

含义：整个菜单列表

### ConfigureRoutes

::: tip 触发时机

生成 Laravel 路由之前。

:::

#### router

类型：`Illuminate\Routing\Router`

含义：Laravel 的路由对象，包含一系列可用的方法。

### ConfigureUserMenu

::: tip 触发时机

生成普通用户界面中的侧栏菜单之前。

:::

#### menu

类型：数组

含义：整个菜单列表

### HashingFile

::: tip 触发时机

计算用户上传的材质的 hash 值之前。

:::

#### file

类型：`Illuminate\Http\UploadedFile`

含义：用户上传的文件的实例，该实例来自 Laravel，包含一系列可用的方法。

### PlayerProfileUpdated

::: tip 触发时机

角色的信息更新之后。

:::

#### player

类型：`App\Models\Player`

含义：角色实例

### PlayerRetrieved

::: tip 触发时机

从数据库中读取角色信息。

:::

#### player

类型：`App\Models\Player`

含义：角色实例

### PlayerWasAdded

::: tip 触发时机

角色被添加之后。此时角色已被创建，您可以获取该角色的实例。

:::

#### player

类型：`App\Models\Player`

含义：新创建的角色的实例

### PlayerWasDeleted

::: tip 触发时机

角色被删除之后。此时角色已被删除，您不能获取该角色的实例。

:::

#### playerName

类型：字符串

含义：被删除的角色的名称

### PlayerWillBeAdded

::: tip 触发时机

角色即将被添加之前。此时角色还没有被创建，您不能获取该角色的实例。

:::

#### playerName

类型：字符串

含义：即将被添加的角色的名称

### PlayerWillBeDeleted

::: tip 触发时机

角色被删除之前。此时角色还没有被删除，您还可以获取该角色的实例。

:::

#### player

类型：`App\Models\Player`

含义：该角色的实例

### PluginWasDeleted

::: tip 触发时机

插件被删除*之前*。笔者注：这个事件的命名有误导，尽管名称上是 `PluginWasDeleted`，但其实此时插件还没有被删除（具体可以阅读 Blessing Skin 源码），否则这个事件也就失去了意义。:sweat_smile:

:::

#### plugin

类型：`App\Services\Plugin`

含义：即将被删除的插件的实例

### PluginWasDisabled

::: tip 触发时机

插件被禁用之后。

:::

#### plugin

类型：`App\Services\Plugin`

含义：被禁用的插件的实例

### PluginWasEnabled

::: tip 触发时机

插件被启用之后。

:::

#### plugin

类型：`App\Services\Plugin`

含义：被启用的插件的实例

### RenderingFooter

::: tip 触发时机

页面在渲染底部的 HTML 之后。此时 Blessing Skin 自己的 JavaScript 文件已经加载完毕，您可以放心地使用来自 Blessing Skin 的前端接口。

:::

#### contents

类型：元素类型为字符串的数组

含义：这个数组中的所有元素会被逐个添加到页面底部的 HTML 中。

#### addContent

类型：函数

含义：这其实是 `RenderingFooter` 事件实例上的方法，而不是属性。此方法接收一个字符串作为参数，用于向页面添加内容。

例子：

```php
$event->addContent('<script></script>');
```

### RenderingHeader

::: tip 触发时机

页面在渲染顶部的 HTML 之后。注意此时页面的主体内容还没有被渲染。

:::

#### contents

类型：元素类型为字符串的数组

含义：这个数组中的所有元素会被逐个添加到页面顶部的 HTML 中。

#### addContent

类型：函数

含义：这其实是 `RenderingHeader` 事件实例上的方法，而不是属性。此方法接收一个字符串作为参数，用于向页面添加内容。

例子：

```php
$event->addContent('<style></style>');
```

### TextureDeleting

::: tip 触发时机

材质将被删除。

:::

#### contents

类型：`App\Models\Texture`

含义：正在被删除的材质。

### UserAuthenticated

::: tip 触发时机

用户认证之后。注意，这不等同于用户登录。具体表现是，不管用户是否已登录，Blessing Skin 都会去检查用户登录状态，如果此时用户已登录（不一定是刚刚登录的，有可能是之前已登录然后访问其它页面，也有可能是用户开启了「记住我」的选项），那么这个事件就会被触发。

:::

#### user

类型：`App\Models\User`

含义：该用户的实例

### UserLoggedIn

::: tip 触发时机

用户登录之后。

:::

#### user

类型：`App\Models\User`

含义：该用户的实例

### UserProfileUpdated

::: tip 触发时机

用户的个人资料更新之后。

:::

#### type

类型：字符串

含义：表示哪个数据项被更新。目前有以下可用的值：

- `nickname` - 表明用户更新了昵称

- `password` - 表明用户更新了密码

- `email` - 表明用户更新了邮箱地址

#### user

类型：`App\Models\User`

含义：该用户的实例

### UserRegistered

::: tip 触发时机

用户注册之后。此时该用户已被创建。

:::

#### user

类型：`App\Models\User`

含义：新创建的用户的实例

### UserTryToLogin

::: tip 触发时机

用户尝试登录时，此时未进行密码验证等操作。

:::

#### identification

类型：字符串

含义：用户的标识，可能是用户的邮箱，也可能是用户持有的角色名。具体请看 `authType` 属性。

#### authType

类型：字符串

含义：表示 `identification` 属性的类型。如果用户以邮箱地址的形式登录，那么这个值为 `email`；如果用户以他/她持有的角色名登录，那么这个值为 `username`（您没有看错，是 `username` 而不是 `playerName`）。
