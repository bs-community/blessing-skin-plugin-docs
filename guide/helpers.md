---
title: 辅助函数
---

# {{ $page.title }}

Blessing Skin 中包含了一些的全局可用「辅助」PHP 函数，Blessing Skin 本身也使用了这些功能；如果您觉得方便，您可以在您的插件中自由地使用它们。

[[toc]]

## `bs_footer_extra`

渲染页面底部除 Blessing Skin 以外的内容。

```php
$html = bs_footer_extra();
```

## `bs_hash_file`

计算由用户上传的文件的 hash 值。

```php
$hash = bs_hash_file(request()->file('file'));
```

## `bs_header_extra`

渲染页面顶部除 Blessing Skin 以外的内容。

```php
$html = bs_header_extra();
```

## `bs_menu`

生成页面侧栏菜单的信息。

```php
$menu = bs_menu('user');  // 普通用户页面的菜单

$menu = bs_menu('admin'); // 管理面板的菜单
```

## `bs_menu_render`

根据菜单信息生成相应的 HTML。

```php
$html = bs_menu_render(bs_menu('user'));
```

## `format_http_date`

根据 UNIX 时间戳生成可在 HTTP 头部中表示的时间字符串。

```php
$time = format_http_date(time());
```

## `get_base_url`

返回整个 Blessing Skin 的根 URL，支持 Blessing Skin 安装在子目录。

```php
$url = get_base_url();
```

## `get_client_ip`

返回客户端的 IP 地址。

```php
$ip = get_client_ip();
```

## `get_current_url`

返回当前请求的 URL。

```php
$url = get_current_url();
```

## `get_datetime_string`

根据 UNIX 时间戳返回「Y-m-d H:i:s」格式的时间字符串。

```php
$time = get_datetime_string(time());
```

## `get_db_config`

返回数据勯连接信息，可指定返回哪个连接。

```php
$info = get_db_config();   // 返回默认的数据库连接信息

$info = get_db_config('sqlite');  // 返回 SQLite 连接的信息
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

## `humanize_db_type`

::: tip

此函数在 Blessing Skin v3 为 `get_db_type`，在 Blessing Skin v4 更名为 `humanize_db_type`，功能保持不变。

:::

输出可读的数据库类型名称。

```php
humanize_db_type('mysql');  // 返回 'MySQL'

humanize_db_type('sqlite');  // 返回 'SQLite'

humanize_db_type('pgsql');  // 返回 'PostgreSQL'
```

## `is_request_secure`

判断当前请求是否采用 HTTPS。

```php
$isSecure = is_request_secure();
```

## `json`

返回一个 JSON 响应。注意，您需要在控制器中手动返回此函数的返回值，也就是需要在控制器方法中进行 `return json();`。

```php
json(['a' => 1, 'b' => 2]);  // {"a":1,"b":2}

json('Hello.', 0, ['a' => 1]);  // {"code":0,"message":"Hello.","data":{"a":1}}

json('Success', 0);  // {"code":0,"message":"Success"}

json('Failed');  // {"code":1,"message":"Failed"}
```

## `nl2p`

将多行文本转换成多个 HTML 段落（即 `p` 元素）。

```php
$html = nl2p('a\nb');  // <p>a</p><p>b</p>
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
