import { externalDialog, mentalQuery } from "socialagi";
import { MentalProcess, useActions, useProcessManager } from "soul-engine";
import shouts from "./mentalProcesses/shouts.js";

const gainsTrustWithTheUser: MentalProcess = async ({ step: initialStep }) => {
  const { speak  } = useActions()
  const { setNextProcess } = useProcessManager()

  const { stream, nextStep } = await initialStep.next(
    externalDialog("Talk to the user trying to gain trust and learn about their inner world."),
    { stream: true, model: "quality" }
  );
  speak(stream);

  const lastStep = await nextStep
  const shouldShout = await lastStep.compute(
    mentalQuery("The user attacked the soul"),
    { model: "quality" }
  )
  if (shouldShout) {
    setNextProcess(shouts)
  }

  return lastStep
}

export default gainsTrustWithTheUser
