import type { EventBridgeEvent, EventBridgeHandler } from 'aws-lambda';

export type CodeCommitCloudWatchRepositoryStateHandler =
  EventBridgeHandler<'CodeCommit Repository State Change', CodeCommitRepositoryStateEventDetail, void>;

export type CodeCommitRepositoryStateEventType =
  | 'referenceCreated'
  | 'referenceUpdated'
  | 'referenceDeleted'
  | 'unreferencedMergeCommitCreated';

export interface CodeCommitRepositoryStateEventDetail {
  event: CodeCommitRepositoryStateEventType;
  repositoryName: string;
  repositoryId: string;
  referenceType: string;
  referenceName: string;
  referenceFullName: string;
  commitId?: string;
  oldCommitId?: string;
  baseCommitId?: string;
  sourceCommitId?: string;
  destinationCommitId?: string;
  mergeOption?: string;
  conflictDetailsLevel?: string;
  conflictResolutionStrategy?: string;
};

export interface CodeCommitCloudWatchRepositoryStateEvent extends EventBridgeEvent<'CodeCommit Repository State Change', CodeCommitRepositoryStateEventDetail> {
  source: 'aws.codecommit';
};
