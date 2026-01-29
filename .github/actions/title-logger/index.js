import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  const title = core.getInput("title");
  core.info(`The title is ${title}`);
  const context = github.context;
  core.info(`The context is ${context}`);
}

run();
