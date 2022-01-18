// Nest 기반 Winston 로거
// @nestjs/common에서 제공하는 LoggerService interface를 implements하여 제작했고, winston을 사용한 로거입니다.
// warn레벨 이상의 로그와 debug레벨 이상의 로그를 저장하는 daily rotate file을 각각 생성하고, warn 레벨 이상의 로그 발생시 저장뿐 아니라 슬랙에 메세지를 보냅니다.

import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as SlackHook from 'winston-slack-webhook-transport';
import * as moment from 'moment';
import { LoggerService } from '@nestjs/common';
import { hostname } from 'os';
import { NodeEnv, FindKey, SlackMessageFormat } from '../../types';
import { Colors, ErrorCodes } from '../../fe_be_common_consts';
import { UtilService } from '../util/util.service';

// https://github.com/winstonjs/winston
// https://www.npmjs.com/package/winston-slack-webhook-transport
// https://github.com/winstonjs/winston-daily-rotate-file
// https://stackoverflow.com/questions/9380785/node-js-winston-can-i-add-default-meta-data-to-all-log-messages
// https://stackoverflow.com/questions/42858585/add-module-name-in-winston-log-entries

const { combine, printf, label, timestamp, colorize } = winston.format;

export class WinstonLogger implements LoggerService {
  constructor(
    private readonly name: string,
    private readonly NODE_ENV: NodeEnv,
    private readonly typeGuard = UtilService.isTypeOf,
  ) {
    this.typeGuard = typeGuard;
    this.name = name;
    this.logger = winston.createLogger({
      level: 'debug',
      format: combine(
        label({ label: 'TTV' }),
        this.addContextNameFormatAndPIDAndHostname(),
        timestamp({ format: 'YYYY-MM-DD (HH:MM:s)' }),
        this.myFormat,
      ),
      defaultMeta: { context: name },
      transports: [
        new DailyRotateFile({
          filename: '%DATE%-error.log',
          datePattern: 'YYYY-MM-DD',
          level: 'warn',
          dirname: './log',
          maxFiles: 30,
        }).on('logRemoved', removedFilename => {
          console.log(
            "Day before 30 days's Error Log file was removed, Filename:" +
              removedFilename,
          );
        }),
        new DailyRotateFile({
          filename: '%DATE%-combined.log',
          datePattern: 'YYYY-MM-DD',
          level: 'debug',
          zippedArchive: true,
          dirname: './log',
          maxSize: '100m',
          maxFiles: 365,
        }),
        new SlackHook({
          webhookUrl:
            'https://hooks.slack.com/services/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',
          level: 'warn',
          name: 'Waynehills-Dev-Team',
          formatter: error => {
            return {
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text:
                      ':blobhelp: *' +
                      (error.exception || 'Unknown Exception') +
                      '!* :blobhelp:',
                  },
                },
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: this.slackMessageFormat(error),
                  },
                },
              ],
            };
          },
        }),
      ],
    });

    if (this.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: combine(this.myFormat, colorize()),
        }),
      );
    }
  }

  /**
   * ⬇︎⬇︎⬇︎⬇︎⬇︎⬇ PRIVATE VARIABLES ⬇︎⬇︎⬇︎⬇︎⬇︎⬇
   */

  private readonly logger: winston.Logger;
  private readonly errorKeys: string[] = Object.keys(ErrorCodes);
  private readonly myFormat: winston.Logform.Format = printf(
    ({
      level,
      message,
      label,
      timestamp,
      exception,
      code,
      context,
      hostname,
      PID,
      callstack,
    }) => {
      if (level === 'error' || level === 'warn') {
        return `${Colors.BgBlue}${Colors.FgBlack}${hostname}(${PID})${
          Colors.BgGreen
        } ${timestamp} ${Colors.BgWhite}[${label}]${Colors.BgBlack}\n${
          Colors.FgRed
        }${level}${Colors.FgWhite}${Colors.BgBlack} at ${Colors.BgBlack}${
          Colors.FgCyan
        }${context}:\n${Colors.FgYellow}${exception}: ${message}${
          Colors.FgMagenta
        }\nCode: ${code}(${this.findKey(this.errorKeys, code)})\n${
          Colors.FgYellow
        }${Colors.BgRed}Call stack:${Colors.BgBlack}${
          Colors.FgWhite
        }\n${this.deleteFirstLine(callstack)}`;
      } else {
        return `${Colors.BgBlue}${Colors.FgBlack}${hostname}(${PID})${Colors.BgGreen} ${timestamp} ${Colors.BgWhite}[${label}]${Colors.BgBlack}\n${Colors.FgRed}${level}${Colors.FgWhite}${Colors.BgBlack} at ${Colors.BgBlack}${Colors.FgCyan}${context}:\n${Colors.FgYellow}${message}`;
      }
    },
  );

  /**
   * ⬇︎⬇︎⬇︎⬇︎⬇︎⬇︎ PRIVATE METHODS ⬇︎⬇︎⬇︎⬇︎⬇︎⬇︎
   */

  private readonly findKey: FindKey = (
    errorKeys: string[],
    code: ErrorCodes,
  ) => {
    return errorKeys.find(key => ErrorCodes[key] === code);
  };

  // 윈스턴이 출력하는 로그 객체의 포맷을 조정할 수 있는 기능입니다. 정해진 양식은 존재하지 않고 자신이 원하는 정보를 객체에 추가하는 형식입니다.
  private readonly addContextNameFormatAndPIDAndHostname: winston.Logform.FormatWrap = winston.format(
    log => {
      log.context = this.name;
      log.PID = process.pid;
      log.hostname = hostname();
      return log;
    },
  );

  // 에러 스택의 첫 번째 줄은 중복된 정보가 포함됩니다.
  private readonly deleteFirstLine = (callstack: string) => {
    return callstack.slice(callstack.indexOf('\n') + 1);
  };

  private readonly slackMessageFormat: SlackMessageFormat = error => `
    Server: ${error.hostname || ':warning: Unknown Server :warning:'}
    PID: ${error.PID || ':warning: Unknown PID :warning:'}
    When: ${'`'}${moment(new Date()).format('YYYY-MM-DD (HH:MM:s)')}${'`'}
    Level: ${error.level === 'error' ? '*ERROR*' : '*WARN*'}
    Code: ${error.code ||
      ':warning: Unknown error code :warning:'} (${this.findKey(
    this.errorKeys,
    (this.typeGuard<number>(error.code, 'number') && error.code) || 0,
  ) || ':warning: Unknown Error name :warning:'})
    Message: ${
      JSON.stringify(error.message) === '{}'
        ? ':warning: Unknown message :warning:'
        : error.message
    }
    Stack: ${
      this.typeGuard<string>(error.callstack, 'string')
        ? this.deleteFirstLine(error.callstack)
        : ':warning: Unknown callstack :warning:'
    }`;

  /**
   * ⬇︎⬇︎⬇︎⬇︎⬇︎⬇︎ PUBLIC METHODS ⬇︎⬇︎⬇︎⬇︎⬇︎⬇︎
   */

  public error(error: any, code: ErrorCodes) {
    this.logger.error({
      exception: error.name,
      code,
      message: error.message,
      callstack: error.stack,
    });
  }

  public warn(error: any, code: ErrorCodes) {
    this.logger.error({
      exception: error.name,
      code,
      message: error.message,
      callstack: error.stack,
    });
  }

  public log(level: string, message: string) {
    return this.logger.log(level, message);
  }

  public debug(message: string) {
    return this.logger.debug(message);
  }
}

