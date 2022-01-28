# Full implementaion
https://github.com/BJS-kr/nestjs_kafka_microservice


# Nest.js_Kafka_Microservice
practical examples of both client and server for building Kafka-microservice using Nest.js.
This full implementation can run in an instant, provided Docker already installed your machine.
After environment all be set, run 'npm i' and './starter' bash script on the root. 

# Core implementations
## What I've tried to solve
#### 1. How to collect data before and after asynchronous tasks done?
#### 2. How to inject topic-specific function as dependency?
#### 3. How to produce those functions effectively?
#### 4. How to encapsulate collected datas?
#### 5. How to make commuicate between data collecting function and Kafka sender object?

## Here's the architecture and code
![explained](https://user-images.githubusercontent.com/78771384/151597884-99cf4d8b-2d6f-4d52-b798-f595a9fb641e.png)

## Topic-specific closure func Factory
```typescript
import { KafkaSender } from './kafkaSender';

export function dataGatherer(topic: string, kafkaSender: KafkaSender) {
  let messages = [];
  return function (textLength: number, startTime: number) {
    return function (endTime: number) {
      messages.push({
        value: JSON.stringify({
          textLength: textLength,
          responseTime: endTime - startTime,
        }),
      });
      
      if (messages.length >= 10) {
        kafkaSender.topicMessages = { topic, messages };
        messages = [];
      }
    };
  };
}
```

## Chaining dependencies by token to inject only end of the chain
```typescript
const clientModule = ClientsModule.register([
  {
    name: 'KAFKA',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'Client',
        brokers: ['localhost:9092'],
      },
    },
  },
]);

const producer = {
  provide: 'PRODUCER',
  useFactory: async (clientKafka: ClientKafka): Promise<Producer> => {
    return await clientKafka.connect();
  },
  inject: ['KAFKA'],
};

const kafkaSender = {
  provide: 'KAFKA_SENDER',
  useFactory: (producer: Producer) => {
    return new KafkaSender(producer);
  },
  inject: ['PRODUCER'],
};

const firstEventReceiver = {
  provide: 'FIRST_EVENT_RECEIVER',
  useFactory: (kafkaSender: KafkaSender) => {
    return dataGatherer('FIRST_EVENT', kafkaSender);
  },
  inject: ['KAFKA_SENDER'],
};

const secondEventReceiver = {
  provide: 'SECOND_EVENT_RECEIVER',
  useFactory: (kafkaSender: KafkaSender) => {
    return dataGatherer('SECOND_EVENT', kafkaSender);
  },
  inject: ['KAFKA_SENDER'],
};

export default [producer, kafkaSender, firstEventReceiver, secondEventReceiver];
```
## Then inject essentials..
```typescript
constructor(
    @Inject('FIRST_EVENT_RECEIVER')
    private readonly firstEventReceiver: ReturnType<typeof dataGatherer>,

    @Inject('SECOND_EVENT_RECEIVER')
    private readonly secondEventReceiver: ReturnType<typeof dataGatherer>,
  ) {}
```
