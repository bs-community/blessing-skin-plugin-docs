---
title: 用户认证
---

# {{ $page.title }}

::: warning

本节内容仅适用于 Blessing Skin v4 或更高版本

:::

## 概览

Blessing Skin v4 使用了 Laravel 自带的认证系统，因此获取当前用户的信息变得容易。Laravel 的认证系统提供了一系列方法，您既可以通过 `Auth` Facade 来调用，也可以使用 `auth` 辅助函数。下面的演示都使用 `auth` 辅助函数，但实际中，无论是 `Auth` Facade 还是 `auth` 辅助函数，两者是一样的。

## 检查用户是否已登录

通常，您如果要让某个请求只有在用户登录才能访问的话，您应该使用 `auth` 中间件。不过在某些场景下，您可能需要在控制器中或其它地方手动检查用户是否已登录，那么您可以使用 `check` 方法，它返回一个 `bool` 类型的值，表明用户是否已登录。

```php
if (auth()->check()) {
    // 用户已登录
}
```

## 获取当前用户的模型实例

您可能需要获取当前已登录的用户的模型实例。您可以使用 `user` 方法，如果用户未登录，它将返回 `null`，因此使用 `user` 方法前不需要调用 `check` 方法，只需要判断 `user` 方法的返回值是否为空即可。

```php
$user = auth()->user();
// 这里的 $user 就是 App\Models\User 的实例，因此 User 模型实例中的方法都能用。
```

## 获取当前用户的 `uid`

您可以像这样获取当前用户的 `uid`：

```php
$uid = auth()->user()->uid;
```

但其实还有更简便的方法，那就是调用 `id` 方法：

```php
$uid = auth()->id();
```

## Blade 与视图

Laravel 为 Blade 提供了两个指令，可以对当前认证情况进行判断，而无需使用 `@if` 指令手动判断。

### `@auth` 指令

```html
@auth
    这里的内容只有在用户登录才能看到。
@endauth
```

### `@guest` 指令

```html
@guest
    这里的内容只有未登录的用户才能看到。
@endguest
```
