---
title: 数据与模型
---

# {{ $page.title }}

[[toc]]

## 简介

Blessing Skin 中的每个模型都与数据库的数据表有联系，而每个模型实例都相当于数据表中的一行（row）数据。Blessing Skin 中有四个模型，除了 `Closet` 模型，其它的三个都是 Laravel Eloquent ORM 模型。如果要获取关于 Laravel Eloquent ORM 的更多信息，建议阅读 [Laravel 文档](https://laravel-china.org/docs/laravel/5.6/eloquent/1403)。

目前 Blessing Skin 中共有四个模型，分别是 `User`、`Player`、`Texture` 和 `Closet`，它们均位于 `App\Models` 下。我们将会分别详细介绍这四个模型，并在最后讲述这些模型之间的关联，以及如何利用这些关联来简化代码。

值得注意的是，所有的 Laravel Eloquent ORM 模型（即除了 `Closet` 以外的模型），都继承于 `Illuminate\Database\Eloquent\Model`，通过此来拥有 Eloquent ORM 的特性。即使这些模型的类上没有声明属性，您依然可以访问模型实例上数据。例如，`User` 模型在数据库中对应的数据表上存在 `score` 这个字段，然而您在 `App\Models\User` 这个类中并没有看到 `score` 这个类的属性，即使这样，您还是可以像 `$user->score` 这样来获取或设置 `score` 这个字段上的值。

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

您除了可以像 `$user->score = 50;` 这样来设置之外，还可以调用 `User` 模型实例上的 `setScore` 方法来设置积分，具体用法见下文。

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

### `getCloset`

返回该用户的衣柜。

参数：无

返回值：类型为 `App\Models\Closet`。

### `verifyPassword`

检查密码是否正确。

参数：

- `rawPasswd` - 用于进行对比的原始密码（即还没有 hash 过的密码）

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

### `getPermission`

获取该用户的权限级别。

参数：无

### `setPermission`

更改该用户的权限级别。注意，调用此方法不同于直接 `$user->persmission = 0`，直接赋值不会立即更新数据库，而调用此方法会立即更新数据库。

参数：

- `permission` - 新的权限级别值

返回值：类型为 `bool`，表明是否成功更改权限级别。

```php
// 封禁该用户
$user->setPermission(User::BANNED);
// 这等同于
$user->permission = User::BANNED;
$user->save();
```

### `setEmail`

更改用户的邮箱地址。注意，调用此方法会立即更新数据库。

参数：

- `email` - 新的邮箱地址

返回值：类型为 `bool`，表明是否成功更改邮箱地址。

### `getNickName`

获取用户的昵称。

参数：无

返回值：如果用户存在昵称，则返回昵称；如果用户没有设置昵称，则返回用户的邮箱地址；如果用户不存在，则返回「用户不存在」的提示字符串。

### `setNickName`

更改用户的昵称。

参数：

- `nickname` - 新的昵称。

返回值：类型为 `bool`，表明是否成功更改昵称。

### `getScore`

获取用户的积分。

参数：无

### `setScore`

更新用户的积分。此方法既可以直接设置新的积分值，也可以设置变化的值，然后指明加减动作。

参数：

- `score` - 类型为 `int`，可以是新的积分值，也可以是积分的变化量（如果使用加减）

- `mode` - 类型为 `string`。这个参数是可选的，默认是 `set`，表示直接替换原来的积分值。如果这个参数的值为 `plus`，则在原来积分的基础上添加指定的积分（在第一个参数中指定这个值）；如果这个参数的值为 `minus`，则在原来积分的基础上减少指定的积分（在第一个参数中指定这个值）。

返回值：类型为 `bool`，表明是否成功更改积分。

```php
// 直接设置该用户的积分为 50
$user->setScore(50);

// 增加 20 分
$user->setScore(20, 'plus');

// 扣除 10 分
$user->setScore(10, 'minus');
// 也可以这样
$user->setScore(-10, 'plus');
```

### `getStorageUsed`

获取用户已使用的磁盘空间大小。

参数：无

返回值：类型为 `int`，单位为 `KB`。

### `sign`

进行签到。通常插件不会用到这个方法。

参数：无

返回值：如果用户不能签到（例如还没到可以签到的时间），则返回 `false`；如果签到成功，则返回获得的积分数。

### `getSignRemainingTime`

获取由当前到能够签到时的时间差值。

参数：无

返回值：类型为 `int`，单位为秒。

### `canSign`

获取用户是否能签到的情况。

参数：无

返回值：类型为 `bool`，表示用户在当前时刻是否能签到。

### `getLastSignTime`

获取上次签到的时间。

参数：无

返回值：类型为 `string`，为格式化后的时间。

### `getAvatarId`

获取用户头像所对应材质的 `tid`。

参数：无

返回值：材质的 `tid`

### `setAvatar`

设置用户的头像。

参数：

- `tid` - 材质的 `tid`

返回值：类型为 `bool`，表明是否成功更改密码。

### `delete`

删除用户。调用此方法时，会同时删除该用户拥有的全部角色，也删除该用户的衣柜，但该用户曾经上传过的材质*不会*被删除。

参数：无

返回值：类型为 `bool`，表明是否删除成功。

## `Player` 模型

`Player` 模型代表的是角色，每个模型实例上都记录着一个角色的信息。`Player` 模型在数据库中的主键是 `pid`，是个自增的整数字段，因此您不能去修改一个用户的 `pid`，因为它是唯一标识。

下面将介绍 `Player` 模型上各个数据属性的含义。

### `pid`

这代表每个角色的唯一标识，您不能去修改这个属性的值。同时因为它是唯一标识，因此一个 `pid` 对应一个角色。

### `uid`

这个字段记录的是角色的拥有者的 `uid`。

### `player_name`

这个字段记录的是角色名。

### `preference`

这个字段记录的是该角色的偏好模型。目前可以有两种值，分别是 `default` 和 `slim`。（分别代表 Steve 皮肤模型和 Alex 皮肤模型）

### `tid_steve`

这个字段记录的是该角色上 Steve 皮肤模型所对应的材质的 `tid`。

### `tid_alex`

这个字段记录的是该角色上 Alex 皮肤模型所对应的材质的 `tid`。

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

### `setTexture`

更改角色的材质。调用此方法时，会更新 `last_modified` 字段的值，同时触发 `PlayerProfileUpdated` 事件。

参数：

- `tids` - 这个参数是键为材质类型、值为 `tid` 的数组。

返回值：该角色模型实例本身。

```php
// 仅仅更新 Steve 皮肤模型
$player->setTexture(['steve' => 1]);

// 同时更新 Steve 皮肤模型和披风
$player->setTexture(['steve' => 1, 'cape' => 2]);
```

### `checkForInvalidTextures`

删除角色上的无效材质。调用此方法不会更新 `last_modified` 字段的值。通常插件不会用到这个方法。

参数：无

返回值：该角色模型实例本身。

### `clearTexture`

重置角色上指定类型的材质。

参数：

- `types` - 类型可以为字符串（仅仅删除一种类型的材质）或数组（删除多种类型的材质）。材质类型可以是 `steve`、`alex` 和 `cape`。

返回值：该角色模型实例本身。

```php
// 仅仅删除 Steve 皮肤模型
$player->clearTexture('steve');

// 同时删除 Steve 皮肤模型和披风
$player->clearTexture(['steve', 'cape']);
```

### `setPreference`

设置角色的偏好模型。调用此方法时，会更新 `last_modified` 字段的值，同时触发 `PlayerProfileUpdated` 事件。

参数：

- `type` - 模型类型。可以是 `default` 或 `slim`。

返回值：该角色模型实例本身。

### `getPreference`

获取角色的偏好模型。

参数：无

返回值：`default` 和 `slim`。

### `rename`

更改角色名。调用此方法时，会更新 `last_modified` 字段的值，同时触发 `PlayerProfileUpdated` 事件。

参数：

- `newName` - 新的角色名。

返回值：该角色模型实例本身。

### `setOwner`

更改角色的拥有者。调用此方法 *不会* 更新 `last_modified` 字段的值，只触发 `PlayerProfileUpdated` 事件。

参数：

- `uid` - 拥有者的 `uid`。

返回值：该角色模型实例本身。

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

### `likes`

这个字段记录的是材质被收藏的数量。类型为整数。

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

## `Closet` 模型

`Closet` 模型与上面的模型有比较大的区别。它不是继承于 `Illuminate\Database\Eloquent\Model`，因此 Laravel Eloquent ORM 上的一些特性和方法不能应用在 `Closet` 模型上。`Closet` 模型有它自己的一系列实例方法。

对于继承于 `Illuminate\Database\Eloquent\Model` 的模型，如果要取回一个模型实例，通常的做法是像 `User::find($uid)` 或 `User::where('email', $email)->first()` 这样。但 `Closet` 模型不能这样，您只能通过传统地构造一个类的方式来取回一个衣柜模型实例。

每个衣柜物品都是一个键值对数组，数组中键有 `tid`、`name`、`type` 和 `add_at`。其中 `tid` 为该材质的 `tid`；`name` 是用户将材质收藏到衣柜中时指定的名称，可以不等同于材质自身的名称；`type` 为材质类型；`add_at` 为用户将材质收藏到衣柜时的时间。

### 实例属性

`Closet` 模型实例上只有一个公开可访问的属性。这个属性是 `uid`，代表的是该衣柜对应的用户的 `uid`，但通常不应该去修改这个属性。

### 构造函数

构造函数接收一个必需的参数，为用户的 `uid`。Blessing Skin 会根据这个 `uid` 来检索该用户的衣柜。在构造 `Closet` 类时，会有以下过程：

1. 检查该用户的衣柜数据是否存在于数据库中，若不存在则初始化。
2. 取出该用户的衣柜数据。
3. 触发 `ClosetWillBeFiltered` 事件。（仅在 Blessing Skin v4 或更高版本）
4. 遍历该用户的衣柜，删除掉衣柜中已经不存在的材质以及被设置成私有但上传者不是该用户的材质。
5. 触发 `ClosetWasFiltered` 事件。（仅在 Blessing Skin v4 或更高版本）
6. 如果「删除材质后返还积分」的选项被打开，则返还相应的积分。
7. 衣柜加载完成。

### 静态方法

`Closet` 模型上有一个静态方法 `all`，它返回全部用户的衣柜信息。通常不建议您使用这个方法，因为它会查询整个 `closets` 数据表，而且您很少会有查询全部用户的衣柜这种需求。

---

下面介绍 `Closet` 模型实例上的方法。

### `getItems`

返回衣柜中的物品，可以指定分类。

参数：

- `category` - 选择要返回的分类。这个参数是可选的，默认为 `all`，表示返回所有皮肤和披风。如果指定 `skin`，则只返回全部皮肤；如果指定 `cape`，则只返回全部披风。

返回值：类型为数组，数组中的元素类型为衣柜物品（这是一个键值对数组），包含 `tid`、`name`、`type` 和 `add_at`。

```php
// 获取全部物品
$closet->getItems();

// 仅获取皮肤
$closet->getItems('skin');

// 仅获取披风
$closet->getItems('cape');
```

### `add`

添加一个材质到衣柜中。

参数：

- `tid` - 要添加的材质的 `tid`

- `name` - 名称。这个名称是在衣柜中的名称，它可以与材质自己的名称不同。

返回值：如果衣柜中已经存在该材质，则返回 `false`；否则添加成功，返回 `true`。

```php
$closet->add(1, '我刚刚收藏的');  // 添加物品到衣柜
```

### `has`

查询一个材质是否在衣柜中。

参数：

- `tid` - 要查询的材质的 `tid`

返回值：类型为 `bool`，表明材质是否在衣柜中。

```php
if ($closet->has(1)) {
    return '衣柜中有这个物品';
} else {
    return '没找到';
}
```

### `get`

查找一个衣柜物品。

参数：

- `tid` - 要查找的衣柜物品的对应材质 `tid`。

返回值：如果找到，则返回该衣柜物品；如果找不到，返回 `null`。

```php
$item = $closet->get(1);
$item['name'];    // 这是衣柜物品名称。
$item['type'];    // 这是衣柜物品类型。
$item['add_at'];  // 物品被添加时的时间。
```

### `rename`

重命名一个衣柜物品。

参数：

- `tid` - 要重命名的衣柜物品的对应材质 `tid`。

返回值：如果在衣柜中找不到该物品，则返回 `false`；否则重命名成功，返回 `true`。

```php
$closet->rename(1, '新名字');
```

### `remove`

从衣柜中移除一个物品。

参数：

- `tid` - 要删除的衣柜物品的对应材质 `tid`

返回值：如果在衣柜中找不到该物品，则舞台 `false`；否则删除成功，返回 `true`。

```php
$closet->remove(1);  // 已删除
$closet->has(1);     // 返回 false
```

### `setTextures`

直接更新该用户的衣柜。通常插件不应该直接使用这个方法，因为它会直接替换掉目前的衣柜数据。

参数：

- `textures` - 元素为衣柜物品的数组

返回值：类型为 `int`。

### `save`

将对衣柜的改动保存到数据库中。

参数：无

返回值：如果衣柜的数据有更改，则更新数据库并返回 `true`；否则返回 `false`。

## 模型与模型之间的联系

除了 `Closet` 模型之外（因为它没有继承于 `Illuminate\Database\Eloquent\Model`），其它的模型它们之间有可能存在着关联。我们可以利用这些关联来简化我们的代码。

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

更多关于模型关联的资料，可访问 [Laravel 文档](https://laravel-china.org/docs/laravel/5.6/eloquent-relationships/1404)。
