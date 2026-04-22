---
name: Obsidian Neon
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#d4c0d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#9d8ba0'
  outline-variant: '#504254'
  surface-tint: '#ebb2ff'
  primary: '#ebb2ff'
  on-primary: '#520072'
  primary-container: '#bc13fe'
  on-primary-container: '#ffffff'
  inverse-primary: '#9800d0'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#ffb1c3'
  on-tertiary: '#66002c'
  tertiary-container: '#e8006e'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f8d8ff'
  primary-fixed-dim: '#ebb2ff'
  on-primary-fixed: '#320047'
  on-primary-fixed-variant: '#74009f'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#ffd9e0'
  tertiary-fixed-dim: '#ffb1c3'
  on-tertiary-fixed: '#3f0019'
  on-tertiary-fixed-variant: '#8f0041'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 4rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 2.5rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  section-padding: 120px
  card-padding: 32px
---

## Brand & Style

The design system is engineered for high-end technical narratives, targeting an audience of sophisticated stakeholders, engineers, and tech recruiters. It evokes an atmosphere of digital precision, futuristic innovation, and premium craftsmanship.

The aesthetic is a hybrid of **Glassmorphism** and **High-Contrast Neon**, rooted in a deep, "obsidian" dark mode. The interface prioritizes depth through layering, using vibrant glows to draw attention to key data points and interactive triggers. It is sleek, cinematic, and unapologetically technical.

## Colors

The palette is built on a "True Black" and "Deep Obsidian" foundation to ensure maximum contrast for neon elements. 

- **Electric Purple (Primary):** Used for primary actions, branding, and core narrative highlights.
- **Cyan (Secondary):** Used for technical data, links, and secondary interactive states.
- **Neon Pink (Tertiary):** Reserved for accent details, status indicators, or "hot" areas of interest.
- **Obsidian (Neutral):** The base background. Surfaces should utilize varying degrees of transparency rather than solid lighter greys to maintain the glass effect.

## Typography

This design system utilizes **Space Grotesk** for headlines and technical labels to reinforce a futuristic, geometric vibe. **Inter** is used for body copy to ensure maximum readability against dark backgrounds. 

Large headlines should occasionally utilize a `text-shadow` or "glow" effect matching the primary or secondary color (e.g., `0 0 20px rgba(188, 19, 254, 0.4)`). Gradient text, transitioning from Cyan to Purple, is encouraged for hero statements to create visual impact.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop, centered within a 1200px container to maintain a cinematic, focused feel. Large vertical spacing (120px+) between sections is intentional, allowing the "obsidian" background to act as a canvas that highlights the glowing glass elements.

Rhythm is based on an 8px modular scale. Component grouping should feel airy, prioritizing clarity and "breathing room" for the vibrant neon accents to shine without overwhelming the user.

## Elevation & Depth

Depth is achieved through **Glassmorphism** rather than traditional shadows. 

1.  **Backdrop Blurs:** Use `backdrop-filter: blur(12px)` on all card surfaces.
2.  **Translucent Borders:** Layers are separated by 1px solid borders at low opacity (e.g., `rgba(255, 255, 255, 0.1)`).
3.  **Neon Underglow:** High-priority cards or active states should feature a soft, colored outer glow (`box-shadow`) that mimics the reflection of neon light on a dark surface. 
4.  **Z-Axis:** Interactive elements should slightly scale up (1.02x) on hover, appearing to lift closer to the user through the "glass."

## Shapes

The shape language is modern and balanced. A `0.5rem` (rounded) base radius is used for standard buttons and inputs, while `1.5rem` (rounded-xl) is applied to large content cards. This creates a "soft-tech" feel—futuristic but accessible. Circles and pills are reserved for status tags, avatars, and timeline nodes.

## Components

### Buttons
Primary buttons use a solid gradient background (Purple to Cyan) with a white or high-contrast label. Secondary buttons use a "Ghost" style with a neon border and a subtle glow on hover.

### Glass Cards
Cards are the primary container. They feature a `background: rgba(255, 255, 255, 0.03)`, a `1px` semi-transparent border, and a `backdrop-filter`. Corner accents—small neon L-shaped brackets—can be added to card corners for an "interface" look.

### Chips & Tags
Used for "Technical Stack" items. These should be small, pill-shaped, with a subtle border matching the category color (e.g., Cyan for Frontend, Purple for Backend).

### Input Fields
Inputs are dark with a `1px` bottom border that glows when focused. Placeholder text should be low-contrast, and the cursor/caret should be a vibrant Neon Pink.

### Timeline/Progress
The "Years of Experience" or "Career Path" component uses a thick gradient line (Cyan to Purple) with glowing circular nodes at key milestones.