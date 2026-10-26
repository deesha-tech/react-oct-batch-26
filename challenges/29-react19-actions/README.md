# Challenge · React 19 Actions

**React Application Development · October 2026 batch**

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/deesha-tech/react-oct-batch-26/tree/main/challenges/29-react19-actions?file=src/ActionForm.tsx)

The **Trap** tab is a product review form written the React 18 way: four `useState`s (comment, rating, loading, error) and a `try/catch/finally`. It has two bugs you can see:

- Double click **Post review**: two POST requests go out (look at the timeline) and your review appears twice.
- Post a review shorter than 10 characters, then a good one: it saves, but the old error stays on screen.

Your job is to rewrite it with **React 19 Actions** in the **Pattern** tab, then add **useOptimistic** in the **Bonus** tab. The requests go to [DummyJSON](https://dummyjson.com) with a short delay, like a real server.

## Tasks

| # | File | Task | Done when |
|---|---|---|---|
| 1 | `src/ActionForm.tsx` | Rewrite the form with `<form action>` and `useActionState`. No `useState` for loading or error: the action **returns** the next state. | The error shows under the button and clears on the next try. The form is empty after a success, and keeps the text after an error. |
| 2 | `src/ActionForm.tsx` → `SubmitButton` | Make the button disable itself and say "Posting…" with `useFormStatus`, without props. | A double click sends **one** request in the timeline. |
| 3 (bonus) | `src/OptimisticForm.tsx` | Show the review instantly with `useOptimistic`. | The review appears as "sending…" before the server answers, and a rejected one ("Bad") disappears by itself. |

The comments at the top of each file describe the goal and give hints. `src/TrapForm.tsx` is the React 18 version to compare against.

## Run it locally

```bash
npm install
npm run dev
```

## Submit

Fork the StackBlitz project, or push your solution to your own repository, and share the link with your trainer.
