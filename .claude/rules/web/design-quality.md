# Web Design Quality Standards

> This file extends [common/patterns.md](../common/patterns.md) with web-specific design-quality guidance.

## Scope

Apply these standards to:

- User-facing main pages
- Landing pages
- Key product surfaces

Do NOT strictly enforce for:

- Admin pages
- Internal tools
- Early MVP screens

## Anti-Template Policy

Do not ship generic, template-looking UI.

### Banned Patterns

- Default card grids with uniform spacing and no hierarchy
- Stock hero section with centered headline, gradient blob, and generic CTA
- Unmodified library defaults passed off as finished design
- Flat layouts with no layering, depth, or motion
- Uniform radius, spacing, and shadows across every component
- Safe gray-on-white styling with one decorative accent color
- Dashboard-by-numbers layouts with sidebar + cards + charts and no point of view
- Default font stacks used without a deliberate reason

### Required Qualities

Meaningful frontend surfaces should demonstrate multiple of the following where appropriate.
Do not force all criteria on simple components.

1. **Hierarchy**
   1. At least 2 levels of scale contrast (e.g., title vs body)
2. Intentional rhythm in spacing, not uniform padding everywhere
3. Depth or layering through overlap, shadows, surfaces, or motion
4. Typography
   1. Use at least 2 text scales (e.g., title vs body)
   2. Avoid default font stack unless justified
5. Color used semantically, not just decoratively
6. Hover, focus, and active states that feel designed
7. Grid-breaking editorial or bento composition where appropriate
8. Texture, grain, or atmosphere when it fits the visual direction
9. Motion that clarifies flow instead of distracting from it
10. Data visualization treated as part of the design system, not an afterthought

## Before Writing Frontend Code

1. Define a clear style direction(avoid vague terms like "clean" or "modern")
2. Define a color palette intentionally
3. Choose typography deliberately
4. Review at least 2–3 real references
5. Ensure design is implementable without excessive complexity

## Worthwhile Style Directions

Choose a direction only if it aligns with product goals.

Examples:

- Editorial / magazine
- Bento layouts
- Swiss / International
- Dark or light luxury
- Scrollytelling

Do NOT apply visual trends blindly.
Do NOT default to dark mode without reason.

## Component Checklist

- [ ] Does it avoid looking like a default Tailwind or shadcn template?
- [ ] Does it have intentional hover/focus/active states?
- [ ] Does it use hierarchy rather than uniform emphasis?
- [ ] Would this look believable in a real product screenshot?
- [ ] If it supports both themes, do both light and dark feel intentional?
