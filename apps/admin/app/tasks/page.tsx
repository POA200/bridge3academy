import { revalidatePath } from "next/cache";
import { prisma } from "@repo/db";

export const dynamic = "force-dynamic";

const TASK_TYPE_OPTIONS = [
  { value: "social", label: "Social" },
  { value: "community", label: "Community" },
  { value: "engagement", label: "Engagement" },
  { value: "referral", label: "Referral" },
] as const;

const TASK_TYPE_VALUES = new Set<string>(
  TASK_TYPE_OPTIONS.map((option) => option.value),
);

type AdminTask = {
  id: string;
  title: string;
  points: number;
  type: string;
  link: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
};

function parseTaskLink(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmed);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

async function createTask(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const points = Number(formData.get("points") ?? 0);
  const type = String(formData.get("type") ?? "").trim();
  const link = parseTaskLink(String(formData.get("link") ?? ""));
  const isValidType = TASK_TYPE_VALUES.has(type);

  if (
    !title ||
    !isValidType ||
    !Number.isFinite(points) ||
    points < 0 ||
    !link
  ) {
    return;
  }

  const highestSortOrder = await prisma.task.aggregate({
    _max: { sortOrder: true },
  });

  await prisma.task.create({
    data: {
      title,
      points,
      type,
      link,
      active: true,
      sortOrder: (highestSortOrder._max.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath("/tasks");
}

async function moveTaskByOffset(taskId: string, offset: -1 | 1) {
  const id = taskId.trim();

  if (!id) {
    return;
  }

  const orderedTasks = await prisma.task.findMany({
    select: {
      id: true,
      sortOrder: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const currentIndex = orderedTasks.findIndex((task) => task.id === id);

  if (currentIndex < 0) {
    return;
  }

  const targetIndex = currentIndex + offset;

  if (targetIndex < 0 || targetIndex >= orderedTasks.length) {
    return;
  }

  const orderedTaskIds = orderedTasks.map((task) => task.id);
  [orderedTaskIds[currentIndex], orderedTaskIds[targetIndex]] = [
    orderedTaskIds[targetIndex],
    orderedTaskIds[currentIndex],
  ];

  await prisma.$transaction(
    orderedTaskIds.map((orderedTaskId, index) =>
      prisma.task.update({
        where: { id: orderedTaskId },
        data: { sortOrder: index },
      }),
    ),
  );

  revalidatePath("/tasks");
}

async function moveTaskUp(formData: FormData) {
  "use server";

  const taskId = String(formData.get("taskId") ?? "");

  await moveTaskByOffset(taskId, -1);
}

async function moveTaskDown(formData: FormData) {
  "use server";

  const taskId = String(formData.get("taskId") ?? "");

  await moveTaskByOffset(taskId, 1);
}

async function updateTask(formData: FormData) {
  "use server";

  const taskId = String(formData.get("taskId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const points = Number(formData.get("points") ?? 0);
  const type = String(formData.get("type") ?? "").trim();
  const link = parseTaskLink(String(formData.get("link") ?? ""));
  const isValidType = TASK_TYPE_VALUES.has(type);

  if (
    !taskId ||
    !title ||
    !isValidType ||
    !Number.isFinite(points) ||
    points < 0 ||
    !link
  ) {
    return;
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      points,
      type,
      link,
    },
  });

  revalidatePath("/tasks");
}

async function disableTask(formData: FormData) {
  "use server";

  const taskId = String(formData.get("taskId") ?? "").trim();

  if (!taskId) {
    return;
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { active: false },
  });

  revalidatePath("/tasks");
}

async function deleteTask(formData: FormData) {
  "use server";

  const taskId = String(formData.get("taskId") ?? "").trim();

  if (!taskId) {
    return;
  }

  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await prisma.$transaction([
        prisma.userTask.deleteMany({
          where: { taskId },
        }),
        prisma.task.delete({
          where: { id: taskId },
        }),
      ]);
      break;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error("Failed to delete task after retries", error);
        return;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 250 * attempt);
      });
    }
  }

  revalidatePath("/tasks");
}

export default async function TasksPage() {
  let tasks: AdminTask[] = [];
  let dbErrorMessage: string | null = null;

  try {
    tasks = await prisma.task.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    dbErrorMessage =
      "Unable to connect to the database. Configure DATABASE_URL in your environment and restart the admin server.";
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 p-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Task Admin</h1>
        <p className="text-sm text-muted-foreground">
          Create, edit, disable, and arrange waitlist tasks.
        </p>
        {dbErrorMessage ? (
          <p className="rounded-md border border-destructive-border bg-destructive-muted px-3 py-2 text-sm text-destructive">
            {dbErrorMessage}
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-semibold">Create Task</h2>
        <form action={createTask} className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            placeholder="Title"
            required
            className="rounded-md border px-3 py-2"
          />
          <select
            name="type"
            required
            defaultValue="social"
            className="rounded-md border px-3 py-2"
          >
            {TASK_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            name="points"
            type="number"
            min={0}
            placeholder="Points"
            required
            className="rounded-md border px-3 py-2"
          />
          <input
            name="link"
            type="url"
            placeholder="Task link (https://...)"
            required
            className="rounded-md border px-3 py-2"
          />
          <button
            type="submit"
            className="md:col-span-2 rounded-md bg-primary px-4 py-2 text-primary-foreground"
            disabled={Boolean(dbErrorMessage)}
          >
            Create Task
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All Tasks</h2>

        {tasks.length === 0 ? (
          <p className="rounded-md border p-4 text-sm text-muted-foreground">
            No tasks found.
          </p>
        ) : (
          tasks.map((task: AdminTask, index: number) => (
            <div key={task.id} className="rounded-lg border p-4">
              <form action={updateTask} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="taskId" value={task.id} />

                <input
                  name="title"
                  defaultValue={task.title}
                  required
                  className="rounded-md border px-3 py-2"
                />
                <select
                  name="type"
                  defaultValue={
                    TASK_TYPE_VALUES.has(task.type) ? task.type : "social"
                  }
                  required
                  className="rounded-md border px-3 py-2"
                >
                  {TASK_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  name="points"
                  type="number"
                  min={0}
                  defaultValue={task.points}
                  required
                  className="rounded-md border px-3 py-2"
                />
                <input
                  name="link"
                  type="url"
                  defaultValue={task.link ?? ""}
                  placeholder="Task link (https://...)"
                  required
                  className="rounded-md border px-3 py-2"
                />

                <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                  <button
                    type="submit"
                    formAction={moveTaskUp}
                    className="rounded-md border px-3 py-2 text-sm"
                    disabled={Boolean(dbErrorMessage) || index === 0}
                  >
                    Move Up
                  </button>

                  <button
                    type="submit"
                    formAction={moveTaskDown}
                    className="rounded-md border px-3 py-2 text-sm"
                    disabled={
                      Boolean(dbErrorMessage) || index === tasks.length - 1
                    }
                  >
                    Move Down
                  </button>

                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      task.active
                        ? "bg-success-muted text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {task.active ? "Active" : "Disabled"}
                  </span>

                  <button
                    type="submit"
                    className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
                    disabled={Boolean(dbErrorMessage)}
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              {task.active ? (
                <form action={disableTask} className="mt-2">
                  <input type="hidden" name="taskId" value={task.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-destructive-border px-3 py-2 text-sm text-destructive"
                    disabled={Boolean(dbErrorMessage)}
                  >
                    Disable Task
                  </button>
                </form>
              ) : null}

              <form action={deleteTask} className="mt-2">
                <input type="hidden" name="taskId" value={task.id} />
                <button
                  type="submit"
                  className="rounded-md border border-destructive-border px-3 py-2 text-sm text-destructive"
                  disabled={Boolean(dbErrorMessage)}
                >
                  Delete Task
                </button>
              </form>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
