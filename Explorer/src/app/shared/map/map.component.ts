import { Component, AfterViewInit, Input, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

import 'leaflet-routing-machine';

import { Observable, Subscription, forkJoin } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { TourPoint } from 'src/app/feature-modules/tour-authoring/model/tourPoints.model';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: any;
  tourId: string;
  objects: { latitude: number; longitude: number }[];
  tourIdSubscription: Subscription | undefined = undefined;

  constructor(
    private service: MapService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private tourAuthoringService: TourAuthoringService
  ) {}

  private initMap(): void {
    this.map = this.service.initMap();
    this.registerOnClick();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconAnchor: [12, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    setTimeout(() => {
      this.initMap();
    }, 0);
    this.setRoute();
    this.setObjects();
  }

  ngOnInit() {
    if (this.tourIdSubscription != undefined) {
      this.tourIdSubscription.unsubscribe();
    }

    this.tourIdSubscription = this.tourAuthoringService.currentTourId.subscribe(
      (tourId) => {
        this.tourId = tourId.split('|#$%@$%|')[0];
        if (tourId.split('|#$%@$%|').length > 1) {
          if (tourId.split('|#$%@$%|')[1] === 'same') {
            this.ngAfterViewInit();
          }
        }
      }
    );
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.service.setCoordinates({ lat, lng });
      this.service.reverseSearch(lat, lng).subscribe((res) => {
        console.log(res.display_name);
      });
      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );
      const mp = new L.Marker([lat, lng]).addTo(this.map);
      alert(mp.getLatLng());
    });
  }

  setObjects() {
    this.tourAuthoringService
      .getObjInTourByTourId(parseInt(this.tourId))
      .subscribe(
        (objects: any) => {
          this.objects = objects;
          this.objects.forEach((object) => {
            L.marker([object.latitude, object.longitude]).addTo(this.map);
          });
          console.log('Dohvaćeni objekti:', objects);
        },
        (error) => {
          console.error('Greška prilikom dohvatanja objekata:', error);
        }
      );
  }

  setRoute(): void {
    this.tourAuthoringService
      .getTourPointsByTourId(parseInt(this.tourId))
      .subscribe((tourData: any) => {
        const tourPoints = tourData.results;

        const waypoints = tourPoints.map((point: any) =>
          L.latLng(point.latitude, point.longitude)
        );

        const routeControl = L.Routing.control({
          waypoints: waypoints,
          router: L.routing.mapbox(
            'pk.eyJ1IjoiYW5hYm9za292aWNjMTgiLCJhIjoiY2xvNHZrNjd2MDVpcDJucnM3M281cjE0OSJ9.y7eV9FmLm7kO_2FtrMaJkg',
            { profile: 'mapbox/walking' }
          ),
        }).addTo(this.map);
      });
  }
}
