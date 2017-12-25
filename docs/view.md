---
id: view
title: 视图
---

视图其实就是 HTML，它使用的是 Laravel 的 Blade 模板引擎。

关于视图更详细的用法，请参考 Laravel 5.1 文档中 [视图](http://d.laravel-china.org/docs/5.1/views) 一节。

关于 Blade 模板更详细的用法，请参考 Laravel 5.1 文档中 [Blade 模板](http://d.laravel-china.org/docs/5.1/blade) 一节。

## 添加视图文件

所有的视图文件都放在插件目录下的 `views` 目录下，视图文件的后缀名可以是 `.blade.php` 或 `.tpl`。

如果同名的视图文件使用不同的后缀名时，优先加载 `.tpl` 的。例如，同一目录下同时存在 `index.blade.php` 和 `index.tpl` 两个视图文件，那么只会加载 `index.tpl`。

> 如果您对为什么能使用 `.tpl` 作后缀感兴趣，请移步 [这里](https://blessing.studio/add-extensions-for-blade-in-laravel/)

## 使用视图

如果您希望返回一个视图，您可以在控制器中使用全局的辅助函数 `view`：

```php
public function showLoginPage()
{
    return view('Author\MyPlugin::hello.world');
}
```

注意必须要指定命名空间。

您可能注意到上面的例子中指定视图文件时使用了小数点`.`，这表示该视图文件位于插件目录下 `views/hello` 目录中的 `world.blade.php` 或 `world.tpl`。也就是说，使用小数点`.`来进行目录层级定位。

## 传递数据

视图不仅仅是显示您已经写好的 HTML 那么简单，您可以从插件传递一些数据到前端页面。

```php
return view('Author\MyPlugin::hello.world')->with('key', $value);
```

当您需要传递较多的数据时，使用多个 `with` 方法是不优雅的，因此您传递一个关联数组给 `view` 函数：

```php
return view('Author\MyPlugin::hello.world', ['name' => 'Secret', 'phone' => 2333]);
```

如何使用这些数据？请继续阅读。

## Blade 模板

您可以在 Blade 模板中使用 HTML，并且以前那样使用 PHP 语句：

```blade
<html>
    <head></head>
    <body>
        <?php
            // 传统的调用 PHP 的方法
        ?>
        {{ /* Blade 特有的，您可以在这里写简单的 PHP 语句 */ }}
    </body>
</html>
```

### 显示数据

在上一部分，我们讲述了怎样将数据传递到视图，现在我们就试着在 Blade 模板中加载这些数据。

您只需在双大括号（花括号）内使用这些数据，如：

```blade
<h1>{{ $name }} - <small>{{ $phone }}</small></h1>
```

它会被渲染成：
```html
<h1>Secret - <small>2333</small></h1>
```

双大括号（花括号）内所有的数据都会被转义，如果您要显示原始的未被转义的数据，您可以这样做：

```blade
<h1>{!! $name !!} - <small>{!! $phone !!}</small></h1>
```

**请只对可靠内容才显示其未转义的原始数据，以防止 XSS 攻击**

### 控制结构

> 这一部分内容摘自 Laravel 5.1 文档，原文请看[这里](http://d.laravel-china.org/docs/5.1/blade#control-structures)

#### If 表达式

你可以通过 `@if`, `@elseif`, `@else` 及 `@endif` 指令构建 `if` 表达式。这些命令的功能等同于在 PHP 中的语法：

```blade
@if (count($records) === 1)
    我有一条记录！
@elseif (count($records) > 1)
    我有多条记录！
@else
    我没有任何记录！
@endif
```

为了方便，Blade 也提供了一个 `@unless` 命令：

```blade
@unless (Auth::check())
    你尚未登录。
@endunless
```

#### 循环

除了条件表达式外，Blade 也支持 PHP 的循环结构：

```blade
@for ($i = 0; $i < 10; $i++)
    目前的值为 {{ $i }}
@endfor

@foreach ($users as $user)
    <p>此用户为 {{ $user->id }}</p>
@endforeach

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>没有用户</p>
@endforelse

@while (true)
    <p>我永远都在跑循环。</p>
@endwhile
```

#### 为集合渲染视图

你可以使用 Blade 的 `@each` 命令将循环及引入结合成一行代码：

```blade
@each('view.name', $jobs, 'job')
```

第一个参数为每个元素要渲染的局部视图，第二个参数你要迭代的数组或集合，而第三个参数为迭代时被分配至视图中的变量名称。所以，举例来说，如果你要迭代一个 `jobs` 数组，通常你会希望在局部视图中通过 `job` 变量访问每一个 job。

你也可以传递第四个参数至 `@each` 命令。此参数为当指定的数组为空时，将会被渲染的视图。

```blade
@each('view.name', $jobs, 'job', 'view.empty')
```

#### 注释

Blade 也允许在页面中定义注释，然而，跟 HTML 的注释不同的是，Blade 注释不会被包含在应用程序返回的 HTML 内：

```blade
{{-- 此注释将不会出现在渲染后的 HTML --}}
```

### 模板继承

为了让您的插件的页面能与皮肤站的界面保持基本一致的风格，您应该使用 Blade 的模板继承功能。

对于一个插件而言，如果希望使用皮肤站现有的风格，您的视图文件应该是这样的：

```blade
@extends(/* 要继承的母页面 */)

@section('title', /* 页面标题 */)

@section('content')
<!-- 页面内容 -->
@endsection

@section('script')
<script>
    // 您的 JavaScript 代码
</script>
@endsection
```

在上面的代码中，`@extends()` 中的值一般为 `user.master` 或 `admin.master`，分别表示用户中心的基本页面和管理面板的基本页面，当然您可以自己定义另外一个视图后继承它*（别忘了要注意命名空间！）*。

`@section('title', /* 页面标题 */)` 这里可以定义页面的标题。您需要将标题放入第二个值。注意，如果是一般的字符串，您可以简单地用单引号或双引号包着标题内容，如 `@section('title', '示例页面')` 或 `@section('title', "示例页面")`。如果是多语言，请用 `trans` 函数：`@section('title', trans('ExamplePlugin\Test::hello.world'))`。
