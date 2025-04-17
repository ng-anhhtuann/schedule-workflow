import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  @Cron('0 11 * * *')
  handleElevenAmJob() {
    console.log('=================');
    console.log('Running job at 11:00 AM');
    console.log('=================');
  }

  @Cron('5 11 * * *')
  handleElevenOhFiveJob() {
    console.log('=================');
    console.log('Running job at 11:05 AM');
    console.log('=================');
  }
}
