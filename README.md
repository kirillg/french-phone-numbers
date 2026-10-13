# Allô!

A single-user, mobile-first French phone-number listening game. No account, database, or API key is required.

## Develop

Use Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Run `npm test` for the number-generation, formatting, and pronunciation tests, and `npm run build` for production output in `dist/`. Deploy that directory to any static HTTPS host. `npm run preview` serves the production build locally.

## Play

Tap Start. Each of ten rounds speaks a US number digit by digit in French with the browser's speech synthesis. The thirty-second timer starts when speech finishes. Enter the ten digits after +1; the answer is checked automatically when the tenth digit is entered. If all digits are entered during the announcement, checking waits until it finishes. A correct answer earns two points; a wrong answer or timeout earns none. The input is focused when you tap Start. After each attempt, the input hides and feedback is spoken. Tap Continue when you’re ready to hear the next number; its empty input is focused again. After the final result, Continue opens the Congratulations screen. Done returns to Start.

The game uses assigned US area codes and reserved fictional 555-0100–0199 numbers, so it never asks a child to practice with someone's real subscriber number. Random rounds can repeat. Scores last only for the current session.

## iPhone layout

The answer uses a text field with a numeric keyboard and autocomplete/correction disabled. Telephone detection is disabled for the page. Safari may still offer contact suggestions; while the answer is focused, the layout hides the decorative audio graphic, moves the field toward the top, and adapts to the visual viewport with space for the keyboard accessory bar. Verify this on an actual iPhone with contact autofill enabled.

## iPhone audio

Open in Safari with sound enabled. Speech begins from the Start tap; French voice selection uses an installed fr-FR voice when available and otherwise asks the browser for French speech. Actual voices depend on the device. If speech fails, the app offers a fresh Start rather than starting an inaudible timed round.

Before release, test on an actual iPhone: hear all digits, check the countdown begins after the announcement, submit correct and incorrect answers, let a round time out, complete ten rounds, and tap Done. Also check background/foreground behavior and the numeric keyboard. Desktop automated checks cannot establish iPhone voice availability.
