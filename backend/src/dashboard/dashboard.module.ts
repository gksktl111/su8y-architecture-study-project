import {Module} from '@nestjs/common';
import {DashboardController} from './api/dashboard.controller';
import {DashboardService} from './application/dashboard.service';
import {HttpModule} from '@nestjs/axios';
import {AuthModule} from '../auth/auth.module';

@Module({
    imports: [HttpModule, AuthModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {
}
