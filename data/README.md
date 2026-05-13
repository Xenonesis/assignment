# Dataset

Place the assignment dataset at:

```text
data/jsondata.json
```

Then run:

```bash
npm run import:data
```

The importer cleans numeric values, timestamps, empty strings, and duplicate `url + title` records before inserting into Supabase.
