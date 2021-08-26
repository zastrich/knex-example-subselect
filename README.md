# Use subselects on KNEX

This example using SQLITE and EXPRESS to show return data with subselect in Knex.

## Use this example

- Cloning the repository `git clone https://github.com/zastrich/knex-example-subselect`
- Accessing directory `cd knex-example-subselect`
- Install dependencies `yarn` or `npm install`
- Start project `yarn start` or `npm start`
- Access this URL [http://localhost:3001/store/1](http://localhost:3001/store/1) if you see an JSON return, is running (passing different /store/ID to get other results)

## Data on example DB (file /db/example.sqlite3)

### table `experiences`
| exp_id | exp_name |
| - | - |
| 1	| Fragrances |
| 2	| Hair |

### table `skus`
| sku | name |
| - | - |
| 1	| Perfum |
| 2	| Hand Cream |
| 3	| Shampoo |

### table `store`
| store_code | store_name |
| - | - |
| 1	| Discount Store |
| 2	| Popular store |

### table `store_experiences`
| store_code | exp_id |
| - | - |
| 1	| 1 |
| 1	| 2 |

### table `store_skus`
| sku | store_code |
| - | - |
| 1	| 1 |
| 2	| 1 |
| 3	| 1 |
| 1	| 2 |
| 3	| 2 |

View and change data using [https://sqlitebrowser.org/](https://sqlitebrowser.org/)

## Query executed to return data

```
knex('store')
    .select('store.store_code')
    .select('store.store_name')
    .select(knex.raw('count(store_skus.store_code) as store_skus_count'))
    .select(
      knex('store_experiences')
        .select(knex.raw('GROUP_CONCAT(store_experiences.exp_id)'))
        .where('store_experiences.store_code', knex.raw('??', 'store.store_code'))
        .groupBy('store_experiences.store_code')
        .as('store_experiences')
    )
    .leftJoin('store_skus', 'store_skus.store_code', 'store.store_code')
    .groupBy('store.store_code')
    .where('store.store_code', '=', id)
```

See commented version on code [/server.js](/server.js)