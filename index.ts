import * as github from "@pulumi/github";
import * as fs from "fs";

const repository = new github.Repository(
  "pulumi-github-self-contained-repository",
  {
    autoInit: true,
    description:
      "Pulumi program to create GitHub repository and commit the content to it",
    visibility: "public",
  }
);

const files = fs
  .readdirSync(".", { withFileTypes: true })
  .filter((item) => !item.isDirectory())
  .map((item) => item.name);

for (const file of files) {
  new github.RepositoryFile(file, {
    repository: repository.name,
    branch: "main",
    file: file,
    content: fs.readFileSync(file, "utf8"),
    commitMessage: "Managed by Pulumi",
    commitAuthor: "Niko Virtala",
    commitEmail: "niko.virtala@hey.com",
    overwriteOnCreate: true,
  });
}
export const repositoryUrl = repository.httpCloneUrl;
