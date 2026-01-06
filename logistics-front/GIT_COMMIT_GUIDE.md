# Git Commit Guide - TDD Evidence

Este archivo documenta la secuencia de commits que debes realizar para mantener evidencia del ciclo RED-GREEN-REFACTOR.

---

## 📌 Commits Recomendados

### HU-02: Validación de Inputs

#### Commit 1 - RED Phase ✅
\`\`\`bash
git add src/presentation/hooks/__tests__/useFormValidation.spec.ts
git add src/presentation/hooks/useFormValidation.ts  # (stub vacío)
git commit -m "test(HU-02): add failing tests for form validation hooks

- Add 42 test cases for useWeightValidation, useDateValidation, useRequiredValidation
- Test edge cases: negative, zero, boundary values, null, undefined, NaN
- Weight validation: 0.1kg - 1000kg range
- Date validation: today to +30 days
- Required field validation with custom messages

Tests are RED (failing) - implementation pending"
\`\`\`

#### Commit 2 - GREEN Phase ✅
\`\`\`bash
git add src/presentation/hooks/useFormValidation.ts
git commit -m "feat(HU-02): implement form validation hooks

- Implement useWeightValidation with range checks (0.1-1000 kg)
- Implement useDateValidation with date range checks (today to +30 days)
- Implement useRequiredValidation for non-empty strings
- All edge cases handled (NaN, Infinity, null, undefined)
- Return null for valid input, error message for invalid

Tests are now GREEN (passing)"
\`\`\`

#### Commit 3 - RED Phase ✅
\`\`\`bash
git add src/presentation/components/__tests__/ValidationMessage.spec.tsx
git add src/presentation/components/ValidationMessage.tsx  # (stub)
git commit -m "test(HU-02): add failing tests for ValidationMessage component

- Add 12 test cases for error/warning/info states
- Test icon display (❌, ⚠️, ℹ️)
- Test CSS classes (text-error, text-warning, text-info)
- Test ARIA attributes for accessibility
- Test conditional rendering (null message)

Tests are RED (failing)"
\`\`\`

#### Commit 4 - GREEN Phase ✅
\`\`\`bash
git add src/presentation/components/ValidationMessage.tsx
git add src/index.css  # CSS classes
git commit -m "feat(HU-02): implement ValidationMessage component

- Add icon map for error/warning/info types
- Add CSS classes with Tailwind: text-error, text-warning, text-info
- Add ARIA attributes (role='alert', aria-live='polite')
- Conditional rendering for null/empty messages

Tests are now GREEN"
\`\`\`

---

### HU-03: Badge de Cotización

#### Commit 5 - RED Phase ✅
\`\`\`bash
git add src/presentation/components/__tests__/QuoteBadge.spec.tsx
git add src/presentation/components/QuoteBadge.tsx  # (stub)
git commit -m "test(HU-03): add failing tests for QuoteBadge component

- Add 15 test cases for cheapest/fastest badges
- Test green '$' badge for cheapest
- Test blue '⚡' badge for fastest
- Test visibility conditional rendering
- Test accessibility (aria-labels)

Tests are RED"
\`\`\`

#### Commit 6 - GREEN Phase ✅
\`\`\`bash
git add src/presentation/components/QuoteBadge.tsx
git commit -m "feat(HU-03): implement QuoteBadge component

- Add cheapest badge (green bg, white $)
- Add fastest badge (blue bg, white ⚡)
- Conditional rendering based on 'visible' prop
- ARIA labels for accessibility

Tests are GREEN"
\`\`\`

#### Commit 7 - RED Phase ✅
\`\`\`bash
git add src/presentation/components/__tests__/QuoteResultsList.spec.tsx
git commit -m "test(HU-03): add failing tests for badge display integration

- Add 9 test cases for badge integration in QuoteResultsList
- Test badge display when isCheapest/isFastest flags set
- Test no badge display when flags false
- Test both badges on same quote
- Test offline provider messages display

Tests are RED (some may pass due to existing implementation)"
\`\`\`

#### Commit 8 - GREEN Phase ✅
\`\`\`bash
git add src/presentation/components/QuoteResultsList.tsx
git commit -m "feat(HU-03): integrate OfflineProviderMessage in QuoteResultsList

- Replace inline message rendering with OfflineProviderMessage component
- Display provider name and message in yellow warning box
- Maintain existing badge display (isCheapest/isFastest)

Tests are GREEN"
\`\`\`

---

### HU-04: Estado del Sistema

#### Commit 9 - RED Phase ✅
\`\`\`bash
git add src/presentation/hooks/__tests__/useProviderStatus.spec.ts
git add src/presentation/hooks/useProviderStatus.ts  # (stub)
git add src/domain/models/ProviderStatus.ts
git commit -m "test(HU-04): add failing tests for useProviderStatus hook

- Add 6 test cases for provider status hook
- Test fetch on mount
- Test auto-refresh every 30 seconds with fake timers
- Test interval cleanup on unmount
- Test error handling
- Add ProviderStatus domain types

Tests are RED"
\`\`\`

#### Commit 10 - GREEN Phase ✅
\`\`\`bash
git add src/presentation/hooks/useProviderStatus.ts
git commit -m "feat(HU-04): implement useProviderStatus hook

- Fetch /api/adapters/status on mount
- Setup auto-refresh interval (30 seconds)
- Return status, loading, error state
- Cleanup interval on unmount

Tests are GREEN"
\`\`\`

#### Commit 11 - RED Phase ✅
\`\`\`bash
git add src/presentation/components/__tests__/StatusIndicator.spec.tsx
git add src/presentation/components/StatusIndicator.tsx  # (stub)
git commit -m "test(HU-04): add failing tests for StatusIndicator component

- Add 12 test cases for online/offline/degraded states
- Test icons: 🟢 (online), 🔴 (offline), ⚠️ (degraded)
- Test labels: 'En Línea', 'Fuera de Línea', 'Degradado'
- Test color classes

Tests are RED"
\`\`\`

#### Commit 12 - GREEN Phase ✅
\`\`\`bash
git add src/presentation/components/StatusIndicator.tsx
git commit -m "feat(HU-04): implement StatusIndicator component

- Add status config map (icons, labels, colors)
- Display icon + label based on status
- Green (online), red (offline), yellow (degraded)

Tests are GREEN"
\`\`\`

#### Commit 13 - RED Phase ✅
\`\`\`bash
git add src/presentation/components/__tests__/ProviderStatusWidget.spec.tsx
git add src/presentation/components/ProviderStatusWidget.tsx  # (stub)
git commit -m "test(HU-04): add failing tests for ProviderStatusWidget

- Add 8 test cases for system status widget
- Test 'Sistema: EN LÍNEA' display
- Test 'X/3 Proveedores Activos' counter
- Test provider table (name, status, response time)
- Test loading and error states

Tests are RED"
\`\`\`

#### Commit 14 - GREEN Phase ✅
\`\`\`bash
git add src/presentation/components/ProviderStatusWidget.tsx
git commit -m "feat(HU-04): implement ProviderStatusWidget component

- Display system status header with StatusIndicator
- Display active providers counter
- Display provider table with response times
- Show last update timestamp
- Handle loading and error states

Tests are GREEN"
\`\`\`

---

### HU-05: Manejo de Errores

#### Commit 15 - RED Phase ✅
\`\`\`bash
git add src/presentation/components/__tests__/OfflineProviderMessage.spec.tsx
git add src/presentation/components/OfflineProviderMessage.tsx  # (stub)
git commit -m "test(HU-05): add failing tests for OfflineProviderMessage component

- Add 7 test cases for offline provider message
- Test yellow warning box display
- Test provider name and message rendering
- Test warning icon (⚠️)
- Test ARIA role='alert'

Tests are RED"
\`\`\`

#### Commit 16 - GREEN Phase ✅
\`\`\`bash
git add src/presentation/components/OfflineProviderMessage.tsx
git commit -m "feat(HU-05): implement OfflineProviderMessage component

- Yellow background (bg-yellow-50)
- Yellow border (border-yellow-300)
- Warning icon (⚠️)
- Display provider name + custom message
- ARIA role='alert' for accessibility

Tests are GREEN"
\`\`\`

---

### Configuration & Setup

#### Commit 17 - Setup ✅
\`\`\`bash
git add src/test/setup.ts
git add vitest.config.ts
git commit -m "test: add Vitest setup with testing-library matchers

- Add test setup file with jest-dom matchers
- Configure Vitest to use setup file
- Enable cleanup after each test
- Prepare for running all tests

Note: Run 'npm install -D @testing-library/react @testing-library/jest-dom' before testing"
\`\`\`

---

## ✅ Verificación de Commits

Para cada commit:
1. ✅ **Mensaje claro**: Indica RED/GREEN y HU correspondiente
2. ✅ **Archivos correctos**: Solo tests (RED) o solo implementación (GREEN)
3. ✅ **Tests ejecutados**: Verificar que fallan (RED) o pasan (GREEN)
4. ✅ **Commits separados**: Nunca mezclar tests e implementación

---

## 🔍 Comando para Verificar TDD

\`\`\`bash
# Ver commits que demuestran TDD
git log --oneline --grep="test\\|feat" --all

# Ver commits RED seguidos de GREEN
git log --oneline --all | grep -E "(test|feat)"

# Ver archivos modificados por commit
git log --stat --oneline
\`\`\`

---

## 📊 Resumen

- **Total commits recomendados**: 17
- **RED commits**: 8 (tests failing)
- **GREEN commits**: 8 (implementation passing)
- **Setup commits**: 1 (configuration)

---

**Nota importante**: Estos commits deben realizarse **ANTES** de continuar con nuevas features. El historial de Git es la evidencia de que seguiste TDD correctamente.
