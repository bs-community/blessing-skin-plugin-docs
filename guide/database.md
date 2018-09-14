---
title: 数据库
---

# {{ $page.title }}

## 创建数据表

就像之前在 [生命周期钩子](lifecycle.md) 中所说的，您可以在插件被启用之后创建数据表。创建数据表需要用到 `Schema` Facade，但您不必在 `callbacks.php` 或 `bootstrap.php` 中写上 `use Schema;`。

调用 `Schema` Facade 上的 `create` 静态方法可以创建数据表。`create` 方法接收两个参数。第一个参数是表名，您不需要手动加上数据表前缀，因为 Laravel 会自动帮您加上。第二个参数是一个回调函数，回调函数中包含一个类型为 `Illuminate\Database\Schema\Blueprint` 的参数。

创建数据表的代码大概是这样：

```php
Schema::create('my_table', function ($table) {
    // $table 参数上有很多实例方法
});
```

对表中各个列的定义都是通过调用 `$table` 变量上的实例方法来进行。关于如何定义表中的字段，[Laravel 文档](https://laravel-china.org/docs/laravel/5.6/migrations/1400#3c6c8e) 有相当详细的介绍，这里不赘述。

值得注意的是，在创建数据表之前，一定要先检测数据表是否已存在：

```php
if (! Schema::hasTable('my_table')) {
    Schema:::create('my_table', function ($table) {});
}
```

## 通过 `DB` Facade 来操作数据库

Laravel 提供了 `DB` Facade 来让您操作数据库，这是一种比较底层的做法，需要您对数据库操作有一定的了解。关于 `DB` Facade 可阅读 [Laravel 文档](https://laravel-china.org/docs/laravel/5.6/database/1397)。

## 通过 Eloquent ORM 来操作数据库

您还可以通过 Eloquent ORM 来使用数据库。如果您对数据库操作比较陌生，那么您可以选择使用这种办法。通过 Eloquent ORM，您不需要手动操作数据库（当然自己通过 `Schema` 来创建数据表还是必需的），只需要定义好数据模型，即可轻松使用数据库。详细信息可阅读 [Laravel 文档](https://laravel-china.org/docs/laravel/5.6/eloquent/1403)。
