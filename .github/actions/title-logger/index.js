import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  const title = core.getInput("title");
  core.info(`The title is ${title}`);

  // Extract ticket number pattern (e.g., ABC-123, 123-abc)
  const match = title.match(/[A-Za-z0-9]+-[A-Za-z0-9]+/);
  const ticketNumber = match ? match[0] : null;

  if (!ticketNumber) {
    core.info("No ticket number found in title");
    return;
  }

  core.info(`The ticket number is ${ticketNumber}`);
}

run();
