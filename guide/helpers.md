# 辅助函数

Blessing Skin 中包含了一些的全局可用「辅助」PHP 函数，Blessing Skin 本身也使用了这些功能；如果您觉得方便，您可以在您的插件中自由地使用它们。

[[toc]]

## `get_client_ip`

返回客户端的 IP 地址。

```php
$ip = get_client_ip();
```

## `get_string_replaced`

进行字符串替换。

```php
$replaced = get_string_replaced('Writing docs.', [
    'Writing' => 'Authoring',
    '.' => '!'
]);

// Authoring docs!
```

## `json`

返回一个 JSON 响应。注意，您需要在控制器中手动返回此函数的返回值，也就是需要在控制器方法中进行 `return json();`。

```php
json(['a' => 1, 'b' => 2]);  // {"a":1,"b":2}

json('Hello.', 0, ['a' => 1]);  // {"code":0,"message":"Hello.","data":{"a":1}}

json('Success', 0);  // {"code":0,"message":"Success"}

json('Failed');  // {"code":1,"message":"Failed"}
```

## `option`

返回或设置存储在数据库中的配置项。

```php
$value = option('my_custom_option');  // 获取选项 `my_custom_option` 的值

$value = option('my_custom_option', 'default');  // 若选项不存在，则将 `'default'` 作为默认值来返回

option(['my_custom_option' => 'Yeah']);  // 将选项 `my_custom_option` 的值设为 `'Yeah'`
```

## `option_localized`

功能与 `option` 函数相同，但返回的值可根据当前的语言环境的不同而不同。通过这个函数来设置不同的语言对应不同的值时，需要先将页面切换到目标语言。

```php
// 假定 `greeting` 选项在中文环境为「你好」，英文环境下为 "hello"

// en
option_localized('greeting');  // hello

// zh_CN
option_localized('greeting');  // 你好
```

## `plugin`

返回指定插件的实例。

```php
$plugin = plugin('example-plugin');
```

## `plugin_assets`

返回插件资源文件的 URL。

```php
$url = plugin_assets('example-plugin', 'assets/js/example1.js');
```
