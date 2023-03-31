import { ServiceEvent } from '../../../../ServiceEvent.enum'
import { UserV1GetUserByIdOutputPayload } from '../../../../user/v1'
import { emailV1ServiceBuilder } from '../../emailV1ServiceBuilder'
import { emailV1SendWelcomeEmailInputPayloadSchema, emailV1SendWelcomeEmailOutputPayloadSchema } from './schema'

export const sendWelcomeEmailSubscriptionBuilder = emailV1ServiceBuilder
  .getSubscriptionBuilder('sendWelcomeEmail', 'send a welcome mail to new registered users')
  .subscribeToEvent(ServiceEvent.NewUserRegistered)
  .addPayloadSchema(emailV1SendWelcomeEmailInputPayloadSchema)
  .addOutputSchema(ServiceEvent.WelcomeEmailSent, emailV1SendWelcomeEmailOutputPayloadSchema)
  .setSubscriptionFunction(async function (context, payload, _parameter) {
    const config = await context.configs.getConfig('emailProviderUrl')
    const secrets = await context.secrets.getSecret('emailProviderAuthToken')

    context.logger.debug(`Using email provider ${config.emailProviderUrl} with token ${secrets.emailProviderAuthToken}`)

    const user = await context.invoke<UserV1GetUserByIdOutputPayload>(
      { serviceName: 'User', serviceVersion: '1', serviceTarget: 'getUserById' },
      undefined,
      payload,
    )

    // add your business logic here
    context.logger.info(`Welcome email to user sent to ${user.email}`)

    return payload
  })
