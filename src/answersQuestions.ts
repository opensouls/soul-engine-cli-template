import { brainstorm, externalDialog } from "socialagi/next";
import { MentalProcess, mentalQuery } from "soul-engine-cli";

const answersGuesses: MentalProcess<{object: string}> = async ({ step: initialStep, subroutine: { useProcessMemory, useActions }, params: { object } }) => {
  const questionsAttempted = useProcessMemory(0);
  const { speak, leaveConversation, log } = useActions()

  const hintOrWin = await initialStep.next(mentalQuery(`Has the user guessed ${object} correctly?`));
  if (hintOrWin.value) {
    const speech = await initialStep.next(externalDialog("Congratulations! You've guessed the object! Say thank you and good bye. Do not ask to play again."));
    speak(speech.value);
    leaveConversation();
    return speech
  } else {
    questionsAttempted.current = questionsAttempted.current + 1
    log("questions attempted: ", questionsAttempted.current)
    console.log("questions attempted: ", questionsAttempted.current)

    if (questionsAttempted.current === 20) {
      const speech = await initialStep.next(externalDialog(`Athena tells the user that the object was ${object} and wishes the user better luck next time.`));
      speak(speech.value);
      leaveConversation();
      return speech
    }
    // Provide a small hint to the user
    const hintStep = await initialStep.next(brainstorm("Athena thinks of a subtle hint. These should be 1 sentence hints."));
    const speech = await initialStep.next(externalDialog(`Athena gives a small hint: ${hintStep.value[0]}`));

    speak(speech.value);

    return speech
  }
}

export default answersGuesses
