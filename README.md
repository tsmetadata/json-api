# JSON API Metadata Decorators

`@tsmetadata/json-api` provides a standardized set of [JSON API](https://jsonapi.org/) metadata decorators for classes in TypeScript 5.2+.

By appending metadata to specific classes, class fields, and class methods, we enable out of the box support for developer tooling like ORMs, serialization, resource governance, and more. To continue, with the JSON API decorator metadata approach, you implicitly prioritize modularity and reuse.

- [🌱 Install](#-install)
- [📋 Feature Set](#-feature-set)
- [⚙️ Usage](#️-usage)
- [😍 Full Example](#-full-example)
- [❓ FAQ](#-faq)

## 🌱 Install
```bash
npm install @tsmetadata/json-api
```

## 📋 Feature Set
We provide metadata decorators for the following concepts in the JSON API specification:
- [Resource](#resource--type)
  - [Type](#resource--type)
  - [Id](#id)
- [Attribute](#attribute)
- [Relationship](#relationship)
- [Link](#link)
- [Meta](#meta)

## ⚙️ Usage
### [Resource / Type](https://jsonapi.org/format/#document-resource-objects)
The `@Resource(type: string)` decorator is available and will define a resource's `type` (part of identification).

ex.
```typescript
import { Resource } from '@tsmetadata/json-api';

@Resource('users')
class User {}
```

### [Id](https://jsonapi.org/format/#document-resource-object-identification)
The `@Id()` decorator can be applied to one class field and denotes what field contains a resource's `id` (part of identification).

ex.
```typescript
import { Id } from '@tsmetadata/json-api';

class Account {
  @Id()
  accountNumber: string;
}
```

The applied metadata can be retrieved using the Symbol `idSymbol` export.
```typescript
import { idSymbol } from '@tsmetadata/json-api';
```

### [Attribute](https://jsonapi.org/format/#document-resource-object-attributes)
The `@Attribute()` decorator can be applied to many class fields and denotes what fields are resource attributes.

ex.
```typescript
import { Attribute } from '@tsmetadata/json-api';

class Account {
  @Attribute()
  isPastDue: boolean;
}
```

The applied metadata can be retrieved using the Symbol `attributesSymbol` export.
```typescript
import { attributesSymbol } from '@tsmetadata/json-api';
```


### [Relationship](https://jsonapi.org/format/#document-resource-object-relationships)
The `Relationship(foreignKey: string)` decorator can be applied many times to many class fields and denotes what fields are resource relationships.

The foreign key is type-safe to the field type.

ex.
```typescript
import { Relationship } from '@tsmetadata/json-api';

class Account {
  @Relationship('accounts')
  primaryDebtor: Customer;

  @Relatioship('accounts')
  coDebtors: Customer[];
}

class Customer {
  @Relationship('primaryDebtor')
  @Relationship('coDebtors')
  accounts: Account[];
}
```

The applied metadata can be retrieved using the Symbol `relationshipsSymbol` export.
```typescript
import { relationshipsSymbol } from '@tsmetadata/json-api';
```

### [Link](https://jsonapi.org/format/#document-resource-object-related-resource-links)
The `Link()` decorator can be applied to many class fields and denotes what fields are resource links.

ex.
```typescript
import { Link } from '@tsmetadata/json-api';

class Account {
  @Link()
  self: string;

  @Link()
  recentTransactions: string;
}
```

The applied metadata can be retrieved using the Symbol `linksSymbol` export.
```typescript
import { linksSymbol } from '@tsmetadata/json-api';
```

### [Meta](https://jsonapi.org/format/#document-meta)
The `Meta()` decorator can be applied to many class fields and denotes what fields are resource metadata.

ex.
```typescript
import { Meta } from '@tsmetadata/json-api';

class Account {
  @Meta()
  createdAt: number;

  @Meta()
  lastUpdated: number;
}
```

The applied metadata can be retrieved using the Symbol `metaSymbol` export.
```typescript
import { metaSymbol } from '@tsmetadata/json-api';
```

## 😍 Full Example
```typescript
import { Attribute, Link, Meta, Relationship, Resource } from '../json-api'

@Resource('accounts')
export class Account {
  @Attribute()
  accountNumber: string;

  @Attribute()
  pastDue: boolean;

  @Relationship('accounts')
  primaryDebtor: Customer;

  @Relationship('accounts')
  coDebtors: Customer[];

  @Link()
  self: string;

  @Meta()
  lastUpdated: number;
}

@Resource('customers')
export class Customer {
  @Attribute()
  name: string;

  @Relationship('primaryDebtor')
  @Relationship('coDebtors')
  accounts: Account[];

  @Link()
  self: string;
}
```

## ❓ FAQ

### Q: I'm using a legacy runtime that doesn't yet support the metadata Symbol.
A: You may be able to take advantage of our `Symbol.metadata` polyfill found [here](https://github.com/tsmetadata/polyfill).