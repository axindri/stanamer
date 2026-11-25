import { Link } from "react-router-dom"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HomePage() {
  return (
    <section className="relative min-h-[calc(100svh-3.5rem)] overflow-hidden bg-background">
      <img
        src="/hero.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover opacity-80 mix-blend-luminosity dark:opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      <div className="absolute inset-0 bg-muted/20" />

      <div className="relative mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-2xl flex-col justify-center gap-5 px-6 py-16">
        <p className="text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
          STANAMER
        </p>
        <h1 className="max-w-xl text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          Стандартизация разработки
        </h1>
        <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
          Единые правила именования сущностей — меньше хаоса между слоями,
          командами и системами.
        </p>
        <div className="flex flex-col items-start gap-4 pt-2">
          <Button asChild size="lg">
            <Link to="/naming">
              Открыть нейминг
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <p className="max-w-lg text-sm text-muted-foreground">
            Для разработчиков: примеры вызова API генерации — на странице{" "}
            <Link
              to="/dev"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Разработка
            </Link>
            . Используя сервис, вы принимаете{" "}
            <Link
              to="/terms"
              className="underline underline-offset-4 hover:text-foreground"
            >
              пользовательское соглашение
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
