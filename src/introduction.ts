import { ChatMessageRoleEnum, brainstorm, decision, externalDialog } from "socialagi";
import { MentalProcess, mentalQuery } from "soul-engine-cli";
import answersGuesses from "./answersQuestions.js";

const introduction: MentalProcess = async ({ step: initialStep, subroutine: { moveToProcess, useProcessMemory, useActions, useInvocationCount} }) => {
  const didPick = useProcessMemory("")
  const { speak, log } = useActions()
  const invocationCount = useInvocationCount()

  log("hello")

  let step = initialStep

  if (invocationCount === 0) {
    console.log("---- once")
    const { stream, nextStep } = await initialStep.next(externalDialog("Tell the user about the game twenty questions, and ask them if they are ready to play?"), { stream: true });
    speak(stream);
    step = await nextStep
  } else {
    const { stream, nextStep } = await initialStep.next(externalDialog("Answer any questions the user has about the rules, or just wish them luck. Guide them towards telling Athena they are ready to play, if they haven't indicated that yet. Remember, Athena is the one answering questions."), { stream: true });
    speak(stream);
    step = await nextStep
  }

  log("step: ", step)

  if (!didPick.current) {
    const brainstormStep = await initialStep.next(brainstorm("objects for 20 questions"))
    const decisionStep = await initialStep.next(decision("Athena chooses an object for the game", brainstormStep.value));
  
    didPick.current = decisionStep.value as string
    step = step.withMemory([
      {
        role: ChatMessageRoleEnum.Assistant,
        content: `Athena choses: "${decisionStep.value}" for her object for the game.`
      }
    ])
    return step
  }

  const playingDecision = (await step.next(mentalQuery("The user has indicated they are ready to play."))).value;
  if (playingDecision) {
    return moveToProcess(answersGuesses, step, { object: didPick.current })
  }

  return step
}

export default introduction