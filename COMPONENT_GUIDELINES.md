# Component Development Guidelines

## General Principles

### 1. File Organization
```
ComponentName/
├── ComponentName.tsx      # Main component file
├── ComponentName.module.css # Component-specific styles
└── index.ts              # Export statement
```

### 2. TypeScript Requirements
- Always use TypeScript (`.tsx` for components with JSX, `.ts` for utilities)
- Define explicit interfaces for props
- Use generic types when appropriate
- Enable strict mode in tsconfig.json

### 3. Component Structure
```typescript
interface ComponentProps {
  // Define all props with explicit types
  title: string;
  items: Item[];
  onAction?: (id: string) => void;
  className?: string;
}

export function ComponentName({
  title,
  items,
  onAction,
  className = ''
}: ComponentProps) {
  // Component logic

  return (
    <div className={`component-name ${className}`}>
      {/* JSX content */}
    </div>
  );
}
```

### 4. Styling Conventions
- Use CSS Modules for component-scoped styles
- Follow BEM-like naming convention
- Prefer Tailwind utility classes for common patterns
- Use CSS custom properties for theming

### 5. Performance Best Practices
- Use React.memo for expensive components
- Implement proper key props in lists
- Use useCallback and useMemo hooks appropriately
- Lazy load heavy components when possible

## Agent Component Guidelines

### AgentLayer Component
- Must implement proper error boundaries
- Should handle loading states gracefully
- Must include accessibility features
- Should provide real-time feedback

### Task Components
- Must display task status clearly
- Should support task cancellation
- Must handle task dependencies
- Should provide progress indicators

### Tool Components
- Must validate input parameters
- Should handle tool failures gracefully
- Must implement proper timeout logic
- Should provide usage metrics

## Testing Guidelines

### Unit Tests
- Test all component states
- Mock external dependencies
- Test user interactions
- Cover error scenarios

### Integration Tests
- Test component interactions
- Test data flow between components
- Test with real agent implementations
- Test error propagation

## Documentation Requirements

### Component Documentation
Each component must include:
1. JSDoc comment describing purpose and usage
2. Prop interface documentation
3. Example usage code
4. Accessibility notes

### Storybook Stories
Create stories for:
1. Default state
2. Loading states
3. Error states
4. Edge cases
5. Accessibility testing
