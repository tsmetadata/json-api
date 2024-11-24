# JSON API Metadata Decorators

`@tsmetadata/json-api` provides a standardized set of [JSON:API](https://jsonapi.org/) metadata decorators for classes in TypeScript 5.2+.

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
- [🏷️ Metadata Decorators](#metadata-decorators)
  - [Resource](#resource--type)
    - [Type](#resource--type)
    - [Id](#id)
  - [Attribute](#attribute)
  - [Relationship](#relationship)
  - [Link](#link)
  - [Meta](#meta)
- [📄 Serializers](#serializers)
  - [Resource Object](#resource-object)
  - [Relationship Object](#relationship-object)
  - [Included Resource Objects](#included-resource-objects)
- [📄 Deserializers](#deserializers)
  - [Resource Object](#resource-object)
- [✨ Types](#types)
  - [Attributes Object](#attributes-object)
  - [Error Object](#error-object)
  - [JSON API Object](#json-api-object)
  - [Link Object](#link-object)
  - [Links Object](#links-object)
  - [Meta Object](#meta-object)
  - [Pagination Links](#pagination-links)
  - [Relationship Object](#relationship-object)
  - [Relationships Object](#relationships-object)
  - [Resource Identifier Object](#resource-identifier-object)
  - [Resource Linkage](#resource-linkage)
  - [Resource Object](#resource-object-1)
  - [Top Level Object](#top-level-object)

## ⚙️ Usage
### Metadata Decorators
#### [Resource / Type](https://jsonapi.org/format/#document-resource-objects)
The `@Resource(type: string)` decorator is available and will define a resource's `type` (part of identification).

ex.
```typescript
import { Resource } from '@tsmetadata/json-api';

@Resource('users')
class User {}
```

#### [Id](https://jsonapi.org/format/#document-resource-object-identification)
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

#### [Attribute](https://jsonapi.org/format/#document-resource-object-attributes)
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


#### [Relationship](https://jsonapi.org/format/#document-resource-object-relationships)
The `Relationship(foreignKey: string)` decorator can be applied many times to many class fields and denotes what fields are resource relationships.

The foreign key is type-safe to the field type.

ex.
```typescript
import { Relationship, type JSONAPIResourceLinkage } from '@tsmetadata/json-api';

class Account {
  @Relationship('accounts')
  primaryDebtor: Customer | JSONAPIResourceLinkage;

  @Relationship('accounts')
  coDebtors: Customer[] | JSONAPIResourceLinkage;
}

class Customer {
  @Relationship('primaryDebtor')
  @Relationship('coDebtors')
  accounts: Account[] | JSONAPIResourceLinkage;
}
```

The applied metadata can be retrieved using the Symbol `relationshipsSymbol` export.
```typescript
import { relationshipsSymbol } from '@tsmetadata/json-api';
```

#### [Link](https://jsonapi.org/format/#document-resource-object-related-resource-links)
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

#### [Meta](https://jsonapi.org/format/#document-meta)
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

### Serializers
#### Resource Object
The `serializeResourceObject(classInstance: object)` function will produce a [resource object](https://jsonapi.org/format/#document-resource-objects) from a decorated class instance.

ex.
```typescript
import { Resource, Id, Attribute, serializeResourceObject } from '@tsmetadata/json-api';

@Resource('users')
class User {
  @Id()
  customerId: string;

  @Attribute()
  active: boolean;
}

const user = new User();
user.customerId = '123';
user.active = false;

serializeResourceObject(user);

/*
  {
    "type": "users".
    "id": "123",
    "attributes": {
      "active": false
    }
  }
*/
```

#### Relationship Object
The `serializeRelationshipObject(classInstance: object)` function will produce a (relationship object)[https://jsonapi.org/format/#document-resource-object-relationships] from a decorated class instance.

ex.
```typescript
import { Resource, Id, Link, serializeRelationshipObject } from '@tsmetadata/json-api';

@Resource('users')
class User {
  @Id()
  customerId: string;

  @Link()
  self: string;
}

const user = new User();
user.customerId = '123';
user.self = 'some-link';

serializeRelationshipObject(user);

/*
  {
    "data": {
      "type": "users",
      "id": "123"
    },
    "links": {
      "self": "some-link"
    }
  }
*/
```

#### Included Resource Objects
The `serializeResourceObject(classInstance: object, keys: string[])` function will produce an array of [resource objects](https://jsonapi.org/format/#document-resource-objects) from a decorated class instance.

ex.
```typescript
import { Resource, Id, Link, serializeIncludedResourceObjects, type JSONAPIResourceLinkage } from '@tsmetadata/json-api';

// For the sake of brevity, the `Account` class definition is not included.

@Resource('users')
class User {
  @Id()
  customerId: string;

  @Relationship('primaryDebtor')
  @Relationship('coDebtors')
  accounts: Account[] | JSONAPIResourceLinkage;

  @Relationship('spouse')
  spouse: User | JSONAPIResourceLinkage;
}

const user1 = new User();
user1.customerId = '123';
user1.accounts = [someAccount, someOtherAccount];

const user2 = new User();
user2.customerId = '456';
user2.accounts = [someAccount, someOtherAccount];

serializeIncludedResourceObjects(user1, ['accounts', 'spouse']);
```

### Deserializers

### Resource Object
The `serializeResourceObject(classInstance: object)` function will produce a [resource object](https://jsonapi.org/format/#document-resource-objects) from a decorated class instance.

ex.
```typescript
import { Resource, Id, Attribute, serializeResourceObject, deserializeResourceObject } from '@tsmetadata/json-api';

@Resource('users')
class User {
  @Id()
  customerId: string;

  @Attribute()
  active: boolean;
}

const user = new User();
user.customerId = '123';
user.active = false;

const serializedUser = serializeResourceObject(user);

/*
  {
    "type": "users".
    "id": "123",
    "attributes": {
      "active": false
    }
  }
*/

const deserializedUser = deserializeResourceObject(user, User);

/*
  user.customerId === '123'
  user.active === false
*/
```

### Types

#### Attributes Object

- [Specification](https://jsonapi.org/format/#document-resource-object-attributes)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/attributesObject.ts)

ex.
```typescript
import type { JSONAPIAttributesObject } from '@tsmetadata/json-api';
```

#### Error Object

- [Specification](https://jsonapi.org/format/#error-objects)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/errorObject.ts)

ex.
```typescript
import type { JSONAPIErrorObject } from '@tsmetadata/json-api';
```

#### JSON API Object

- [Specification](https://jsonapi.org/format/#document-jsonapi-object)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/jsonApiObject.ts)

ex.
```typescript
import type { JSONAPIObject } from '@tsmetadata/json-api';
```

#### Link Object

- [Specification](https://jsonapi.org/format/#document-links-link-object)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/linkObject.ts)

ex.
```typescript
import type { JSONAPILinkObject } from '@tsmetadata/json-api';
```

#### Links Object

- [Specification](https://jsonapi.org/format/#document-links-link-object)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/linksObject.ts)

ex.
```typescript
import type { JSONAPILinksObject } from '@tsmetadata/json-api';
```

#### Meta Object

- [Specification](https://jsonapi.org/format/#document-meta)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/metaObject.ts)

ex.
```typescript
import type { JSONAPIMetaObject } from '@tsmetadata/json-api';
```

#### Pagination Links

- [Specification](https://jsonapi.org/format/#fetching-pagination)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/paginationLinks.ts)

ex.
```typescript
import type { JSONAPIPaginationLinks } from '@tsmetadata/json-api';
```

#### Relationship Object

- [Specification](https://jsonapi.org/format/#document-resource-object-relationships)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/relationshipObject.ts)

ex.
```typescript
import type { JSONAPIRelationshipObject } from '@tsmetadata/json-api';
```

#### Relationships Object

- [Specification](https://jsonapi.org/format/#document-resource-object-relationships)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/relationshipsObject.ts)

ex.
```typescript
import type { JSONAPIRelationshipsObject } from '@tsmetadata/json-api';
```

#### Resource Identifier Object

- [Specification](https://jsonapi.org/format/#document-resource-identifier-objects)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/resourceIdentifierObject.ts)

ex.
```typescript
import type { JSONAPIResourceIdentifierObject } from '@tsmetadata/json-api';
```

#### Resource Linkage

- [Specification](https://jsonapi.org/format/#document-resource-object-linkage)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/resourceLinkage.ts)

ex.
```typescript
import type { JSONAPIResourceLinkage } from '@tsmetadata/json-api';
```

#### Resource Object

- [Specification](https://jsonapi.org/format/#document-resource-objects)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/resourceObject.ts)

ex.
```typescript
import type { JSONAPIResourceObject } from '@tsmetadata/json-api';
```

#### Top Level Object

- [Specification](https://jsonapi.org/format/#document-top-level)
- [Definition](https://github.com/tsmetadata/json-api/blob/main/src/types/topLevelObject.ts)

ex.
```typescript
import type { JSONAPITopLevelObject } from '@tsmetadata/json-api';
```

## 😍 Full Example
```typescript
import { Attribute, Link, Meta, Relationship, Resource, serializeIncludedResourceObjects,
         serializeResourceObject, deserializeResourceObject, type JSONAPIResourceLinkage } from '@tsmetadata/json-api';

@Resource('accounts')
export class Account {
  @Attribute()
  accountNumber: string;

  @Attribute()
  pastDue: boolean;

  @Relationship('accounts')
  primaryDebtor: Customer | JSONAPIResourceLinkage;

  @Relationship('accounts')
  coDebtors: Customer[] | JSONAPIResourceLinkage;

  @Link()
  self: string;

  @Meta()
  lastUpdated: number;
}

@Resource('customers')
export class Customer {
  @Id()
  id: string;

  @Attribute()
  name: string;

  @Relationship('primaryDebtor')
  @Relationship('coDebtors')
  accounts: Account[] | JSONAPIResourceLinkage;

  @Link()
  self: string;
}

const account = new Account();
account.accountNumber = '123';
account.pastDue = false;
account.coDebtors = [];
account.self = 'some-url';
account.lastUpdated = Date.now();

const customer = new Customer();
customer.id = '456';
customer.name = 'Bob';
customer.self = 'some-url';

account.primaryDebtor = customer;
customer.accounts = [account];

const serializedCustomer = serializeResourceObject(customer);

// Try logging out the results on your own!
console.log(
  serializedCustomer,
  serializeRelationshipObject(customer),
  serializeIncludedResourceObjects(customer, ['accounts'])
);

// You can deserialize too!
const customerWithResourceLinkages = deserializeResourceObject(serializedCustomer, Customer);
```

## ❓ FAQ

### Q: I'm using a legacy runtime that doesn't yet support Symbol metadata.
A: You may be able to take advantage of our `Symbol.metadata` polyfill found [here](https://github.com/tsmetadata/polyfill).
