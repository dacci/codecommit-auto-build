# Usage

Tag your CodeCommit repository with key "AutoBuild" and put the name of the CodeBuild project to be associated.
When you push to the repository, the associated build project will be started automatically.

# Deployment

## Prepare for deploy

```sh
yarn install
```

## Bootstrap your AWS account

If you've never deployed resources to your account with CDK, you need bootstrapping.

```sh
yarn cdk bootstrap
```

## Deploy resources

```sh
yarn cdk deploy
```
