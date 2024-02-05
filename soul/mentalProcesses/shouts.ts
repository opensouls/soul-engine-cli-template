import { html } from "common-tags";
import { ChatMessageRoleEnum, externalDialog, mentalQuery } from "socialagi";
import { MentalProcess, useActions, useProcessManager } from "soul-engine";
import initialProcess from "../initialProcess.js";

const shouts: MentalProcess = async ({ step: initialStep }) => {
  const { speak, log } = useActions()
  const { setNextProcess } = useProcessManager()

  const { stream, nextStep } = await initialStep.next(
    externalDialog(html`
      - Respond in ALL CAPS
      - Use capital letters only
      - Be angry
      - Be funny
    `),
    { stream: true, model: "quality" }
  );
  speak(stream);

  const lastStep = await nextStep
  const shouldChill = await lastStep.compute(
    mentalQuery("The interlocuter apologized")
  )
  log("User apologized?", shouldChill)
  if (shouldChill) {
    const finalStep = lastStep.withMonologue(html`
      ${initialStep.entityName} thought to themself: I need to chill and stop shouting. I will stop using all caps.
    `)
    setNextProcess(initialProcess)
    return finalStep
  }

  return lastStep
}

export default shouts
