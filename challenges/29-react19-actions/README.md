# Challenge · Fix the review form with React 19 Actions

**React Application Development · October 2026 batch**

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/deesha-tech/react-oct-batch-26/tree/main/challenges/29-react19-actions?file=src/ReviewForm.tsx)

`src/ReviewForm.tsx` is a product review form written the React 18 way: `useState` for the comment, the rating, loading and the error, and a `handleSubmit` with `try/catch/finally`. It has **two bugs**.

## Step 1 · Find the bugs

- Click **Post review** twice, quickly. Watch the **Network and render timeline** and the review list. What happens?
- Post a review shorter than 10 characters, then a good one. What's wrong with the error message?

Write down both bugs and the lines that cause them.

## Step 2 · Fix them with React 19 Actions

Rewrite `src/ReviewForm.tsx` so that:

| Check | How you'll see it |
|---|---|
| A double click sends **one** request | One POST bar in the timeline, your review appears once |
| The error **clears** on the next try | No stale error after a successful post |
| The form **resets** after a success | The text box is empty again |
| The text **stays** after an error | The user doesn't have to retype |
| **No** `useState` for loading or error | React tracks them for you |

Use `<form action>` with `useActionState` (from `react`), and `useFormStatus` (from `react-dom`) for the submit button.

## Bonus

Show the review **instantly**, before the server answers, with `useOptimistic`. A rejected review (try "Bad") must disappear by itself. Hint: the review list lives in `src/App.tsx`, and a review with `sending: true` is already shown greyed out as "sending…".

## Run it locally

```bash
npm install
npm run dev
```

## Submit

Fork the StackBlitz project, or push your solution to your own repository, and share the link with your trainer.
