import type { Context } from 'aws-lambda';
import { codeBuild, codeCommit, handler } from '../src';

jest.mock('aws-sdk');

const context = {} as Context;
const callback = () => undefined;

describe('Lambda Handler', () => {
  it('repository with project associated', async () => {
    codeCommit.listTagsForResource = jest.fn().mockReturnValue({
      promise: () => Promise.resolve({
        tags: {
          AutoBuild: 'build-project'
        },
      }),
    });

    codeBuild.startBuild = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    await handler({
      resources: [
        'repository',
      ],
      detail: {
        event: 'referenceCreated',
        commitId: 'source-version',
      },
    } as any, context, callback);

    expect(codeCommit.listTagsForResource).toBeCalledWith({
      resourceArn: 'repository',
    });

    expect(codeBuild.startBuild).toBeCalledWith({
      projectName: 'build-project',
      sourceVersion: 'source-version',
    });
  });

  it('project without project associated', async () => {
    codeCommit.listTagsForResource = jest.fn().mockReturnValue({
      promise: () => Promise.resolve({
        tags: {},
      }),
    });

    codeBuild.startBuild = jest.fn();

    await handler({
      resources: [
        'repository',
      ],
      detail: {
        event: 'referenceUpdated',
        commitId: 'source-version',
      },
    } as any, context, callback);

    expect(codeCommit.listTagsForResource).toBeCalledWith({
      resourceArn: 'repository',
    });

    expect(codeBuild.startBuild).not.toBeCalled();
  });

  it('invoked with referenceDeleted event', async () => {
    codeCommit.listTagsForResource = jest.fn();
    codeBuild.startBuild = jest.fn();

    await handler({
      resources: [
        'repository',
      ],
      detail: {
        event: 'referenceDeleted',
        oldCommitId: 'source-version',
      },
    } as any, context, callback);

    expect(codeCommit.listTagsForResource).not.toBeCalled();
    expect(codeBuild.startBuild).not.toBeCalled();
  });
});
