import { Link } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium tracking-tight">
          Пользовательское соглашение
        </h1>
        <p className="text-muted-foreground">
          Условия использования сервиса STANAMER. Используя сервис, вы
          подтверждаете согласие с этими условиями.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Коммерческая тайна и чувствительные данные</CardTitle>
          <CardDescription>
            Обязательства пользователя при работе с сервисом.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Используя STANAMER, вы обязуетесь соблюдать режим коммерческой тайны
            вашей организации и не передавать в сервис сведения, разглашение
            которых может причинить вред компании, клиентам или партнёрам.
          </p>
          <p>
            Запрещается вводить и отправлять в запросах чувствительные данные, в
            том числе:
          </p>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>персональные данные и сведения о сотрудниках или клиентах;</li>
            <li>
              пароли, токены, ключи доступа, сертификаты и иные секреты;
            </li>
            <li>
              конфиденциальные схемы, внутренние URL с доступом по NDA,
              коммерческие условия и непубличную финансовую информацию;
            </li>
            <li>
              фрагменты кода, конфигурации или логи, содержащие секреты или
              коммерческую тайну.
            </li>
          </ul>
          <Separator />
          <p>
            Описание сущности и контекст должны быть обезличены: достаточно
            доменных терминов и правил именования без реальных секретов и
            персональных данных. Ответственность за содержимое запросов несёт
            пользователь.
          </p>
          <p>
            Продолжая работу с{" "}
            <Link
              to="/naming"
              className="underline underline-offset-4 hover:text-foreground"
            >
              неймингом
            </Link>{" "}
            или API, вы подтверждаете, что понимаете эти требования и обязуетесь
            их соблюдать.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
