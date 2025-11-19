# Freelance Simulator - Portugal 🇵🇹

Simulate your earnings and compare different fiscal regimes (Sole Trader vs Single-Person Company / Unipessoal) for freelancers working from Portugal.

**Key Features:**
- Detailed income simulation (Year, Month, Day)
- **New:** Comprehensive comparison between Sole Trader (Trabalhador Independente) and Single-Person Company (Unipessoal)
- Liquidity analysis including business expenses
- Detailed tax breakdown (IRS, Social Security, VAT)
- Visual charts and summary tables

![preview](img/preview.gif)

## Contributing

Contributions are welcome. Although I enjoy helping people with their financial burdens, I do have limited time to work on this. Feel free to open an issue or submit a pull request. If you're not sure where to start, mention me in the comments!

## Local setup (with node)

### Instal dependencies

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Tests

**vitest**

```
npm run vitest
```

**cypress end to end**

open:

```
npm run cy:e2e:open
```

run:

```
npm run cy:e2e:run
```

## Local setup (with docker)

run as dev (with auto-reload):

```
docker compose up --build -V
```

build a production image (image named as `simulador-freelance:latest`) (listening on `:80`):

```
docker build -t simulador-freelance:latest .
```

Run tests (vitest):

```
docker build -t simulador-freelance:test --target=test .
```
