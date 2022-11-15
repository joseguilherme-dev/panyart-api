# Check the Database:

At any time you can check your database using PRISMA, with the command:

```
npx prisma studio
```

You can also create, update and delete rows with it.

---


## Creating new migration after changes and aplying it:

You can simply run:

```
npx prisma migrate dev
```

## Updating database in production:

```
npx prisma db push --preview-feature
```

