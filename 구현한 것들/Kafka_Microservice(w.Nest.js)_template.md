#### 회사에서 카프카를 도입함에 따라 구현 연구의 일환으로 작성했던 개인 프로젝트입니다.
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

## architecture
### 발퀄 그림 죄송합니다..
![explained](https://user-images.githubusercontent.com/78771384/151653623-6778824e-5de4-4346-841f-f07773f4db25.png)

## use decorator (this not follows Nest.js DI. please refer to kafka-client/src/decorators)
### Decorator Factory (you can check whole implementation in kafka-client/src/factory.ts)
```typescript
function kafkaEventDecoratorFactory<T extends (...args: any) => any>(
  topic: string,
  kafkaSender: KafkaBatchSender,
  kafkaEvent: symbol,
  // you have to specify the ACTUAL event collecting processes(specifier)
  specifier: (
    args: IArguments,
    preservedMethod: any,
  ) => Promise<{
    preservedResult: ReturnType<ReturnType<T>>;
    message: Message;
  }>,
) {
  let messages: Message[] = [];

  return function kafkaTopicDecorator() {
    return function (
      target: any,
      prop: string,
      descriptor: PropertyDescriptor,
    ) {
      const preservedMethod = descriptor.value;

      descriptor.value = async function () {
        const specifierResult = await specifier(arguments, preservedMethod);

        messages.push(specifierResult.message);

        if (messages.length >= 10) {
          kafkaSender.topicMessages = { topic, messages };
          // for expandable usages of function, it use events
          kafkaSender.emit(kafkaEvent);
          messages = [];
        }

        return specifierResult.preservedResult;
      };
    };
  };
}

// then use it like this in the controller...
 @Post('FIRST_TOPIC_DECORATED')
 @exampleDecorator()
 async someAsynchronousHandler_1(@Text() text) {
   // some async task....
   await new Promise((res) => {
     setTimeout(() => res(text), 500);
   });
 }
```

## EventEmitter extended Kafka sender
uses queueMicrotask function to execute send method
```typescript
export class KafkaBatchSender extends EventEmitter {
  constructor(private readonly producer: Producer) {
    super();
  }

  private batchForm: ProducerBatch = {
    compression: CompressionTypes.GZIP,
    topicMessages: [],
  };

  // 토픽 메세지를 채워넣습니다
  set topicMessages(topicMessages: TopicMessages) {
    // batchForm 기본 값이 존재하므로 언제나 undefined가 아닙니다.
    this.batchForm.topicMessages
      ? this.batchForm.topicMessages.push(topicMessages)
      : // 'possibly undefined' since 'topicMessages' is optional  
        Object.defineProperty(this.batchForm, 'topicMessages', {
          writable: true,
          value: [],
        }) &&
        (this.batchForm.topicMessages as any as Array<TopicMessages>).push(
          topicMessages,
        );
  }

  public sendBatch() {
    if (
      this.batchForm.topicMessages &&
      this.batchForm.topicMessages.length >= 10
    ) {

      queueMicrotask(async () => {
        await this.producer.connect();
        await this.producer.sendBatch(this.batchForm);
        await this.producer.disconnect();

        this.batchForm.topicMessages = [];
      });
    }
  }
}
```

## Or, use collector functions explicitly
## Topic-specific closure func Factory
```typescript
export function eventReceiverFactory(
  topic: string,
  kafkaSender: KafkaSender,
  kafkaSendEvent: symbol,
) {
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
        // use setter and emitter
        kafkaSender.topicMessages = { topic, messages };
        kafkaSender.emit(kafkaSendEvent);

        messages = [];
      }
    };
  };
}
```


## Chaining dependencies by token to inject only end of the chain
```typescript
export const clientModule = ClientsModule.register([
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
    const kafkaSender = new KafkaSender(producer);
    // register event
    kafkaSender.on(kafkaSend, () => kafkaSender.sendBatch());

    return kafkaSender;
  },
  inject: ['PRODUCER'],
};

const firstEventReceiver = {
  provide: 'FIRST_TOPIC_RECEIVER',
  useFactory: (kafkaSender: KafkaSender) => {
    return eventReceiverFactory('FIRST_TOPIC', kafkaSender, kafkaSend);
  },
  inject: ['KAFKA_SENDER'],
};

const secondEventReceiver = {
  provide: 'SECOND_TOPIC_RECEIVER',
  useFactory: (kafkaSender: KafkaSender) => {
    return eventReceiverFactory('SECOND_TOPIC', kafkaSender, kafkaSend);
  },
  inject: ['KAFKA_SENDER'],
};

export default [producer, kafkaSender, firstEventReceiver, secondEventReceiver];
```
exported default above will spread in module 'provides'...

## Then inject only produced functions..
```typescript
constructor(
    @Inject('FIRST_TOPIC_RECEIVER')
    private readonly firstTopicReceiver: ReturnType<typeof eventReceiverFactory>,

    @Inject('SECOND_TOPIC_RECEIVER')
    private readonly secondTopicReceiver: ReturnType<typeof eventReceiverFactory>,
  ) {}
```




