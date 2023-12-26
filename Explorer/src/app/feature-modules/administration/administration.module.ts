import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
//import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { AppRatingFormComponent } from './app-rating-form/app-rating-form.component';
import { AppRatingsComponent } from './app-ratings/app-ratings.component';
import { AccountComponent } from './account/account.component';
import { UserPositionComponent } from './user-position/user-position.component'; 
import { SharedModule } from 'src/app/shared/shared.module';

import { ProfileComponent } from './profile/profile.component';
import { PublicTourPointRequestComponent } from './public-tour-point-request/public-tour-point-request.component';
import { RequestResponseNotificationComponent } from './request-response-notification/request-response-notification.component';
import { UserStatisticsComponent } from './user-statistics/user-statistics.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    //EquipmentFormComponent,
    //EquipmentComponent,
    AccountComponent,
    ProfileComponent,
    AppRatingFormComponent,
    AppRatingsComponent,
    PublicTourPointRequestComponent,
    RequestResponseNotificationComponent,
    UserPositionComponent,
    UserStatisticsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    //EquipmentComponent,
    //EquipmentFormComponent,
    AccountComponent,
    ProfileComponent,
    AppRatingsComponent,
    AppRatingFormComponent,
    RequestResponseNotificationComponent,
    UserPositionComponent
  ]
})
export class AdministrationModule { }