import type { CodeCommitCloudWatchRepositoryStateHandler } from './codecommit-cloudwatch-repository';
import { CodeCommit, CodeBuild } from 'aws-sdk';

export const codeCommit = new CodeCommit();
export const codeBuild = new CodeBuild();

export const handler: CodeCommitCloudWatchRepositoryStateHandler = async (event) => {
  if (event.detail.event !== 'referenceCreated' &&
      event.detail.event !== 'referenceUpdated') return;

  const tags = await codeCommit
    .listTagsForResource({
      resourceArn: event.resources[0],
    })
    .promise()
    .then((data) => data.tags);
  if (!tags?.AutoBuild) return;

  return codeBuild
    .startBuild({
      projectName: tags.AutoBuild,
      sourceVersion: event.detail.commitId,
    })
    .promise()
    .then((data) => console.info(JSON.stringify(data)));
};
