# 路由

路由指的是通过指定的 URI 路径来访问，而无需像传统的访问静态文件路径那样，可以达到美化链接的作用。

所有的路由都要在 `bootstrap.php` 中的闭包中添加，就像下面这样：

```php
use App\Services\Hook;

return function () {
    Hook::addRoute(function ($routes) {
        // 在这里注册路由
    });
};
```

关于路由更详细的用法，请参考 Laravel 5.1 文档中 [HTTP 路由](http://d.laravel-china.org/docs/5.1/routing) 一节。

## 最简单的路由

您可以根据插件的需要，对不同的 HTTP 动作进行路由注册。这里要说明的是，即使请求的 URI 相同，如果 HTTP 动作不同，将表示不同的路由，就像这样：

```php
Hook::addRoute(function ($routes) {
    $routes->get('foo/bar', 'FoobarController@showPage');
    $routes->post('foo/bar', 'FoobarController@foobar');
});
```

使用 `match` 方法可以注册多个不同的 HTTP 动作的路由：

```php
Hook::addRoute(function ($routes) {
    $routes->match(['get', 'post'], 'foo/bar', 'FoobarController@doSomething');
});
```

您还可以使用 `any` 方法响应所有 HTTP 动作：

```php
Hook::addRoute(function ($routes) {
    $routes->any('foo/bar', 'FoobarController@doSomething');
});
```

为了保证 Laravel 能对路由进行缓存，建议您以字符串的形式指定到控制器，而不是使用闭包（因为 Laravel 不缓存闭包路由）。下面就是反面教材：

```php
Hook::addRoute(function ($routes) {
    $routes->any('foo/bar', function () {
        // 不推荐这样做
    });
});
```

在路由的注册中，通常像 `'FoobarController@doSomething'` 这样来指定控制器。其中，`FoobarController` 是控制器对应的类名，`doSomething` 是 `FoobarController` 中的公有方法名。

**由于插件代码总是有不同于皮肤站程序的命名空间，因此您必须指定该类的命名空间，除非您使用路由组。（关于路由组后文会有介绍）**

## 从路由中获取参数

您可以从 URI 中提取参数，如：

```php
Hook::addRoute(function ($routes) {
    $routes->any('player/{skin_id}/{cape_id?}', 'FoobarController@doSomething');
});
```

其中，像 `{cape_id?}` 这样在参数名后加上 `?` 表示这该参数是可选的。

而在控制器中，则可以像下面这样提取参数。别忘了给可选参数加个默认值。

```php
public function doSomething($skin_id, $cape_id = null)
{
    //
}
```

## 路由组

有时您可能想共享几个路由的属性，这时您可以使用路由组。下面是一个简单的路由组例子：

```php
Hook::addRoute(function ($routes) {
    $routes->group([
        'middleware' => ['web'],
        'prefix'     => 'hello',
        'namespace'  => 'Example\Foo\Bar'
    ], function ($route) {
        $route->get('world', 'ExampleController@example');
    });
});
```

`group` 方法接收两个参数。第一个参数是路由组的属性，它是一个关联数组，其中的属性不必拘泥于上面的示例；第二个参数是一个闭包，闭包内的用法与前方所介绍的路由用法相同。

这里简单介绍下路由组中常用的一些属性。

- `middleware`

这个表示路由组要使用的中间件，关于中间件，下文会有介绍。它的值既可以是一个字符串，也可以是一个字符串数组（如果您想同时使用多个中间件）。

- `prefix`

路由组前缀。例子中的前缀是 `hello`，那么它将响应以 `hello` 开头的路由，例如它会响应 `/hello/world`。

- `namespace`

命名空间。指定路由组内要接收响应的控制器所在的命名空间。以上述的例子为例，指定了 `ExampleController` 的命名空间为 `Example\Foo\Bar`，而无需为每个路由对应的控制器都添加命名空间。

## 中间件

从严格的角度来看，中间件与路由是两个概念，但考虑到插件的开发几乎不需要自己定义中间件，因此把 “中间件” 放在这里简单介绍。

如果您对 “中间件” 感兴趣，您可以阅读 Laravel 5.1 的文档 [HTTP 中间件](http://d.laravel-china.org/docs/5.1/middleware) 一节。

在这里，中间件可以对用户的请求进行过滤。如，当一个未登录的访客试图访问用户中心时，`auth` 中间件将检查访客是否已登录，如果已登录，则允许继续访问用户中心，否则跳转到登录界面。

Blessing Skin Server 提供了三个可用的中间件：

- `web`

这个中间件主要是进行一些基本的检查如 Cookies 等，除非为了 API，否则建议一般的请求都使用该中间件。

- `auth`

这个中间件可以检查访客是否已登录。

- `admin`

这个中间件可以检查当前的用户是否为管理员。对于只能由管理员访问的请求，必须使用此中间件。

#### 使用中间件

您可以在路由组中使用上面提到的中间件。如果不是路由组，则可以像这样使用中间件：

```php
Hook::addRoute(function ($routes) {
    $routes->get('foo/bar', 'FoobarController@showPage')->middleware(['web', 'auth']);
});
```

`middleware` 方法接收的参数同样为字符串或字符串数组。
