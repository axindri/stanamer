export function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-medium tracking-tight">
          Стандартизация разработки
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Проект помогает выравнивать практики команды: единые правила
          именования сущностей, согласованный стиль кода данных и меньше хаоса
          между слоями и системами.
        </p>
      </div>
    </div>
  )
}
