# Web Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with web-specific frontend content.

## File Organization

Organize by feature, not by type:

```text
src/
├── features/
│   ├── event/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types.ts
├── components/
│   └── ui/
├── hooks/
├── lib/
└── styles/
```

Feature-specific logic stays inside feature folder
Shared UI goes in /components/ui
Shared hooks go in /hooks

## Component Design

Use functional components only
Keep components small and focused
Split logic and UI when complex

```typescript
function EventCard({ event }: Props) {
  return <div>{event.title}</div>;
}
```

## Container vs Presentational

Separate logic and UI:

```typescript
function EventListContainer() {
  const { data, isLoading, error } = useEvents();
  return <EventList data={data} isLoading={isLoading} error={error} />;
}

function EventList({ data, isLoading, error }: Props) {
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage />;

  return <div>{data.map(...)} </div>;
}
```

## State Management

Local state → useState
Derived state → useMemo
Shared state → Context or external store
Avoid unnecessary prop drilling

## Data Fetching

Do NOT call API directly inside components
Use hooks or service layer

```typescript
function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
}
```

## Loading & Error Handling

```typescript
if (isLoading) return <Loading />;
if (error) return <ErrorMessage />;
```

Always handle loading state
Always handle error state
Never assume API success

## Event Handling

Do NOT write complex logic inline in JSX

```typescript
// BAD
<button onClick={() => doSomething(a, b, c)}>Click</button>

// GOOD
function handleClick() {
  doSomething(a, b, c);
}
<button onClick={handleClick}>Click</button>
```

## Immutability

Never mutate state
Always return new objects

```typescript
// BAD
state.items.push(newItem);

// GOOD
setItems(prev => [...prev, newItem]);
```

## Reusability

Extract reusable UI into /components/ui
Keep feature-specific components local
Avoid over-abstraction

## CSS & Styling

Use CSS variables (design tokens)
Avoid hardcoded values
Prefer utility or modular CSS

```css
:root {
  --color-primary: #000;
}
```

## Animation

Prefer: transform / opacity
Avoid: width / height / margin / padding

## Semantic HTML First

```html
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main>
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">...</h1>
  </section>
</main>
<footer>...</footer>
```

## Naming

- Components: PascalCase (`ScrollySection`, `SurfaceCard`)
- Hooks: `use` prefix (`useReducedMotion`)
- CSS classes: kebab-case or utility classes
- Variables: camelCase

## Core Rules Summary

- Functional components only
- Separate logic and UI (Container / Presentational)
- API calls must be handled in hooks only
- Always handle loading and error states
- Maintain immutability in state
- Extract reusable components
- Use semantic HTML