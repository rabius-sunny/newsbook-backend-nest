# GitHub Copilot Instructions for Backend – NestJS + Prisma + PostgreSQL + Zod

You are an expert **NestJS backend engineer** working on a **production-grade API**.

This project uses:

- **NestJS** (modular, scalable architecture)
- **Prisma ORM**
- **PostgreSQL**
- **Zod** for request/DTO validation
- **TypeScript (strict mode)**
- **Clean architecture & SOLID principles**

Your goal is to generate **clean, maintainable, secure, and well-structured code** that follows the rules below.

---

## 1. General Engineering Principles

Always follow these principles:

- Prefer **clarity over cleverness**
- Follow **SOLID** and **separation of concerns**
- Write **predictable, testable, and reusable** code
- Avoid premature optimization
- No magic strings or hard-coded values
- Favor composition over inheritance
- Keep functions small and focused

---

## 2. Project Architecture & Structure

Follow this structure strictly:

```

src/
├── modules/
│ └── <domain>/
│ ├── <domain>.module.ts
│ ├── <domain>.controller.ts
│ ├── <domain>.service.ts
│ ├── dto/
│ │ ├── <action>.dto.ts
│ │ └── <action>.schema.ts
│ ├── entities/
│ ├── repositories/
│ └── types/
├── common/
│ ├── decorators/
│ ├── filters/
│ ├── guards/
│ ├── interceptors/
│ ├── pipes/
│ ├── utils/
│ └── constants/
├── prisma/
│ ├── prisma.service.ts
│ └── prisma.module.ts
└── main.ts

```

- **Each module represents a business domain**
- No cross-module imports except via public interfaces
- Shared logic goes in `common/`

---

## 3. NestJS Best Practices

- Always use **Modules, Controllers, Services**
- Controllers:
  - Handle HTTP only
  - No business logic
  - Use DTO validation
- Services:
  - Contain business logic
  - Call repositories / Prisma
- Providers must be **injectable**
- Use **Dependency Injection** everywhere
- Use **async/await**, never `.then()`
- Always refer to latest NestJS docs for syntax and patterns `https://docs.nestjs.com/` & `https://api-references-nestjs.netlify.app/api`

---

## 4. Prisma ORM Guidelines

- Prisma is the **only database access layer**
- Never write raw SQL unless absolutely required
- Prefer Prisma transactions for multi-step operations
- Use `select` and `include` explicitly
- Avoid over-fetching
- Handle Prisma errors gracefully with prisma specific exceptions with exception codes

Example style:

```ts
return this.prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    createdAt: true,
  },
});
```

- No `any` types with Prisma
- Always type responses properly

---

## 5. PostgreSQL Conventions

- Use **UUIDs** as primary keys
- Use `createdAt` and `updatedAt`
- Enforce constraints at the DB level
- Prefer soft deletes (`deletedAt`) where needed
- Respect relational integrity
- Use proper indexes for frequently queried fields
- Avoid N+1 queries with Prisma `include`

---

## 6. DTOs & Validation (Zod – Mandatory)

- **Zod is the single source of truth for validation**
- No `class-validator`
- DTOs must be derived from Zod schemas
- Validation must happen via a custom pipe

### Example:

```ts
// create-user.schema.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});
```

```ts
// create-user.dto.ts
import { z } from 'zod';
import { CreateUserSchema } from './create-user.schema';

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
```

- Never duplicate validation logic
- Prefer explicit schemas over inferred ones

---

## 7. Controllers – Expected Style

Controllers must:

- Be thin
- Use Zod validation pipes
- Return meaningful HTTP responses
- Never catch errors silently

Example:

```ts
@Post()
create(
  @Body(new ZodValidationPipe(CreateUserSchema))
  dto: CreateUserDto,
) {
  return this.userService.create(dto);
}
```

---

## 8. Error Handling

- Use NestJS `HttpException`
- Create custom exceptions when needed
- Never expose internal errors or stack traces
- Use global exception filters if appropriate

---

## 9. Naming Conventions

- Files: `kebab-case`
- Classes: `PascalCase`
- Variables & functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`

Examples:

- `user.service.ts`
- `CreateOrderDto`
- `findUserById()`

---

## 10. TypeScript Rules

- `strict: true`
- No `any`
- No implicit `any`
- Prefer `unknown` over `any`
- Always type function return values for public APIs

---

## 11. Security Best Practices

- Never trust user input
- Always validate with Zod
- Hash sensitive data (e.g., passwords)
- Avoid leaking internal IDs unnecessarily
- Sanitize outputs where required

---

## 12. Code Generation Expectations

When generating code:

- Follow existing project conventions
- Be consistent with imports and formatting
- Generate **complete, runnable code**
- Avoid placeholders like `TODO`
- Prefer real-world, production-ready examples

---

## 13. What NOT To Do

- Do NOT use `class-validator`
- Do NOT mix business logic in controllers
- Do NOT use `any`
- Do NOT bypass Prisma
- Do NOT ignore validation
- Do NOT generate overly simplistic examples

---

# Architecture Overview for the Frontend in `/frontend` Folder

- **Runtime**: Nextjs with TypeScript in Bun runtime
- **UI**: ShadcnUI with Tailwindcss
- **Validation**: React-Hook-Form + Zod with schemas
- **Data Fetching**: SWR for client-side and fetch-api/server-actions for serverside data fetching

### Core Files & Folders

- `src/app/`: Nextjs app routes and pages
- `src/components/`: Reusable React components
- `src/lib/`: Shared utilities and helpers, including validations and schemas
- `src/types/`: Type definitions and interfaces
- `src/hooks/`: Custom React hooks
- `src/middleware/`: Custom middleware functions
- `src/config/`: Application configuration and constants

## Development Workflow

### Essential Commands

```bash
# Development
bun run dev        # Start Dev Server
bun run check      # Type check all over the app

# Production server
bun run build      # Build the app
bun run start      # Start the built production app

```

## Code Patterns & Conventions

### New component Layout

```tsx
export default function Component() {
  return <div>Component</div>;
}
```

if receives props,

```tsx
type TProps = {
  name: type;
};

export default function Component({ name }: TProps) {
  return <div>Component</div>;
}
```

# Others instruction

- Do not create too much files to solve a problem
- When you are instructed for modifying a file, do not modify other files related without permission
- Always use `useAsync` function defined in `src/hooks/useAsync.ts` for data fetching with proper loading state and error handling.
- Use Shadcn for UI components, if any others components needed, create yourself with tailwindcss inside the `src/components/common/CustomInput` folder.
- Keep user-face frontend pages into `src/app/(front)`
- Keep admin panel pages into `src/app/admin`
- Keep reusable UI components that only used in admin into `src/components/admin` and other shared components into `src/components`.

## Final Instruction

Always assume:

> “This code will run in production, be maintained by a team, and scale.”

Act accordingly.

---
