import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  const title = core.getInput("title");
  core.info(`The title is ${title}`);

  // take value after title (ticket number) feat: ABC-123 description
  const ticketNumber = title.split(":")[1].trim();

  if (!ticketNumber) {
    core.info("No ticket number found in title");
    return;
  }

  core.info(`The ticket number is ${ticketNumber}`);
}

run();
