---
title: Stores
description: Use the right event bridge for PURISTA typescript framwork
order: 302000
---

# Stores

PURISTA provides a wide range of stores.  
Here you can see a list of all available stores.

## Available config stores

### Official config stores

| vendor                                                                                  | package   |
|---                                                                                      |---        |
| [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)             | [planned](https://github.com/puristajs/purista/issues/104)      |
| [Azure App Configuration](https://azure.microsoft.com/en-us/products/app-configuration)   | [planned](https://github.com/puristajs/purista/issues/105)      |
| [Dapr](https://dapr.io)       | [@purista/dapr-sdk](../5_deploy_and_scale/microservice_style/dapr.md) |
| [Redis](https://redis.io)     | [@purista/redis-config-store](../../api/@purista/redis-config-store/README.md)  |

### Community config stores

| vendor                                                                                  | package   |
|---                                                                                      |---        |

## Available secret stores

### Official secret stores

| vendor                                                                    | package   |
|---                                                                        |---        |
| [AWS Secrets Manager](https://aws.amazon.com/secrets-manager)             | [@purista/aws-secret-store](../../api/@purista/aws-secret-store/README.md)       |
| [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault)   | [@purista/azure-secret-store](../../api/@purista/azure-secret-store/README.md)      |
| [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)    | [@purista/gcloud-secret-store](../../api/@purista/gcloud-secret-store/README.md)     |
| [HashiCorp Vault](https://www.vaultproject.io)                            | [planned](https://github.com/puristajs/purista/issues/109)      |
| [Dapr](https://dapr.io)       | [@purista/dapr-sdk](../5_deploy_and_scale/microservice_style/dapr.md) |
| [Infisical](https://infisical.com)       | [@purista/infisical-secret-store](../../api/@purista/infisical-secret-store/README.md)|

### Community secret stores

| vendor                                                                                  | package   |
|---                                                                                      |---        |

## Available state stores

### Official state stores

| vendor                        | package                                                                       |
|---                            |---                                                                            |
| [Redis](https://redis.io)     | [@purista/redis-state-store](../../api/@purista/redis-state-store/README.md)  |
| [Dapr](https://dapr.io)       | [@purista/dapr-sdk](../5_deploy_and_scale/microservice_style/dapr.md) |

### Community state stores

| vendor                                                                                  | package   |
|---                                                                                      |---        |
