import { BracesIcon, TerminalIcon } from "lucide-react"

import { ApiCodeSample } from "@/components/api-code-sample"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const GENERATE_PATH = "/api/v1/naming/generate"

const CURL_GENERATE = `curl -X POST '${GENERATE_PATH}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "entity_type": "table",
    "description": "Справочник клиентов из CRM",
    "style": "snake_case",
    "count": 5,
    "max_length": 40,
    "prefer_short": false,
    "allow_digits": true,
    "name_prefix": "stg_",
    "name_postfix": "_v1"
  }'`

const JS_GENERATE = `const response = await fetch("${GENERATE_PATH}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    entity_type: "table",
    description: "Справочник клиентов из CRM",
    style: "snake_case",
    count: 5,
    max_length: 40,
    prefer_short: false,
    allow_digits: true,
    name_prefix: "stg_",
    name_postfix: "_v1",
  }),
})

if (!response.ok) {
  throw new Error(await response.text())
}

const data = await response.json()
console.log(data.suggestions)`

const PYTHON_GENERATE = `import httpx

payload = {
    "entity_type": "table",
    "description": "Справочник клиентов из CRM",
    "style": "snake_case",
    "count": 5,
    "max_length": 40,
    "prefer_short": False,
    "allow_digits": True,
    "name_prefix": "stg_",
    "name_postfix": "_v1",
}

with httpx.Client() as client:
    response = client.post(
        "http://localhost:8000${GENERATE_PATH}",
        json=payload,
    )
    response.raise_for_status()
    data = response.json()
    print(data["suggestions"])`

const RESPONSE_EXAMPLE = `{
  "entity_type": "table",
  "style": "snake_case",
  "suggestions": [
    {
      "name": "stg_crm_customers",
      "rationale": "Отражает источник CRM и сущность клиентов"
    },
    {
      "name": "stg_customer_directory",
      "rationale": "Подчёркивает справочный характер таблицы"
    }
  ]
}`

const GENERATE_FIELDS = [
  {
    name: "entity_type",
    type: "string",
    required: true,
    description:
      "Тип сущности: table, column, dag, topic, metric, schema, function",
  },
  {
    name: "description",
    type: "string",
    required: true,
    description: "Описание сущности, 5–2000 символов",
  },
  {
    name: "style",
    type: "string | null",
    required: false,
    description:
      "snake_case, camelCase, PascalCase, kebab-case. Если не указан — дефолт для entity_type",
  },
  {
    name: "count",
    type: "number",
    required: false,
    description: "Число вариантов, 3–7 (по умолчанию 5)",
  },
  {
    name: "max_length",
    type: "number",
    required: false,
    description: "Максимальная длина имени, 8–80 (по умолчанию 40)",
  },
  {
    name: "prefer_short",
    type: "boolean",
    required: false,
    description: "Предпочитать более короткие имена",
  },
  {
    name: "allow_digits",
    type: "boolean",
    required: false,
    description: "Разрешить цифры в имени (по умолчанию true)",
  },
  {
    name: "name_prefix",
    type: "string | null",
    required: false,
    description: "Фиксированный префикс, до 8 символов",
  },
  {
    name: "name_postfix",
    type: "string | null",
    required: false,
    description: "Фиксированный постфикс, до 8 символов",
  },
  {
    name: "context",
    type: "string | null",
    required: false,
    description: "Текстовый контекст (до 8000 символов)",
  },
  {
    name: "context_url",
    type: "string | null",
    required: false,
    description: "HTTPS raw/blob URL; загружается на сервере",
  },
] as const

export function DevPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-medium tracking-tight">Development</h1>
        </div>
        <p className="text-muted-foreground">
          Документация API для генерации имён сущностей
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge>POST</Badge>
            <span className="font-mono text-sm">{GENERATE_PATH}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Tabs defaultValue="curl">
            <TabsList className="w-full">
              <TabsTrigger value="curl" className="flex-1">
                <TerminalIcon data-icon="inline-start" />
                cURL
              </TabsTrigger>
              <TabsTrigger value="js" className="flex-1">
                <BracesIcon data-icon="inline-start" />
                JavaScript
              </TabsTrigger>
              <TabsTrigger value="python" className="flex-1">
                Python
              </TabsTrigger>
            </TabsList>
            <TabsContent value="curl" className="mt-4">
              <ApiCodeSample
                title="curl"
                code={CURL_GENERATE}
                language="bash"
              />
            </TabsContent>
            <TabsContent value="js" className="mt-4">
              <ApiCodeSample
                title="fetch.js"
                code={JS_GENERATE}
                language="javascript"
              />
            </TabsContent>
            <TabsContent value="python" className="mt-4">
              <ApiCodeSample
                title="client.py"
                code={PYTHON_GENERATE}
                language="python"
              />
            </TabsContent>
          </Tabs>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Поле</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Обяз.</TableHead>
                  <TableHead>Описание</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {GENERATE_FIELDS.map((field) => (
                  <TableRow key={field.name}>
                    <TableCell className="font-mono text-xs">
                      {field.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {field.type}
                    </TableCell>
                    <TableCell>
                      {field.required ? (
                        <Badge variant="secondary">да</Badge>
                      ) : (
                        <span className="text-muted-foreground">нет</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[14rem] whitespace-normal text-muted-foreground">
                      {field.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ApiCodeSample
            title="response.json"
            code={RESPONSE_EXAMPLE}
            language="json"
            lineNumbers={false}
          />
        </CardContent>
      </Card>

      <Separator />

      <p className="text-sm text-muted-foreground">
        Swagger UI:{" "}
        <a
          href="/swagger"
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground underline-offset-4 hover:underline"
        >
          /swagger
        </a>
      </p>
    </div>
  )
}
