# 插件信息定义

## 前言

由于此文件是 JSON 格式文件，所以您必须按照 JSON 的规范来写。错误的 `package.json` 将导致**插件无法运行**和**皮肤站的插件列表无法加载**。在编写完此文件之后，您可以前往 [BeJSON](http://www.bejson.com/) 进行 JSON 校验。

## 字段总览

- [`name`](#name)
- [`version`](#version)
- [`title`](#title)
- [`description`](#description)
- [`author`](#author)
- [`namespace`](#namespace)
- [`config`](#config)
- [`url`](#url)
- [`require`](#require)
- [`enchants`](#enchants)

## 详细介绍

### `name`

这个是插件的唯一标识符，推荐使用 kebab-case 命名法，如：`my-plugin`、`this-is-an-example`。

*切记，不同的 `name` 值代表不同的插件，所以您千万不能将版本信息写在此处。Blessing Skin Server 会认为这是两个插件！*

### `version`

这个表示插件的版本。**这个字段的值类型必须是字符串**。

Blessing Skin Server 并没有对此字段作出内容限定，但我们建议它的值为数字，如`1.0`、`3.2.1`，不建议带字母 “v”。当然，若您使用如 “Jessie” 这样的词作为版本，也是可以的。

使用数字作为版本的好处是，利于插件市场进行版本对比，以提示用户进行插件更新和升级。

### `title`

这是插件在 “插件管理” 页上显示的名称，可以使用任意 UTF-8 字符集支持的字符。此字段的值与其它插件重复不影响各自的运行，但会给用户带来麻烦。

### `description`

这是对插件的描述，长度适中就好。

### `author`

插件的作者。

### `namespace`

这里定义了插件的命名空间，不能重复。插件 `src` 目录下的所有类都会被加载到这个命名空间下。调用插件中定义的视图时也必须加上此命名空间。

由于 JSON 的原因和 PHP 中的命名空间使用反斜杠符号，因此要注意在此字段中使用转义 `\\` 来表示 `\`。如：`Foo\\Bar` 表示 PHP 中的 `Foo\Bar`。

### `config`

这里定义「插件配置」页面是哪个视图文件，如果您的插件没有或不需要「插件配置」页，则可省略此字段。如果您的插件配置页面位于 `views/config.blade.php`，则也可以省略此字段，Blessing Skin 能自动识别。

### `url`

这个表示插件的 URL，可以是简介页，也可以是开源仓库的地址。这个字段的值不影响插件运行，也可以省略不写。

### `require`

这个字段用于声明插件的依赖，更多介绍请移步 [声明依赖](dependency.md)

### `enchants` <Badge text="5.0.0+"/>

`enchants` 字段定义了影响插件行为的信息。这个字段还细分有不同的字段。

#### `providers`

该字段的类型为字符串数组。利用字段可以定义要加载的 [服务提供者](https://learnku.com/docs/laravel/5.8/providers)。

在指定要加载的服务提供者时，可省略命名空间，因为所有的服务提供者都 **必须** 从插件指定的命名空间中加载。此外，还可以省略类名后面的 `ServiceProvider`。

例如：

```json
{
  "namespace": "Example",
  "enchants": {
    "providers": [
      "Example\\MyServiceProvider",
      "Our"
    ]
  }
}
```

上面的例子定义了两个服务提供者。第一个为全写的形式；对于第二个，Blessing Skin 会根据 `namespace` 自动补全为 `Example\\OurServiceProvider`。

更多内容请阅读本文档关于 [服务提供者](./providers.md) 部分。

#### `conflicts`

该字段的结构与定义插件依赖类似。具体作用请阅读 [声明插件冲突](./conflicts.md)。
