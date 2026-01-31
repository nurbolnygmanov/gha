import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  const title = core.getInput("title");
  core.info(`The title is ${title}`);

  // Extract ticket number pattern (e.g., ABC-123, 123-abc)
  const match = title.match(/[A-Za-z0-9]+-[A-Za-z0-9]+/);
  const ticketNumber = match ? match[0] : null;

  if (!ticketNumber) {
    core.setFailed("No ticket number found in title");
    return;
  }

  core.info(`The ticket number is ${ticketNumber}`);

  const token = core.getInput("github-token");
  core.setSecret(token);
  const octokit = github.getOctokit(token);

  const context = github.context;
  const pullRequest = context.payload.pull_request;

  if (!pullRequest) {
    core.setFailed("No pull request found");
    return;
  }

  core.info(`The pull request is ${pullRequest.body}`);

  const currentBody = pullRequest.body || "";
  const ticketUrl = `https://your-jira-url.com/browse/${ticketNumber}`; // Adjust URL as needed
  const ticketLink = `[${ticketNumber}](${ticketUrl})`;

  let newBody;

  // Match: ### Ticket\n<!-- comment -->\n(optional existing link)
  const ticketHeaderRegex =
    /^###\s+Ticket\s*\n<!-- Place a link to requirements\/documentation of your work \(most likely Jira ticket\) -->\n?.*$/m;

  if (ticketHeaderRegex.test(currentBody)) {
    // Replace existing ticket section, keeping the header and comment
    newBody = currentBody.replace(
      ticketHeaderRegex,
      `### Ticket\n<!-- Place a link to requirements/documentation of your work (most likely Jira ticket) -->\n${ticketLink}`
    );
  } else {
    // Add ticket section at the top if header doesn't exist
    const ticketSection = `### Ticket\n<!-- Place a link to requirements/documentation of your work (most likely Jira ticket) -->\n${ticketLink}`;
    newBody = currentBody
      ? `${ticketSection}\n\n${currentBody}`
      : ticketSection;
  }

  await octokit.rest.pulls.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: pullRequest.number,
    body: newBody,
  });
}

run();
