import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TourService } from '../tour.service';
import { Tour } from './model/tour.model';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

import { EquipmentDialogComponent } from '../equipment-dialog/equipment-dialog.component';
import { EquipmentService } from '../equipment.servise';
import { Equipment } from './model/equipment.model';

import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css'],
})
export class TourComponent implements OnInit {
  tour: Tour[] = [];
  selectedTour: Tour;
  page: number = 1;
  pageSize: number = 5;
  tourCounter: number;
  equipment: Equipment[] = [];
  shouldAddPoint: boolean = false;

  shouldAddObject: boolean = false;

  showTourForm: boolean = false;

  shouldEdit: boolean = false;
  shouldRenderTourForm: boolean = false;

  constructor(
    private tokenStorage: TokenStorage,
    private service: TourAuthoringService,
    private dialog: MatDialog,
    private equipmentService: EquipmentService,
    private router: Router
  ) {}

  loadTours() {
    const userId = this.tokenStorage.getUserId();

    this.service.getTourByGuide(userId, this.page, this.pageSize).subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tour = result.results;
        this.tourCounter = result.totalCount;
        console.log('Sadržaj result.results:', result.results);

        const tourIds = this.tour.map((tour) => tour.id);
      },
      error(err: any) {
        console.log(err);
      },
    });
  }

  loadEquipment() {
    this.equipmentService
      .getEquipment()
      .subscribe((pagedResults: PagedResults<Equipment>) => {
        this.equipment = pagedResults.results;
        console.log(this.equipment);
      });
  }

  showMoreTours() {
    this.page++;
    this.loadTours();
  }

  showLessTours() {
    this.page--;
    this.loadTours();
  }

  openEquipmentDialog(tour: Tour) {
    this.selectedTour = tour;
    console.log(this.selectedTour);
    this.loadEquipment();

    const dialogRef = this.dialog.open(EquipmentDialogComponent, {
      width: '400px',
      data: { selectedTour: tour, equipment: this.equipment },
    });

    dialogRef.afterClosed().subscribe((selectedEquipment: any[]) => {});
  }

  ngOnInit(): void {
    this.loadTours();
  }

  onAddPoint(tour: Tour): void {
    this.selectedTour = tour;
    var emissionString = '';
    if (this.shouldAddPoint == true) {
      emissionString = this.selectedTour.id!.toString() + '|#$%@$%|' + 'same';
    } else {
      emissionString = this.selectedTour.id!.toString();
    }
    this.shouldAddPoint = true;
    this.shouldAddObject = false;
    this.showTourForm = false;
    this.service.changeTourId(emissionString);
  }

  onAddObj(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldAddObject = true;
    var emissionString = '';
    if (this.shouldAddObject == true) {
      emissionString = this.selectedTour.id!.toString() + '|#$%@$%|' + 'same';
    } else {
      emissionString = this.selectedTour.id!.toString();
    }
    this.shouldAddPoint = false;
    this.showTourForm = false;
    this.service.changeTourId(emissionString);
  }

  viewMap(idTour: number | undefined): void {
    if (idTour !== undefined) {
      this.router.navigate([`/tourMap/${idTour}`]);
    } else {
      console.error('ID nije definisan.');
    }
  }

  addTour() {
    this.showTourForm = true;
    this.shouldAddObject = false;
    this.shouldAddPoint = false;
    this.shouldRenderTourForm = false;
    this.shouldEdit = false;
  }

  deleteTour(tour: Tour): void {
    this.service.deleteTour(tour).subscribe({
      next: (_) => {
        this.loadTours();
      },
    });
  }

  onEditClicked(tour: Tour): void {
    this.shouldEdit = true;
    this.showTourForm = false;
    this.shouldRenderTourForm = true;
    this.selectedTour = tour;
  }
}
