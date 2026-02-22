"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@repo/db";

type CreateTaskInput = {
  title: string;
  points: number;
  type: string;
  link: string;
};

type UpdateTaskInput = {
  id: string;
  title: string;
  points: number;
  type: string;
  link: string;
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

function normalizeTaskInput<T extends { title: string; type: string; link: string }>(
  data: T,
) {
  const parsedLink = parseTaskLink(data.link);

  return {
    ...data,
    title: data.title.trim(),
    type: data.type.trim(),
    link: parsedLink,
  };
}

export async function createTask(data: CreateTaskInput) {
  const normalized = normalizeTaskInput(data);

  if (
    !normalized.title ||
    !normalized.type ||
    !normalized.link ||
    !Number.isFinite(data.points) ||
    data.points < 0
  ) {
    throw new Error("Invalid task data.");
  }

  const task = await prisma.task.create({
    data: {
      title: normalized.title,
      points: data.points,
      type: normalized.type,
      link: normalized.link,
    },
  });

  revalidatePath("/tasks");
  return task;
}

export async function updateTask(data: UpdateTaskInput) {
  const normalized = normalizeTaskInput(data);

  if (
    !data.id.trim() ||
    !normalized.title ||
    !normalized.type ||
    !normalized.link ||
    !Number.isFinite(data.points) ||
    data.points < 0
  ) {
    throw new Error("Invalid task data.");
  }

  const task = await prisma.task.update({
    where: { id: data.id.trim() },
    data: {
      title: normalized.title,
      points: data.points,
      type: normalized.type,
      link: normalized.link,
    },
  });

  revalidatePath("/tasks");
  return task;
}

export async function toggleTaskActive(taskId: string) {
  const id = taskId.trim();

  if (!id) {
    throw new Error("Task id is required.");
  }

  const task = await prisma.task.findUnique({
    where: { id },
    select: { active: true },
  });

  if (!task) {
    throw new Error("Task not found.");
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { active: !task.active },
  });

  revalidatePath("/tasks");
  return updatedTask;
}

export async function deleteTask(taskId: string) {
  const id = taskId.trim();

  if (!id) {
    throw new Error("Task id is required.");
  }

  const deletedTask = await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/tasks");
  return deletedTask;
}
