"use client";

type DeleteUserButtonProps = {
  userId: string;
  userName: string;
  userEmail: string;
  action: (formData: FormData) => void | Promise<void>;
  disabled?: boolean;
};

export function DeleteUserButton({
  userId,
  userName,
  userEmail,
  action,
  disabled = false,
}: DeleteUserButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const isConfirmed = window.confirm(
          `Are you sure you want to delete ${userName} (${userEmail}) from the waitlist?`,
        );

        if (!isConfirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="rounded-md border border-destructive-border px-3 py-2 text-sm text-destructive"
        disabled={disabled}
      >
        Delete
      </button>
    </form>
  );
}
