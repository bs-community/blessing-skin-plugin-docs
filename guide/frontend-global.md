---
title: 全局 blessing 变量
---

# {{ $page.title }}

[[toc]]

## 概览

`blessing` 是一个挂载在 `window` 对象上的全局可用的变量。`blessing` 变量本身是一个对象，包含了一些属性，下面将一一介绍。

## `base_url`

::: tip

笔者注：这个属性名不符合 JavaScript 中的以驼峰式命名的习惯。

:::

类型：`string`

这个属性的值是当前 Blessing Skin 的根 URL，如果 Blessing Skin 被安装在子目录中，那它也包含子目录名称。

## `debug`

类型：`boolean`

表明当前是否处于调试状态。

## `env`

类型：`string`

等同于 `APP_ENV`。

## `fallback_locale`

类型：`string`

::: warning

从 v5.0.0 起，此属性已被移除。

:::

如果当前环境的语种不在 Blessing Skin 的支持范围内，这个值就是降级后的语种。

## `locale`

类型：`string`

当前环境的语种。

## `site_name`

类型：`string`

站点名称。

## `timezone`

类型：`string`

服务器所在时区，由 `php.ini` 中的设置所决定。

## `version`

类型：`string`

当前 Blessing Skin 的版本。

## `route` <Badge text="4.0.0+"/>

类型：`string`

当前请求的 Laravel 路由。

## `extra` <Badge text="4.0.0+"/>

类型：`any`

由后端向前端通过在 Blade 生成 JavaScript 代码而传递过来的数据。不同页面有不同的数据。

## `i18n` <Badge text="4.0.0+"/>

类型：`object`

前端国际化的文本内容都存放在这个对象中。

## `fetch` <Badge text="4.0.0+"/>

类型：`{ [method: string]: (url: string, data?: object) => Promise<object> }`

Blessing Skin 的前端资源请求所用的方法都在其中，具体请见 [前端资源请求](fetch.md)。

## `event` <Badge text="4.0.0+"/>

类型：`{ on(eventName: string, listener: Function): void; emit(eventName: string, payload?: object): void }`

Blessing Skin 的事件系统中用于触发事件和监听事件的方法，具体请见 [事件监听（前端）](frontend-event.md)。

## `notify` <Badge text="4.0.0+"/>

类型：`{ [key: string]: Function }`

目前在 `blessing.notify` 中有以下方法：

- `showModal`
