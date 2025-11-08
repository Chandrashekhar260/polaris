# Personal Learning AI Agent - Design Guidelines

## Design Approach

**Selected System:** Design System Approach with shadcn/ui foundation, inspired by Linear's clean productivity aesthetics and Notion's knowledge management interface.

**Rationale:** This is a utility-focused productivity tool where clarity, information density, and usability are paramount. Users need to quickly scan learning progress, understand recommendations, and track their development journey without visual distraction.

## Core Design Principles

1. **Information Clarity:** Dense data presentation without feeling overwhelming
2. **Scan-ability:** Quick visual hierarchy enables rapid comprehension
3. **Purposeful Density:** Every pixel serves the learning journey
4. **Intelligent Whitespace:** Breathing room around high-importance elements

---

## Typography

### Font Families
- Primary: Inter (via Google Fonts) - body text, UI elements, data
- Monospace: JetBrains Mono - code snippets, file paths, technical content

### Hierarchy
- Page Titles: text-3xl font-bold
- Section Headers: text-2xl font-semibold
- Card Headers: text-lg font-semibold
- Body Text: text-base font-normal
- Metadata/Labels: text-sm font-medium
- Captions: text-xs font-normal
- Code: text-sm font-mono

---

## Layout System

### Spacing Primitives
**Standardized Units:** Consistently use `2, 4, 6, 8, 12, 16` spacing units
- Component padding: p-4, p-6, p-8
- Section gaps: gap-6, gap-8
- Margins: m-4, mt-8, mb-12
- Grid gaps: gap-4 (cards), gap-6 (sections)

### Container Strategy
- Dashboard max-width: max-w-7xl
- Content sections: w-full with internal spacing
- Sidebar: fixed w-64 on desktop, full-width drawer on mobile

---

## Component Library

### Dashboard Layout
**Structure:** Sidebar navigation + Main content area

**Sidebar (w-64 fixed):**
- Logo/branding at top (h-16)
- Navigation menu items with icons (py-3 px-4)
- Active state indicator (border-l-2)
- User profile section at bottom
- Compact, always visible on desktop

**Main Content:**
- Top bar: Breadcrumb trail + action buttons (h-16, px-8)
- Content area: px-8 py-6
- Grid-based layouts for cards and widgets

### Data Cards
**Learning Activity Card:**
- Compact design: p-6 rounded-lg border
- Header with icon + title (flex justify-between)
- Content area with structured data
- Footer with timestamp (text-sm, opacity-70)
- Hover state: subtle shadow lift

**Recommendation Card:**
- Icon/thumbnail left (w-12 h-12)
- Title + description (flex-1)
- Tag badges for topics (inline-flex gap-2)
- Action button right-aligned
- Stacked on mobile, horizontal on desktop

**Progress Widget:**
- Chart area (h-64 to h-80)
- Legend below or side-aligned
- Metric callouts above (grid-cols-3)
- Uses Recharts for visualizations

### Navigation Components
**Sidebar Menu Item:**
- Icon + label horizontal layout
- py-3 px-4 spacing
- Rounded corners (rounded-md)
- Active/hover states clearly differentiated
- Icon size: w-5 h-5

**Breadcrumb:**
- Horizontal flow with separators
- Current page not clickable
- text-sm sizing
- Subtle separators (opacity-50)

### Data Display
**Topic Tags:**
- Pill-shaped badges (rounded-full px-3 py-1)
- text-xs font-medium
- Display inline-flex with gap-2
- Max 3-4 visible, "+N more" overflow

**Timeline View:**
- Vertical line connector
- Timestamp nodes with content cards
- Alternating alignment (zigzag) on desktop
- Stacked on mobile

**Stats Grid:**
- 3-4 column grid (grid-cols-1 md:grid-cols-3 lg:grid-cols-4)
- Large number display (text-4xl font-bold)
- Label below (text-sm)
- Subtle icon in corner
- p-6 spacing within each stat card

### Forms & Input
**Analysis Trigger:**
- Minimal manual input needed
- File path display (read-only, font-mono)
- Status indicators (Live monitoring badge)
- Settings panel for configuring watched directories

### Content Sections

**Dashboard Page:**
1. **Stats Overview:** 4-column grid showing: Total Sessions, Topics Learned, Current Streak, AI Recommendations
2. **Recent Activity Feed:** Timeline of last 10 analyzed files with timestamps, file names, detected topics
3. **Active Topics:** Grid of currently learning topics with progress bars
4. **Quick Recommendations:** 3 top AI-suggested resources in card format

**Recommendations Page:**
1. **Filter Bar:** Topic filter chips, difficulty selector, resource type toggles
2. **Recommendation List:** Full-width cards with rich content - resource title, description, why it's recommended, estimated time, difficulty badge
3. **Bookmarked Section:** Saved recommendations for later

**Progress Page:**
1. **Weekly Summary Card:** AI-generated narrative about learning progress
2. **Topic Mastery Chart:** Horizontal bar chart showing competency levels across topics
3. **Learning Streak Calendar:** Heatmap visualization of daily activity
4. **Struggle Areas:** Cards highlighting topics needing more focus with linked resources

### Interactive Elements
**Buttons:**
- Primary action: font-semibold, px-4 py-2, rounded-md
- Secondary: outlined variant
- Icon buttons: p-2, rounded-md
- Sizes: text-sm (compact), text-base (default)

**Loading States:**
- Skeleton screens for cards during data fetch
- Shimmer animation for placeholders
- Inline spinners for actions

---

## Page-Specific Layouts

### Dashboard (Home)
Grid-based layout with responsive columns:
- Desktop: 12-column grid, widgets span 3-6 columns
- Tablet: 6-column grid
- Mobile: Single column stack

### Recommendations
List view with generous spacing:
- Full-width cards with py-4 gap
- Sticky filter bar at top
- Infinite scroll or pagination at bottom

### Progress
Mixed layout combining charts and narrative:
- Chart sections: full-width
- Insights grid: 2-column on desktop
- Weekly summary: prominent featured card at top

---

## Accessibility & States

- Focus states: outline ring on all interactive elements
- Disabled states: reduced opacity (opacity-50)
- Error states: text indicators, no color-only communication
- Success confirmations: toast notifications (top-right position)
- Loading states: preserve layout, show skeleton placeholders

---

## Images

**Minimal Image Usage:**
- Empty state illustrations: When no learning data exists yet (small, centered, w-64 h-64)
- Topic category icons: Use icon library (Heroicons), not images
- No hero image: This is a data-focused dashboard, not a marketing page

**If illustrations are used:**
- Simple line art style
- Placed in empty states only
- Centered with explanatory text below

---

## Animation Philosophy

**Extremely Minimal:**
- Card hover: subtle shadow transition only
- Navigation: no slide/fade animations
- Charts: static, data-focused (Recharts default)
- Focus: instant feedback, no delays