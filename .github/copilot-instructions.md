# GitHub Copilot Instructions – NestJS + Prisma + PostgreSQL + Zod

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

## Final Instruction

Always assume:

> “This code will run in production, be maintained by a team, and scale.”

Act accordingly.

---

# Instruction for the honojs project

we've to convert an existing honojs project to nestjs following the above instructions. the path for the hono project is at `hono-project` directory.

- Analyze the honojs project and completely convert it to nestjs following the above instructions.
- Ensure all functionalities are preserved and the new code adheres to NestJS best practices.
- Convert the drizzle ORM usage in honojs to Prisma ORM in NestJS with preserving all database interactions and relationships, schemas and indexes.
- Use Zod for all DTO validations as specified above using the existing zod validation logic from honojs.
