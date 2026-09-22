// Minimal, always-on hosting for the agent: Container Apps Registry +
// Environment + a single Container App kept at 1 replica (min == max)
// so the background worker loop in queue_worker.py never gets scaled
// to zero mid-job.
//
// This provisions compute only. After it runs, grant the container
// app's managed identity access to your Azure AI Foundry project
// (role "Azure AI Developer", scoped to that project) — see the repo
// README for the exact `az role assignment create` command, since that
// resource usually lives in a project/resource group of its own that
// this template doesn't assume ownership of.
targetScope = 'resourceGroup'

@description('Base name used to derive resource names.')
param name string = 'azure-agent'

param location string = resourceGroup().location

@description('Azure AI Foundry project endpoint, e.g. https://<project>.services.ai.azure.com/api/projects/<project-name>')
param projectEndpoint string

@description('Model deployment name in that project, e.g. gpt-4o')
param modelDeploymentName string

param agentName string = 'long-running-agent'

@description('Shared bearer token clients must send to call /jobs and /conversations. Leave empty to deploy unauthenticated (not recommended for a public endpoint).')
@secure()
param apiToken string = ''

@description('Container image to deploy. Leave the default on first apply, then update via `az containerapp update` (or re-run this template) once the image has been built and pushed.')
param containerImage string = 'mcr.microsoft.com/k8se/quickstart:latest'

var registryName = replace('${name}acr', '-', '')
var logAnalyticsName = '${name}-logs'
var envName = '${name}-env'
var appName = '${name}-app'

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource registry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: registryName
  location: location
  sku: { name: 'Basic' }
  properties: {
    adminUserEnabled: false
  }
}

resource containerAppsEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: envName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: appName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: containerAppsEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8000
        transport: 'http'
      }
      registries: [
        {
          server: registry.properties.loginServer
          identity: 'system'
        }
      ]
      secrets: [
        { name: 'api-token', value: apiToken }
      ]
    }
    template: {
      containers: [
        {
          name: appName
          image: containerImage
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            { name: 'PROJECT_ENDPOINT', value: projectEndpoint }
            { name: 'MODEL_DEPLOYMENT_NAME', value: modelDeploymentName }
            { name: 'AGENT_NAME', value: agentName }
            { name: 'API_TOKEN', secretRef: 'api-token' }
          ]
        }
      ]
      // min == max: this app runs a background worker loop, not just
      // request handlers, so it must never scale to zero.
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

// Let the container app's own managed identity pull from the registry
// this template created, without an admin username/password.
resource acrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(registry.id, containerApp.id, 'AcrPull')
  scope: registry
  properties: {
    principalId: containerApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '7f951dda-4ed3-4680-a7ca-43fe172d538d' // AcrPull
    )
  }
}

output containerAppFqdn string = containerApp.properties.configuration.ingress.fqdn
output registryLoginServer string = registry.properties.loginServer
output containerAppPrincipalId string = containerApp.identity.principalId
