# 插件的开始

[[toc]]

`bootstrap.php` 是整个插件的入口文件，插件在运行的时候，`bootstrap.php` 中的代码会首先被执行。

为了代码的模块化，插件的业务逻辑不应放在此处，`bootstrap.php` 应该只包含真正的逻辑代码前的准备代码，如对请求的判断和处理、菜单项的添加、路由、事件监听等。

## 返回闭包

`bootstrap.php` 其实是一个返回一个闭包的 PHP 文件，您可以理解为它返回一个匿名函数，所有的代码都要写在这个匿名函数中。此外，您可以在这个闭包（即这个匿名函数）的参数列表中使用类型提示，Laravel 会自动从容器中解析出对应的依赖并自动注入。（在使用依赖注入之前，建议您先了解 [Laravel 的服务容器](https://d.laravel-china.org/docs/5.2/container)）

常用的依赖有：

- `Illuminate\Contracts\Events\Dispatcher` 事件监听需要此依赖。详情请阅读 [事件](./backend-event.md) 一节。
- `Illuminate\Http\Request` 可用于处理用户的请求，如请求的 HTTP 动词判断、获取请求的路径、获取请求体中包含的数据、获取 Cookies 等，详细请阅读 [Laravel 文档](https://laravel-china.org/docs/laravel/5.6/requests/1367)。

此外，从 5.0.0 起，您可以通过 `$plugin` 参数获取当前插件的实例：

```php
return function ($plugin) {
    // $plugin 就是这个插件的实例。

    // 可以像下面这样获取前端资源 URL：
    $plugin->assets('something.css');
};
```

## 钩子

Blessing Skin Server 提供了一些钩子供插件使用，例如向页面添加样式文件、添加脚本文件、添加菜单项、添加路由等。

调用钩子前，您应该通过 `use App\Services\Hook;` 来加载 `Hook` 类。所有的钩子都是 `Hook` 类中的静态方法。

### 添加菜单项

通过这个钩子，您可以向皮肤站的用户中心和管理面板的左侧菜单栏添加菜单项，如：

```php
Hook::addMenuItem('user', 0, [
    'title' => 'Blessing\ExamplePlugin::general.menu',
    'link'  => '/my-page',
    'icon'  => 'fa-cog',
    'new-tab' => true, // 表示是否在浏览器新标签页中打开链接，默认为 false
]);
```

第一个参数只能是 `user` 或 `explore`（即「用户中心」下的「浏览」菜单） 或 `admin`，分别表示把菜单项添加到 “用户中心” 和 “管理面板” 的左侧菜单栏。

第二个参数用于定义菜单项的位置，从 0 开始计算，如果这个数值过大，那么菜单项将无法显示。

第三个参数传递的是一个数组。数组包含 `title`、`link`、 `icon` 和 `new-tab`。

- `title`

`title` 是菜单项的显示名，它会经过翻译器翻译（即调用语言文件），并且您还要指明语言文件所在插件的命名空间，例子中就表示从 `Blessing\ExamplePlugin` 这个命名空间中寻找语言文件，接着从该命名空间中寻找相应的翻译值，有关多语言请阅读 [多语言](./i18n.md) 一节。

另外，如果您没有使用多语言功能，那么它将 `title` 的值本身。

- `link`

`link` 指定的是菜单项对应的链接，既可以是相对路径，也可以是绝对路径。

- `icon`

如果您细心观察的话，会发现每个菜单项前都有一个图标。`icon` 正是定义该菜单项的图标，它使用的是 Font Awesome 的图标，完整的可用图标列表请参考 [Font Awesome 的官方网站](http://fontawesome.io/icons/)

### 添加路由

请阅读 [路由](./route.md) 一节。

### 向页面添加样式文件

有时您可能想向页面添加自定义的 CSS 文件，则可以通过 `addStyleFileToPage` 来添加，如：

```php
Hook::addStyleFileToPage(plugin_assets('example-plugin', 'assets/css/example.css'));
```

又或者：

```php
Hook::addStyleFileToPage(plugin('example-plugin')->assets('assets/css/example.css'));
```

### 向页面添加脚本文件

同样，您可能想向页面添加自定义的 JavaScript 文件，则可以通过 `addScriptFileToPage` 来添加，如：

```php
Hook::addScriptFileToPage(plugin('example-plugin')->assets('assets/js/example.js'), [*]);
```

这里要说明的是，通过 `plugin` 的 `assets` 方法同样可以获取到静态资源。第一个参数是要加载的 URL；第二个参数可选参数表示仅当请求的 URI 与参数匹配时才加载该资源文件，可以使用通配符，这个参数是可选的。

### 注册 JavaScript 的语言文件

注册 JavaScript 的语言文件相当简单，您只需将插件的 `name` 值作为参数传递给 `registerPluginTransScripts` 方法，如：

```php
Hook::registerPluginTransScripts('example-plugin');
```

注意，语言文件的路径必须是插件目录下的 `lang/{Language}/locale.js`，其中 `{Language}` 为 `en` 或 `zh_CN`。

### 显示用户 badge  <Badge text="4.3.0+"/>

调用 `addUserBadge` 方法会向用户中心和管理面板左上角的用户信息面板添加一个 badge。用法如下：

```php
Hook::addUserBadge('text', 'green');
```

其中第一个参数为 badge 上要显示的文本内容；第二个参数是颜色，这个参数是可选的，默认为 `primary`。

### 发送通知 <Badge text="4.3.0+"/>

利用此 API 可以向用户发送一条通知，该通知将出现在页面右上方。

```php
Hook::sendNotification($users, $title, $content);
```

其中 `$users` 为要接收此通知的用户。从 5.0.0 起，可以传入单个用户实例。

### 注册中间件 <Badge text="4.3.0+"/>

使用此 API 可以动态地向 Blessing Skin 现有的路由增加一个中间件。注意，对于插件自己注册的路由，不需要使用此 API，只需要在注册的路由中调用 `middleware` 方法即可。

```php
class Middleware
{
    public function handle($request, $next)
    {
        return $next($request);
    }
}

Hook::pushMiddleware(Middleware::class);
```

要注意的是，向此 API 传入的必须是中间件本身，而不是中间件这个类的一个实例。
