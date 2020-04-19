# 视图

[[toc]]

视图其实就是 HTML，它使用的是 Laravel 的 Blade 模板引擎，从 Blessing Skin v5 起开始使用 Twig。

关于视图更详细的用法，请参考 Laravel 文档中 [视图](http://d.laravel-china.org/docs/7.x/views) 一节。

关于 Blade 模板更详细的用法，请参考 Laravel 文档中 [Blade 模板](http://d.laravel-china.org/docs/7.x/blade) 一节。

## 添加视图文件

所有的视图文件都放在插件目录下的 `views` 目录下。若视图文件的后缀名是 `.blade.php`，则使用 Blade 作为模板引擎；若后缀名是 `.twig`，则使用 Twig 作为模板引擎。

## 使用视图

如果您希望返回一个视图，您可以在控制器中使用全局的辅助函数 `view`：

```php
public function showLoginPage()
{
    return view('Author\MyPlugin::hello.world');
}
```

注意必须要指定命名空间。

您可能注意到上面的例子中指定视图文件时使用了小数点`.`，这表示该视图文件位于插件目录下 `views/hello` 目录中的 `world.blade.php`。也就是说，使用小数点`.`来进行目录层级定位。

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

## 模板继承

为了让您的插件的页面能与皮肤站的界面保持基本一致的风格，您应该使用模板继承。

对于一个插件而言，如果希望使用皮肤站现有的风格，您的视图文件应该是这样的（以 Twig 为例）：

```twig
{% extends '要继承的母页面' %}

{% block title %}页面标题{% endblock %}

{% block content %}
  <!-- 页面内容 -->
{% endblock %}
```

可以被继承的模板一般为 `user.base` 或 `admin.master`，分别表示用户中心的基本页面和管理面板的基本页面，当然您可以自己定义另外一个视图后继承它 *（别忘了要注意命名空间！）*。
