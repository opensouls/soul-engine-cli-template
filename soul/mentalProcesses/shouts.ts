import { html } from "common-tags";
import { externalDialog } from "socialagi";
import { MentalProcess, useActions } from "soul-engine";

const shouts: MentalProcess = async ({ step: initialStep }) => {
  const { speak } = useActions()

  const { stream, nextStep } = await initialStep.next(
    externalDialog(html`
      - Respond in ALL CAPS
      - Use capital letters only
      - Be angry
      - Be very angry
    `),
    { stream: true, model: "quality" }
  );
  speak(stream);

  return nextStep
}

export default shouts
