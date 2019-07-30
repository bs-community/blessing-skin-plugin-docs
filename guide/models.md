---
title: 数据与模型
---

# {{ $page.title }}

[[toc]]

## 简介

Blessing Skin 中的每个模型都与数据库的数据表有联系，而每个模型实例都相当于数据表中的一行（row）数据。Blessing Skin 所有的三个模型都是 Laravel Eloquent ORM 模型。如果要获取关于 Laravel Eloquent ORM 的更多信息，建议阅读 [Laravel 文档](https://laravel-china.org/docs/laravel/5.8/eloquent/1403)。

目前 Blessing Skin 中共有四个模型，分别是 `User`、`Player` 和 `Texture`，它们均位于 `App\Models` 下。我们将会分别详细介绍这四个模型，并在最后讲述这些模型之间的关联，以及如何利用这些关联来简化代码。

值得注意的是，所有的 Laravel Eloquent ORM 模型都继承于 `Illuminate\Database\Eloquent\Model`，通过此来拥有 Eloquent ORM 的特性。即使这些模型的类上没有声明属性，您依然可以访问模型实例上数据。例如，`User` 模型在数据库中对应的数据表上存在 `score` 这个字段，然而您在 `App\Models\User` 这个类中并没有看到 `score` 这个类的属性，即使这样，您还是可以像 `$user->score` 这样来获取或设置 `score` 这个字段上的值。

## 基本操作

### 获取模型实例

如果要按主键来查找模型实例，可以调用模型的 `find` 静态方法。例如，如果要查找一个 `uid` 为 `1` 的用户模型实例，那么可以：

```php
$user = User::find(1);
```

如果用户不存在，将返回 `null`。

如果要按条件来选择，则可以使用 `where` 静态方法。例如，如果要查找所有积分大于 50 的用户，可以：

```php
$users = User::find('score', '>', 50)->get();
```

这将返回所有符合条件的用户的集合（关于集合详见 [Laravel 文档](https://laravel-china.org/docs/laravel/5.8/eloquent-collections/1405)）。如果没有找到符合条件的用户，它将返回一个空集合。调用 `isEmpty` 方法可以判断是否为空集合：

```php
$users->isEmpty();
```

如果按条件查询的过程中，比较操作符为「=」，可以直接省略第二个参数。例如，下面是查找邮箱地址为 `a@b.c` 的用户：

```php
$user = User::where('email', 'a@b.c')->first();
```

由于 `where` 方法总是返回一个集合，但邮箱地址在数据表中是唯一的，因此这个集合往往只有一个元素。所以在上面的例子中，我们调用了 `first` 方法而不是 `get` 方法，它表示获取集合中的第一个元素。

### 更新模型数据

在获取到一个模型实例后，我们可以更新模型实例上的数据。例如，我们要更改某个用户的邮箱地址为 `a@b.c`：

```php
$user->email = 'a@b.c';
$user->save();
```

最后的 `save` 方法是为了将改动保存到数据库。

### 添加模型

如果要添加一个模型，只需要构造一个模型实例，然后修改数据，最后保存即可。不过下面的例子仅作演示，实际可能无法运行，因为我们没有将所有字段的信息都写上。注意，对于自增的主键，不需要由我们手动填写。

```php
// 创建一个新的用户模型实例
$user = new User();
$user->email = 'a@b.c';
$user->nickname = 'abc';
$user->save();
```

## `User` 模型

`User`  模型代表的是用户，模型实例上记录的是用户的数据。`User` 模型在数据表中的主键为 `uid`，是个自增的整数字段，因此您不能去修改一个用户的 `uid`，因为它是唯一标识。

下面将介绍 `User` 模型上各个数据属性的含义。

### `uid`

这代表每个用户的唯一标识，您不能去修改这个属性的值。同时因为它是唯一标识，因此一个 `uid` 对应一个用户。

### `email`

这代表的是用户的邮箱地址。这个属性可以被修改。用户的邮箱地址在数据表中也是唯一的，但它不能代替 `uid`。

### `nickname`

这代表的是用户的昵称。这个属性可以被修改。通常来说，这个字段没什么实际的用户，一般只是为了在页面中能够以更友好的方式去显示用户。`nickname` 字段是在数据表中是允许重复的。

### `score`

这代表的是用户的积分，类型为整数。

### `avatar`

这代表的是用户的头像，值为头像所对应材质的 `tid`，默认为 `0`（即没有设置头像）。

### `password`

这个字段存储的是 hashed 之后的用户密码。

### `ip`

这个字段记录的是用户注册时的 IP 地址。这个 IP 地址被用于防止同一个 IP 地址多次注册账号。大多数插件用不到这个字段。

### `permission`

这个字段记录的是用户的权限级别，类型为整数。目前可以有四种值：

- 被封禁 - 值为 `-1`，您也可以用枚举值 `User::BANNED` 来表示
- 正常 - 值为 `1`，您也可以用枚举值 `User::NORMAL` 来表示
- 管理员 - 值为 `1`，您也可以用枚举值 `User::ADMIN` 来表示
- 超级管理员 - 值为 `2`，您也可以用枚举值 `User::SUPER_ADMIN` 来表示

### `last_sign_at`

记录了上次签到的时间。

### `register_at`

记录了用户注册的时间。大多数插件用不到这个字段。

### `verified`

这个字段记录的是邮箱地址是否已被验证。大多数插件用不到这个字段。

### `verification_token`

这个字段的值被用在进行邮箱地址验证时的校对。从 Blessing Skin v4 起，这个字段已被废弃。大多数插件用不到这个字段。

### `remember_token`

这个字段用于标识用户的登录时，是否开启了「记住我」的选项。从 Blessing Skin v4 起才有这个字段。大多数插件用不到这个字段。

---

下面介绍 `User` 模型实例上的方法。

### `isAdmin`

获取「该用户是否为管理员」的信息。

参数：无

返回值：类型为 `bool`，表示该用户是否管理员。（超级管理员也属于管理员）

### `verifyPassword`

检查密码是否正确。

参数：

- `rawPassword` - 用于进行对比的原始密码（即还没有 hash 过的密码）

返回值：类型为 `bool`，表示密码是否正确。

### `getEncryptedPwdFromEvent`

触发 `EncryptUserPassword` 事件，然后获取触发事件后由监听器返回的密码。通常插件不会用到这个方法。

参数：

- `password` - 原始密码
- `user` - 类型为 `App\Models\User`，为该用户的模型实例

返回值：可能为一个 Laravel `Response`，也可能为 `null`

### `changePassword`

更改用户的密码。通常插件不会用到这个方法。

参数：

- `password` - 未 hash 过的新密码

返回值：类型为 `bool`，表明是否成功更改密码。

## `Player` 模型

`Player` 模型代表的是角色，每个模型实例上都记录着一个角色的信息。`Player` 模型在数据库中的主键是 `pid`，是个自增的整数字段，因此您不能去修改一个用户的 `pid`，因为它是唯一标识。

下面将介绍 `Player` 模型上各个数据属性的含义。

### `pid`

这代表每个角色的唯一标识，您不能去修改这个属性的值。同时因为它是唯一标识，因此一个 `pid` 对应一个角色。

### `uid`

这个字段记录的是角色的拥有者的 `uid`。

### `name`

这个字段记录的是角色名。

### `tid_skin`

这个字段记录的是该角色上皮肤所对应的材质的 `tid`。

### `tid_cape`

这个字段记录的是该角色上披风所对应的材质的 `tid`。

### `last_modified`

这个字段记录的是角色上次修改信息的时间。这个字段的值更多的是被皮肤 mod 使用，而插件很少用到这个字段。

---

下面介绍 `Player` 模型实例上的一些方法。

### `isBanned`

返回该角色的拥有者是否被封禁的情况。

参数：无

返回值：类型为 `bool`，表明用户是否被封禁。

### `getTexture`

返回该角色上的材质的 hash。

参数：

- `type` - 材质的类型，可以是 `skin`、`steve`、`alex` 和 `cape`。当这个参数的值为 `skin` 时，会先获取角色上的偏好模型，然后根据这个模型去返回材质，其它情况都是直接按照参数中指定的类型去返回材质。

返回值：类型为 `string`，为材质的 `hash` 值。

```php
$player->getTexture('steve');  // 返回 Steve 皮肤模型对应的材质 hash
```

### `getJsonProfile`

获取角色的 JSON Profile 信息。通常插件不会用到这个方法。

参数：

- `api_type` - 类型为 `int`，代表 API 类型。当这个参数的值为 `0` 时表示 CustomSkinLoader API，为 `1` 时表示 Universal Skin Mod API。

返回值：类型为 `string`，是一个 JSON 字符串。

### `generateJsonProfile`

生成角色的 JSON Profile 字符串。

参数：

- `api_type` - 类型为 `int`，代表 API 类型。当这个参数的值为 `0` 时表示 CustomSkinLoader API，为 `1` 时表示 Universal Skin Mod API。

返回值：类型为 `string`，是一个 JSON 字符串。

### `updateLastModified`

更新 `last_modified` 字段的值，即更新「上次修改时间」。调用此方法会触发 `PlayerProfileUpdated` 事件。

参数：无

返回值：无

## `Texture` 模型

`Texture`  模型代表的是材质，模型实例上记录的是每个材质的数据。`Texture` 模型在数据表中的主键为 `tid`，是个自增的整数字段，因此您不能去修改一个材质的 `tid`，因为它是唯一标识。

下面将介绍 `Texture` 模型上各个数据属性的含义。

### `tid`

这代表每个材质的唯一标识，您不能去修改这个属性的值。同时因为它是唯一标识，因此一个 `tid` 对应一个材质。

### `name`

这个字段记录的是材质的名称。

### `type`

这个字段记录的是材质的类型。它只能是 `steve` 或 `alex` 或 `cape`。

### `hash`

这个字段记录的是材质文件的 hash 值，它是唯一的（除非 hash 算法出现了碰撞）。

### `size`

这个字段记录的是材质文件的大小，单位是 `KB`。

### `uploader`

这个字段记录的是材质上传者的 `uid`。它允许指向不存在的用户，但字段在数据库中不能为空。

### `public`

这个字段表明材质是否为公开材质。注意，这个字段在数据库中的记录可能是以数字的形式存储（即 `0` 或 `1`），但实际在代码中取出这个属性时，它会被自动转换成 `bool` 型。

### `upload_at`

这个字段记录的是材质的上传时间。

---

下面介绍 `Texture` 模型实例上的一些方法。

### `setPrivacy`

修改材质的公开性。

参数：

- `public` - 类型为 `bool`，表明这个材质是否可以公开。

返回值：类型为 `bool`，表示是否更改成功。

```php
$texture->setPrivacy(true);   // 材质已被设置成公开
$texture->setPrivacy(false);  // 材质已被设置成私有
```

## 模型与模型之间的联系

### 关联

用户与角色是的关系是「一对多」，即一个用户可以拥有多个角色。如果我们已经拿到了一个用户的模型实例，现在要获取该用户的全部角色实例，那么可以这样写：

```php
$players = $user->players;
```

反过来，我们可以通过一个角色来查找它的拥有者，像这样：

```php
$owner = $player->user;
```

就这样，您就不必手动通过 `uid` 或 `pid` 来查找：

```php
// 没必要像下面这么干！
$uid = $user->uid;
$players = Player::where('uid', $uid)->get();
```

### 注意

像上面所展示的通过读取属性的方法将会获取用户的全部角色实例，如果您要按条件筛选或进行其它操作，那么您应该调用它们的方法而不是属性。例如，如果要查找某用户全部角色中模型为 `slim` 的角色，那么您应该这么写：

```php
$players = $user->players()->where('preference', 'slim');
```

更多关于模型关联的资料，可访问 [Laravel 文档](https://laravel-china.org/docs/laravel/5.8/eloquent-relationships/1404)。
