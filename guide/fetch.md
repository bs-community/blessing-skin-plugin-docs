---
title: 前端网络请求
---

# {{ $page.title }}

::: warning

本节仅适用于 Blessing Skin v4

:::

[[toc]]

## 从 v3 迁移到 v4

### 代码迁移

如果您要将您的插件从支持 v3 迁移到支持 v4，那么您应该阅读本部分内容。

在 Blessing Skin v3 中，所有的 AJAX 是通过调用一个名为 `fetch` 函数。但这个函数并不是真正的来自浏览器本身的 `fetch` 函数，也就是说，Blessing Skin v3 将浏览器本身的 `fetch` 覆盖了。Blessing Skin v3 中的 `fetch` 函数实际上是经过 `Promise` 包装的 `$.ajax`。

而从 Blessing Skin v4 开始，所有的网络请求使用真正的、浏览器提供的 `fetch` 函数。因此，如果您要进行迁移，有两种解决办法。

第一种是将 `fetch` 换成 `$.ajax`，这是临时的解决办法。因为在 Blessing Skin v4 中，jQuery 库没有并移除，因此 jQuery 中所有方法都能继续使用。但要注意的是，`$.ajax` 方法返回的并不是真正的 `Promise`，幸运的是，它返回的对象是 thenable 对象，因此通过简单地使用 `Promise.resolve()` 即可解决。但是，使用 `$.ajax` 函数，您将无法获得一些 `blessing.fetch` 拥有的便利特性。

第二种是使用由 Blessing Skin v4 提供的用于进行网络请求的函数，这是推荐的做法，但稍微需要一点时间去更改您的代码。具体用法见下文。

### 请不要覆盖 `fetch` 函数

在 Blessing Skin v3 中，由于前端代码没有对插件提供足够的接口，导致一些特别的操作不容易进行。

其中有些插件为了修改由前端发送后端的数据，将原有 `fetch` 覆盖掉。这种做法在 Blessing Skin v4 中是绝对不允许的。因为 Blessing Skin v4 使用了浏览器原生的 Fetch API，如果将 `fetch` 覆盖，将会影响 Blessing Skin 本身的运行。

但修改数据这种需求还是有的。为此，在 Blessing Skin v4 中，我们在进行 `fetch` 操作之前，将会触发一个名为 `beforeFetch` 的事件。您可以通过监听这个事件，在事件触发之时，对请求的数据进行数据，用法详见下文。

## 使用 `blessing.fetch`

Blessing Skin v4 对 Fetch API 进行了封装，因此您不必太多地关注如何使用 Fetch API。这些函数被封装在 `blessing.fetch` 中（`blessing` 是一个全局变量）。

`blessing.fetch` 中所有的方法都拥有以下特性，无需任何配置，开箱即用。

### 基础 URL

您不需要填写完整的 URL，而只需要填写相对的路径。即使用户的 Blessing Skin 安装在子目录，也能轻松解决。

### 异常处理

`blessing.fetch` 中的方法已经帮您处理好异常的问题。如果在进行 HTTP 请求时发生错误，Blessing Skin 将会弹出一个模态的报错对话框。

### CSRF Token

CSRF Token 会在进行 HTTP 请求前被自动加上，无需干预。

### 解析 JSON

如果后端返回的响应的 `Content-Type` 为 `application/json`，那么响应中的 JSON 内容会被自动解析成 JavaScript 数据（通常是对象）；否则以文本的方式返回。

## API

`blessing.fetch` 中所有的方法都返回 `Promise`。目前 `blessing.fetch` 提供了以下方法：

### `get`

进行一次 `GET` 请求。此方法接收两个参数，分别为 `url` 和 `params`。

#### `url`

类型：字符串。这个参数是必须存在的，用于指明您要请求的目标 URL，但不需要填写完整的 URL。

#### `params`

类型：JavaScript 对象。这个参数是可选的。如果这个参数存在，对象会被转换成 URL 的 query string，然后拼接在前面您提供的 URL 后面。

### `post`

进行一次 `POST` 请求。此方法接收两个参数，分别为 `url` 和 `data`。

#### `url`

类型：字符串。这个参数是必须存在的，用于指明您要请求的目标 URL，但不需要填写完整的 URL。

#### `data`

类型：可以有两种类型，一种是 JavaScript 对象，另一种是 `FormData`。这个参数是可选的。如果参数为 JavaScript 对象，则对象会被序列化为 JSON；如果参数为 `FormData`，则以 `FormData` 的形式提交。

## 事件

在您使用 `blessing.fetch` 中的方法时，一些事件会被触发。您可以通过监听这些事件来实现某些操作，例如修改数据。

### beforeFetch

::: tip 触发时机

在调用 Fetch API 之前。

:::

该事件会传递一个参数到您的回调函数中。该参数是一个对象，包含以下属性。

#### `method`

类型：字符串

含义：表示当前请求的 HTTP 动词，即 `GET` 和 `POST` 等。请不要修改这个属性。

#### `url`

类型：字符串

含义：表示当前请求的目标 URL。注意此 URL 并非完整的 URL。除非必要，否则不要修改这修改属性。

#### `data`

类型：JavaScript 对象。也有可能是 `FormData`，但目前只有「上传材质」页面中的上传材质时，这个值才会是 `FormData`，其它情况下均为 JavaScript 对象。

含义：要传输的数据。例如，在 GET 请求中，它会被转换成 query string；在 POST 请求中，它会被序列化成 JSON。

您可以通过修改这个 `data` 属性来实现向后端发送额外数据的目的。例如，假设您希望在用户注册时需要邀请码，那么您可以通过监听这个事件并修改 `data` 属性来加入额外的数据。如：

```javascript
blessing.event.on('beforeFetch', request => {
  request.data.invitationCode = $('#invitation-code').val()
})
```

### fetchError

::: tip 触发时机

使用 Fetch API 发生错误时。当前网络出现故障，或返回的 HTTP 状态码不为 2xx 时，这个事件都会被触发。

:::

注意，即使您监听了这个事件，一旦发生错误时，模态的警告对话框依然会出现。

传递给回调函数的参数的类型可能是 `Error` 实例，也可能是普通的字符串。

有时候，您可能希望如果数据不能正常获取时作一些处理（例如，向页面提示「数据暂时无法获取」），那么这个事件是很有用的。您可以这样写：

```javascript
blessing.event.on('fetchError', error => {
  $('#somewhere').text('数据暂时无法获取')
})
```
