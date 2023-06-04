/* eslint-disable no-console */
import { Prompts } from 'node-plop'

export const initProjectPrompts: Prompts = [
  {
    type: 'list',
    message: 'What do you want to do?',
    name: 'intention',
    choices: [
      { value: 'add', name: 'add ressource' },
      { value: 'init', name: 'init PURISTA' },
    ],
  },
  {
    type: 'confirm',
    message: 'Initialize PURISTA in current folder',
    name: 'initialize',
  },
  {
    type: 'list',
    name: 'installCliGlobal',
    message: 'Install PURISTA cli globally?',
    when(answers) {
      return answers.initialize
    },
    choices: [
      { name: 'install as global npm module', checked: true },
      { name: 'as local module in this project only' },
    ],
  },
  {
    type: 'checkbox',
    message: 'Do you like to install eslint and prettier for better code formatting?',
    name: 'lintTestModules',
    when(answers) {
      return answers.initialize
    },
    choices: [
      { name: 'code style: eslint and prettier', value: 'installLint', checked: true },
      { name: 'testing: jest and sinon', value: 'installTest', checked: true },
    ],
  },
  {
    type: 'list',
    message: 'Which messaging system should be used',
    name: 'eventBridge',
    when(answers) {
      return answers.initialize
    },
    choices: [
      { value: 'DefaultEventBridge', name: 'local internal default eventbridge', checked: true },
      { value: 'AmqpEventBridge', name: 'AMQP eventbridge (RabbitMQ)' },
      { value: 'MqttEventBridge', name: 'MQTT eventbridge (mosquitto)' },
      { value: 'NatsEventBridge', name: 'NATS eventbridge' },
      { value: 'DaprEventBridge', name: 'Dapr eventbridge' },
    ],
  },
  {
    type: 'confirm',
    message: 'Should the @purista/httpserver package be installed, to automatically provide a REST api server?',
    name: 'installHttpService',
    when(answers) {
      return answers.initialize && answers.eventBridge !== 'DaprEventBridge'
    },
  },
  {
    type: 'confirm',
    message: 'Should the http service be able to provide static files - files and assets like images & css?',
    name: 'installStaticPlugin',
    when(answers) {
      return answers.initialize && answers.installHttpService && answers.eventBridge !== 'DaprEventBridge'
    },
  },
]
